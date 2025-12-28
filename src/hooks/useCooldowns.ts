"use client";

import type { CooldownType } from "@/types/game";
import { useEffect, useState, useCallback } from "react";
import { useCooldownStore, formatRemainingTime } from "@/stores/cooldownStore";

interface CooldownInfo {
  isOnCooldown: boolean;
  remainingTime: number;
  remainingTimeFormatted: string;
}

/**
 * 특정 쿨다운 타입의 상태를 실시간으로 추적하는 훅
 */
export function useCooldown(type: CooldownType): CooldownInfo {
  const isOnCooldownFn = useCooldownStore((state) => state.isOnCooldown);
  const getRemainingTime = useCooldownStore((state) => state.getRemainingTime);

  const [info, setInfo] = useState<CooldownInfo>(() => {
    const remaining = getRemainingTime(type);

    return {
      isOnCooldown: isOnCooldownFn(type),
      remainingTime: remaining,
      remainingTimeFormatted: formatRemainingTime(remaining),
    };
  });

  useEffect(() => {
    const updateInfo = () => {
      const remaining = getRemainingTime(type);
      const onCooldown = isOnCooldownFn(type);
      setInfo({
        isOnCooldown: onCooldown,
        remainingTime: remaining,
        remainingTimeFormatted: formatRemainingTime(remaining),
      });

      return onCooldown;
    };

    // 초기 업데이트
    const isActive = updateInfo();

    // 쿨다운 중일 때만 1초마다 업데이트
    if (!isActive) return;

    const interval = setInterval(() => {
      const stillActive = updateInfo();

      if (!stillActive) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [type, isOnCooldownFn, getRemainingTime]);

  return info;
}

/**
 * 모든 쿨다운 상태를 한 번에 가져오는 훅
 */
export function useCooldowns() {
  const store = useCooldownStore();

  const water = useCooldown("water");
  const fertilizer = useCooldown("fertilizer");
  const seedAd = useCooldown("seed_ad");

  const startCooldown = useCallback(
    (type: CooldownType) => {
      store.startCooldown(type);
    },
    [store],
  );

  const resetCooldown = useCallback(
    (type: CooldownType) => {
      store.resetCooldown(type);
    },
    [store],
  );

  return {
    water,
    fertilizer,
    seedAd,
    startCooldown,
    resetCooldown,
    resetAllCooldowns: store.resetAllCooldowns,
    resetDailyCooldowns: store.resetDailyCooldowns,
  };
}
