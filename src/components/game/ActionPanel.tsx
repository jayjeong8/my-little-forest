"use client";

import type { Tree, TilePosition } from "@/types/game";
import { Button } from "@/components/ui/Button";
import { CooldownTimer } from "@/components/ui/CooldownTimer";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useToast } from "@/components/ui/Toast";
import { useSeeds } from "@/hooks/useSeeds";
import { useTrees } from "@/hooks/useTrees";
import { useTutorial } from "@/hooks/useTutorial";
import { SPECIES_NAMES, TIER_NAMES } from "@/lib/constants";

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
  const { tree, position } = selectedTile;
  const { waterTree, fertilizeTree, plantSeed, canWater, canFertilize } =
    useTrees();
  const { seeds } = useSeeds();
  const { advanceTutorial, isStep } = useTutorial();
  const { showToast } = useToast();

  // 물주기 핸들러
  const handleWater = () => {
    if (!tree) return;

    const success = waterTree(tree.id);

    if (success) {
      showToast("💧 물을 주었어요!", "success");

      // 튜토리얼 진행
      if (isStep("water_tree")) {
        advanceTutorial();
      }
    } else {
      showToast("물주기 쿨다운 중이에요", "warning");
    }
  };

  // 비료주기 핸들러
  const handleFertilize = () => {
    if (!tree) return;

    const success = fertilizeTree(tree.id);

    if (success) {
      showToast("🌿 비료를 주었어요!", "success");

      // 튜토리얼 진행
      if (isStep("fertilize_intro")) {
        advanceTutorial();
      }
    } else {
      showToast("비료 쿨다운 중이에요", "warning");
    }
  };

  // 씨앗 심기 핸들러
  const handlePlant = () => {
    if (tree || seeds.length === 0) return;

    // 첫 번째 씨앗 사용
    const seedToPlant = seeds[0];
    const success = plantSeed(seedToPlant.id, position);

    if (success) {
      showToast(
        `🌱 ${SPECIES_NAMES[seedToPlant.species]} 씨앗을 심었어요!`,
        "success",
      );
      onClose();

      // 튜토리얼 진행
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
                disabled={!canFertilize}
              >
                🌿 비료
                {!canFertilize && (
                  <CooldownTimer type="fertilizer" className="ml-2" />
                )}
              </Button>
            </>
          )}
        </div>

        <CloseButton onClick={onClose} />
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl bg-white p-4 shadow-lg">
      <h3 className="mb-4 text-lg font-bold">빈 땅</h3>

      {hasSeed ? (
        <div>
          <p className="mb-3 text-gray-600">씨앗을 심어 나무를 키워보세요!</p>
          <Button variant="success" className="w-full" onClick={handlePlant}>
            🌱 씨앗 심기 ({seeds.length}개 보유)
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
