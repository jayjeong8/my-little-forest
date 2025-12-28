"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CooldownTimer } from "@/components/ui/CooldownTimer";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useCooldown } from "@/hooks/useCooldowns";
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

export function MockAdButton({ type, onRewardClaimed }: MockAdButtonProps) {
  const [isWatching, setIsWatching] = useState(false);
  const [progress, setProgress] = useState(0);

  const { canWatchSeedAd, seedAdDisabledReason, claimSeedFromAd } = useSeeds();
  const cooldown = useCooldown(AD_CONFIG[type].cooldownType);
  const { showToast } = useToast();

  const config = AD_CONFIG[type];

  // 버튼 비활성화 여부
  const isDisabled =
    cooldown.isOnCooldown || (type === "seed" && !canWatchSeedAd);

  // 비활성화 사유 메시지
  const getDisabledReason = () => {
    if (cooldown.isOnCooldown) return "쿨다운 중";

    if (type === "seed") {
      if (seedAdDisabledReason === "has_seeds") return "씨앗이 있어요";
      if (seedAdDisabledReason === "no_empty_tile") return "빈 땅이 없어요";
    }

    return null;
  };

  // Mock 광고 시청 시작
  const handleWatchAd = () => {
    setIsWatching(true);
    setProgress(0);

    // 3초 동안 프로그레스 증가
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          return 100;
        }

        return prev + 10;
      });
    }, 300);

    // 3초 후 보상 지급
    setTimeout(() => {
      clearInterval(interval);
      setIsWatching(false);
      setProgress(0);

      // 보상 지급
      if (type === "seed") {
        const seed = claimSeedFromAd();

        if (seed) {
          showToast("🌰 씨앗을 받았어요!", "success");
        }
      } else {
        // 비료는 직접 나무에 적용하므로 여기서는 알림만
        showToast("🌿 비료를 받았어요! 나무에 적용해주세요.", "success");
      }

      onRewardClaimed?.();
    }, 3000);
  };

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

      {/* Mock 광고 모달 */}
      <Modal
        isOpen={isWatching}
        onClose={() => {}} // 닫기 불가
        showCloseButton={false}
      >
        <div className="py-6 text-center">
          <p className="mb-4 text-lg font-bold">📺 광고 시청 중...</p>
          <div className="mb-4 h-4 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-gray-600">
            {progress < 100 ? "잠시만 기다려주세요..." : "보상 지급 중!"}
          </p>
        </div>
      </Modal>
    </>
  );
}
