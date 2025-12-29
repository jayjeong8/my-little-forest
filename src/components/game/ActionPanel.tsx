"use client";

import type { Tree, TilePosition, Seed } from "@/types/game";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { CooldownTimer } from "@/components/ui/CooldownTimer";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useToast } from "@/components/ui/Toast";
import { useCooldown, useCooldowns } from "@/hooks/useCooldowns";
import { useSeeds } from "@/hooks/useSeeds";
import { useTrees } from "@/hooks/useTrees";
import { useTutorial } from "@/hooks/useTutorial";
import {
  SPECIES_NAMES,
  TIER_NAMES,
  TIER_COLORS,
  TIER_BG_COLORS,
} from "@/lib/constants";

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-3 w-full py-2 text-sm text-gray-500 hover:text-gray-700"
    >
      닫기
    </button>
  );
}

interface SeedPickerProps {
  seeds: Seed[];
  selectedSeed: Seed | null;
  onSelect: (seed: Seed) => void;
}

function SeedPicker({ seeds, selectedSeed, onSelect }: SeedPickerProps) {
  return (
    <div className="mb-3 max-h-40 space-y-2 overflow-y-auto">
      {seeds.map((seed) => (
        <button
          key={seed.id}
          onClick={() => onSelect(seed)}
          className={`w-full rounded-lg p-2 text-left transition-colors ${
            selectedSeed?.id === seed.id
              ? "ring-2 ring-green-500 " + TIER_BG_COLORS[seed.tier]
              : "bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{SPECIES_NAMES[seed.species]}</span>
            <span className={`text-sm ${TIER_COLORS[seed.tier]}`}>
              {TIER_NAMES[seed.tier]}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

function FullScreenAd({ progress }: { progress: number }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 text-center text-white">
        <div className="mb-8 text-6xl">📺</div>
        <h2 className="mb-2 text-2xl font-bold">광고 시청 중</h2>
        <p className="mb-8 text-gray-400">
          광고가 끝나면 비료를 받을 수 있어요
        </p>
        <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-gray-700">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-lg text-gray-300">
          {progress < 100 ? `${Math.round(progress)}%` : "🎁 보상 지급 중..."}
        </p>
      </div>
    </div>
  );
}

interface ActionPanelProps {
  selectedTile: {
    position: TilePosition;
    tree?: Tree;
  };
  onClose: () => void;
  onHarvest: (treeId: string) => void;
  hasSeed: boolean;
}

export function ActionPanel({
  selectedTile,
  onClose,
  onHarvest,
  hasSeed,
}: ActionPanelProps) {
  const { position } = selectedTile;
  const { waterTree, fertilizeTree, plantSeed, canWater, getTreeAt } =
    useTrees();
  const { seeds } = useSeeds();
  const { advanceTutorial, isStep } = useTutorial();
  const { showToast } = useToast();
  const fertilizerCooldown = useCooldown("fertilizer");
  const { startCooldown } = useCooldowns();

  // store에서 최신 나무 데이터 가져오기 (실시간 업데이트)
  const tree = getTreeAt(position);

  const [selectedSeedForPlanting, setSelectedSeedForPlanting] =
    useState<Seed | null>(seeds.length > 0 ? seeds[0] : null);

  // 비료 광고 상태
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adProgress, setAdProgress] = useState(0);

  const handleWater = () => {
    if (!tree) return;

    const success = waterTree(tree.id);

    if (success) {
      showToast("💧 물을 주었어요!", "success");

      if (isStep("water_tree")) {
        advanceTutorial();
      }
    } else {
      showToast("물주기 쿨다운 중이에요", "warning");
    }
  };

  const handleFertilize = useCallback(() => {
    if (!tree || isWatchingAd || fertilizerCooldown.isOnCooldown) return;

    // 광고 시청 시작
    setIsWatchingAd(true);
    setAdProgress(0);

    const interval = setInterval(() => {
      setAdProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          return 100;
        }

        return prev + 10;
      });
    }, 300);

    // 3초 후 비료 적용
    setTimeout(() => {
      clearInterval(interval);
      setIsWatchingAd(false);
      setAdProgress(0);

      // 비료 적용
      const success = fertilizeTree(tree.id);

      if (success) {
        startCooldown("fertilizer");
        showToast("🌿 비료를 주었어요!", "success");

        if (isStep("fertilize_intro")) {
          advanceTutorial();
        }
      }
    }, 3000);
  }, [
    tree,
    isWatchingAd,
    fertilizerCooldown.isOnCooldown,
    fertilizeTree,
    startCooldown,
    showToast,
    isStep,
    advanceTutorial,
  ]);

  const handlePlant = () => {
    if (tree || !selectedSeedForPlanting) return;

    const success = plantSeed(selectedSeedForPlanting.id, position);

    if (success) {
      showToast(
        `🌱 ${SPECIES_NAMES[selectedSeedForPlanting.species]} 씨앗을 심었어요!`,
        "success",
      );
      onClose();

      if (isStep("plant_seed")) {
        advanceTutorial();
      }
    }
  };

  if (tree) {
    const isMature = tree.status === "mature";

    return (
      <div className="mt-4 rounded-xl bg-white p-4 shadow-lg">
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-bold">{SPECIES_NAMES[tree.species]}</h3>
            <span className="text-sm text-gray-500">
              {TIER_NAMES[tree.tier]}
            </span>
          </div>
          <ProgressBar
            current={tree.currentStep}
            max={tree.requiredSteps}
            color={isMature ? "green" : "blue"}
          />
        </div>

        <div className="flex gap-2">
          {isMature ? (
            <Button
              variant="success"
              className="flex-1"
              onClick={() => onHarvest(tree.id)}
            >
              🎉 수확하기
            </Button>
          ) : (
            <>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleWater}
                disabled={!canWater}
              >
                💧 물주기
                {!canWater && <CooldownTimer type="water" className="ml-2" />}
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleFertilize}
                disabled={fertilizerCooldown.isOnCooldown || isWatchingAd}
              >
                {fertilizerCooldown.isOnCooldown ? (
                  <>
                    🌿 비료
                    <CooldownTimer type="fertilizer" className="ml-2" />
                  </>
                ) : (
                  "📺 비료 (광고)"
                )}
              </Button>
            </>
          )}
        </div>

        <CloseButton onClick={onClose} />
        {isWatchingAd && <FullScreenAd progress={adProgress} />}
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl bg-white p-4 shadow-lg">
      <h3 className="mb-4 text-lg font-bold">빈 땅</h3>

      {hasSeed ? (
        <div>
          <p className="mb-3 text-gray-600">심을 씨앗을 선택하세요</p>
          <SeedPicker
            seeds={seeds}
            selectedSeed={selectedSeedForPlanting}
            onSelect={setSelectedSeedForPlanting}
          />
          <Button
            variant="success"
            className="w-full"
            onClick={handlePlant}
            disabled={!selectedSeedForPlanting}
          >
            🌱 씨앗 심기
          </Button>
        </div>
      ) : (
        <p className="text-gray-500">
          씨앗이 없어요. 광고를 시청하거나 나무를 수확해서 씨앗을 얻으세요.
        </p>
      )}

      <CloseButton onClick={onClose} />
    </div>
  );
}
