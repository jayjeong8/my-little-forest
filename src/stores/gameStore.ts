import type {
  Tree,
  Seed,
  GameState,
  TutorialStep,
  TilePosition,
  SeedTier,
  TreeSpecies,
  TreeStatus,
} from "@/types/game";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  TIER_STEPS,
  TIER_WEIGHTS,
  TIER_BASE_REWARDS,
  SPECIES_BY_TIER,
  STORAGE_KEYS,
} from "@/lib/constants";

// ============================================================
// 유틸리티 함수
// ============================================================

const generateId = (): string => {
  // crypto.randomUUID()가 없는 환경(SSR, 구형 브라우저)을 위한 폴백
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // 폴백: 타임스탬프 + 랜덤 문자열
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

/** 두 타일 위치가 같은지 비교 */
const positionEquals = (a: TilePosition, b: TilePosition): boolean =>
  a.x === b.x && a.y === b.y;

/** 티어에 맞는 랜덤 나무 종류 선택 */
const getRandomSpecies = (tier: SeedTier): TreeSpecies => {
  const species = SPECIES_BY_TIER[tier];

  return species[Math.floor(Math.random() * species.length)];
};

/** 현재 스텝에 따른 나무 상태 계산 */
const calculateTreeStatus = (
  currentStep: number,
  requiredSteps: number,
): TreeStatus => {
  if (currentStep === 0) return "seed";
  if (currentStep === 1) return "seedling";
  if (currentStep >= requiredSteps) return "mature";

  return "growing";
};

// ============================================================
// 타입 정의
// ============================================================

/** 수확 결과 */
export interface HarvestResult {
  reward: number;
  seed: Seed;
}

interface GameActions {
  // 나무
  plantSeed: (seedId: string, position: TilePosition) => boolean;
  waterTree: (treeId: string) => boolean;
  fertilizeTree: (treeId: string) => boolean;
  harvestTree: (treeId: string) => HarvestResult | null;

  // 씨앗
  addSeed: (tier: SeedTier, source: Seed["source"]) => Seed;
  removeSeed: (seedId: string) => void;

  // 포인트
  addPoints: (amount: number) => void;

  // 튜토리얼
  initializeTutorial: () => void;
  advanceTutorial: () => void;
  setTutorialStep: (step: TutorialStep) => void;

  // 조회
  getTreeAt: (position: TilePosition) => Tree | undefined;
  isPositionOccupied: (position: TilePosition) => boolean;

  // 초기화
  resetGame: () => void;
}

type GameStore = GameState & GameActions;

const createInitialState = (): GameState => ({
  version: 1,
  trees: [],
  seeds: [],
  totalPoints: 0,
  tutorial: {
    currentStep: "not_started",
    completedAt: null,
  },
  stats: {
    totalHarvested: 0,
    weeklyHarvested: 0,
    weeklyScore: 0,
    lastWeekReset: new Date().toISOString(),
  },
  createdAt: new Date().toISOString(),
  lastSavedAt: new Date().toISOString(),
});

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      plantSeed: (seedId, position) => {
        const { seeds, trees } = get();
        const seed = seeds.find((s) => s.id === seedId);

        if (!seed) return false;

        // 이미 나무가 있는지 확인
        const isOccupied = trees.some((t) =>
          positionEquals(t.tilePosition, position),
        );
        if (isOccupied) return false;

        const newTree: Tree = {
          id: generateId(),
          tier: seed.tier,
          species: seed.species,
          currentStep: 0,
          requiredSteps: TIER_STEPS[seed.tier],
          status: "seed",
          tilePosition: position,
          plantedAt: new Date().toISOString(),
          lastWateredAt: null,
        };

        set({
          trees: [...trees, newTree],
          seeds: seeds.filter((s) => s.id !== seedId),
          lastSavedAt: new Date().toISOString(),
        });

        return true;
      },

      waterTree: (treeId) => {
        const { trees } = get();
        const tree = trees.find((t) => t.id === treeId);

        if (!tree || tree.status === "mature") return false;

        const newStep = tree.currentStep + 1;
        const newStatus = calculateTreeStatus(newStep, tree.requiredSteps);

        set({
          trees: trees.map((t) =>
            t.id === treeId
              ? {
                  ...t,
                  currentStep: newStep,
                  status: newStatus,
                  lastWateredAt: new Date().toISOString(),
                }
              : t,
          ),
          lastSavedAt: new Date().toISOString(),
        });

        return true;
      },

      fertilizeTree: (treeId) => {
        // 비료는 물주기와 동일한 효과
        return get().waterTree(treeId);
      },

      harvestTree: (treeId) => {
        const { trees } = get();
        const tree = trees.find((t) => t.id === treeId);

        if (!tree || tree.status !== "mature") return null;

        // 리워드 계산 (기본 리워드 * 랜덤 보너스)
        const baseReward = TIER_BASE_REWARDS[tree.tier];
        const randomBonus = 1 + Math.random() * 0.5; // 1.0 ~ 1.5
        const reward = Math.floor(baseReward * randomBonus);

        // 수확 시 Common 씨앗 확정 지급
        const newSeed: Seed = {
          id: generateId(),
          tier: "common",
          species: getRandomSpecies("common"),
          obtainedAt: new Date().toISOString(),
          source: "harvest",
        };

        const tierWeight = TIER_WEIGHTS[tree.tier];

        set((state) => ({
          trees: state.trees.filter((t) => t.id !== treeId),
          seeds: [...state.seeds, newSeed],
          totalPoints: state.totalPoints + reward,
          stats: {
            ...state.stats,
            totalHarvested: state.stats.totalHarvested + 1,
            weeklyHarvested: state.stats.weeklyHarvested + 1,
            weeklyScore: state.stats.weeklyScore + tierWeight,
          },
          lastSavedAt: new Date().toISOString(),
        }));

        return { reward, seed: newSeed };
      },

      addSeed: (tier, source) => {
        const newSeed: Seed = {
          id: generateId(),
          tier,
          species: getRandomSpecies(tier),
          obtainedAt: new Date().toISOString(),
          source,
        };

        set((state) => ({
          seeds: [...state.seeds, newSeed],
          lastSavedAt: new Date().toISOString(),
        }));

        return newSeed;
      },

      removeSeed: (seedId) => {
        set((state) => ({
          seeds: state.seeds.filter((s) => s.id !== seedId),
          lastSavedAt: new Date().toISOString(),
        }));
      },

      addPoints: (amount) => {
        set((state) => ({
          totalPoints: state.totalPoints + amount,
          lastSavedAt: new Date().toISOString(),
        }));
      },

      initializeTutorial: () => {
        // 튜토리얼용 새싹 상태 나무 생성 (중앙에 배치)
        const tutorialTree: Tree = {
          id: generateId(),
          tier: "common",
          species: "willow",
          currentStep: 1, // 새싹 상태 (1/2)
          requiredSteps: 2,
          status: "seedling",
          tilePosition: { x: 2, y: 2 }, // 5x5 그리드 중앙
          plantedAt: new Date().toISOString(),
          lastWateredAt: null,
        };

        set({
          ...createInitialState(),
          trees: [tutorialTree],
          tutorial: {
            currentStep: "water_tree",
            completedAt: null,
          },
        });
      },

      advanceTutorial: () => {
        const stepOrder: TutorialStep[] = [
          "not_started",
          "water_tree",
          "harvest_tree",
          "plant_seed",
          "fertilize_intro",
          "completed",
        ];

        set((state) => {
          const currentIndex = stepOrder.indexOf(state.tutorial.currentStep);

          if (currentIndex < stepOrder.length - 1) {
            const nextStep = stepOrder[currentIndex + 1];

            return {
              tutorial: {
                currentStep: nextStep,
                completedAt:
                  nextStep === "completed" ? new Date().toISOString() : null,
              },
              lastSavedAt: new Date().toISOString(),
            };
          }

          return state;
        });
      },

      setTutorialStep: (step) => {
        set(() => ({
          tutorial: {
            currentStep: step,
            completedAt: step === "completed" ? new Date().toISOString() : null,
          },
          lastSavedAt: new Date().toISOString(),
        }));
      },

      getTreeAt: (position) =>
        get().trees.find((t) => positionEquals(t.tilePosition, position)),

      isPositionOccupied: (position) =>
        get().trees.some((t) => positionEquals(t.tilePosition, position)),

      resetGame: () => {
        set({
          ...createInitialState(),
        });
      },
    }),
    {
      name: STORAGE_KEYS.game,
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }

        return localStorage;
      }),
      partialize: (state) => ({
        version: state.version,
        trees: state.trees,
        seeds: state.seeds,
        totalPoints: state.totalPoints,
        tutorial: state.tutorial,
        stats: state.stats,
        createdAt: state.createdAt,
        lastSavedAt: state.lastSavedAt,
      }),
      skipHydration: true,
    },
  ),
);
