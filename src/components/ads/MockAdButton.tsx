"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { CooldownTimer } from "@/components/ui/CooldownTimer";
import { useToast } from "@/components/ui/Toast";
import { useCooldown, useCooldowns } from "@/hooks/useCooldowns";
import { useSeeds } from "@/hooks/useSeeds";

type AdType = "fertilizer" | "seed";

interface MockAdButtonProps {
  type: AdType;
  onRewardClaimed?: () => void;
}

const AD_CONFIG = {
  fertilizer: {
    label: "🌿 비료 받기",
    reward: "비료 1개",
    cooldownType: "fertilizer" as const,
  },
  seed: {
    label: "🌰 씨앗 받기",
    reward: "씨앗 1개",
    cooldownType: "seed_ad" as const,
  },
};

interface FullScreenAdProps {
  progress: number;
  adType: AdType;
}

function FullScreenAd({ progress, adType }: FullScreenAdProps) {
  const rewardText = adType === "seed" ? "씨앗" : "비료";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 text-center text-white">
        <div className="mb-8 text-6xl">📺</div>
        <h2 className="mb-2 text-2xl font-bold">광고 시청 중</h2>
        <p className="mb-8 text-gray-400">
          광고가 끝나면 {rewardText}을 받을 수 있어요
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

export function MockAdButton({ type, onRewardClaimed }: MockAdButtonProps) {
  const [isWatching, setIsWatching] = useState(false);
  const [progress, setProgress] = useState(0);

  const { canWatchSeedAd, seedAdDisabledReason, claimSeedFromAd } = useSeeds();
  const cooldown = useCooldown(AD_CONFIG[type].cooldownType);
  const { startCooldown } = useCooldowns();
  const { showToast } = useToast();

  const config = AD_CONFIG[type];

  // 버튼 비활성화 여부 (광고 시청 중에도 비활성화)
  const isDisabled =
    isWatching || cooldown.isOnCooldown || (type === "seed" && !canWatchSeedAd);

  const getDisabledReason = () => {
    if (isWatching) return "광고 시청 중";
    if (cooldown.isOnCooldown) return null; // 쿨타임은 타이머로 표시

    if (type === "seed") {
      if (seedAdDisabledReason === "has_seeds") return "씨앗이 있어요";
      if (seedAdDisabledReason === "no_empty_tile") return "빈 땅이 없어요";
    }

    return null;
  };

  const handleWatchAd = useCallback(() => {
    if (isWatching) return; // 중복 클릭 방지

    setIsWatching(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          return 100;
        }

        return prev + 10;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setIsWatching(false);
      setProgress(0);

      if (type === "seed") {
        const seed = claimSeedFromAd();

        if (seed) {
          showToast("🌰 씨앗을 받았어요!", "success");
        }
      } else {
        // 비료: 쿨다운 시작
        startCooldown("fertilizer");
        showToast("🌿 비료를 받았어요! 나무에 적용해주세요.", "success");
      }

      onRewardClaimed?.();
    }, 3000);
  }, [
    isWatching,
    type,
    claimSeedFromAd,
    startCooldown,
    showToast,
    onRewardClaimed,
  ]);

  const disabledReason = getDisabledReason();

  return (
    <>
      <div className="flex flex-col items-center gap-1">
        <Button
          variant={type === "seed" ? "success" : "secondary"}
          onClick={handleWatchAd}
          disabled={isDisabled}
          className="w-full"
        >
          {config.label}
          {cooldown.isOnCooldown && (
            <CooldownTimer type={config.cooldownType} className="ml-2" />
          )}
        </Button>
        {disabledReason && (
          <span className="text-xs text-gray-500">{disabledReason}</span>
        )}
      </div>

      {isWatching && <FullScreenAd progress={progress} adType={type} />}
    </>
  );
}
