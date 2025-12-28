// 씨앗 티어
export type SeedTier =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic";

// 나무 종류
export type TreeSpecies =
  // Common
  | "willow"
  | "poplar"
  | "birch"
  // Uncommon
  | "pine"
  | "cherry"
  | "apple"
  // Rare
  | "olive"
  | "maple"
  // Epic
  | "sequoia"
  | "baobab"
  // Legendary
  | "dragon_blood"
  | "bristlecone"
  // Mythic
  | "wollemi";

// 나무 상태
export type TreeStatus =
  | "seed" // 씨앗 (방금 심음, 0 step)
  | "seedling" // 새싹 (1+ step)
  | "growing" // 성장 중
  | "mature"; // 수확 가능

// 나무
export interface Tree {
  id: string;
  tier: SeedTier;
  species: TreeSpecies;
  currentStep: number;
  requiredSteps: number;
  status: TreeStatus;
  tilePosition: {
    x: number;
    y: number;
  };
  plantedAt: string; // ISO timestamp
  lastWateredAt: string | null;
}

// 씨앗
export interface Seed {
  id: string;
  tier: SeedTier;
  species: TreeSpecies;
  obtainedAt: string; // ISO timestamp
  source: "harvest" | "ad" | "tutorial";
}

// 쿨다운 타입
export type CooldownType =
  | "water" // 물주기: 일일 1회
  | "fertilizer" // 비료: 20분
  | "seed_ad"; // 씨앗 광고: 3시간

// 쿨다운 상태
export interface Cooldown {
  type: CooldownType;
  lastUsedAt: string; // ISO timestamp
  durationMs: number;
}

// 튜토리얼 단계
export type TutorialStep =
  | "not_started"
  | "water_tree"
  | "harvest_tree"
  | "plant_seed"
  | "fertilize_intro"
  | "completed";

// 튜토리얼 상태
export interface TutorialState {
  currentStep: TutorialStep;
  completedAt: string | null;
}

// 통계
export interface GameStats {
  totalHarvested: number;
  weeklyHarvested: number;
  weeklyScore: number;
  lastWeekReset: string;
}

// 전체 게임 상태
export interface GameState {
  version: number;
  trees: Tree[];
  seeds: Seed[];
  totalPoints: number;
  tutorial: TutorialState;
  stats: GameStats;
  createdAt: string;
  lastSavedAt: string;
}

// 쿨다운 상태 (별도 스토어)
export interface CooldownState {
  cooldowns: Record<CooldownType, Cooldown | null>;
}

// 타일 위치
export interface TilePosition {
  x: number;
  y: number;
}
