"use client";

import type { Seed, SeedTier } from "@/types/game";
import { useCallback, useMemo } from "react";
import { GRID_SIZE } from "@/lib/constants";
import { useCooldownStore } from "@/stores/cooldownStore";
import { useGameStore } from "@/stores/gameStore";

export function useSeeds() {
  // Game Store
  const seeds = useGameStore((state) => state.seeds);
  const trees = useGameStore((state) => state.trees);
  const addSeedAction = useGameStore((state) => state.addSeed);
  const removeSeed = useGameStore((state) => state.removeSeed);

  // Cooldown Store
  const startCooldown = useCooldownStore((state) => state.startCooldown);
  const isOnCooldown = useCooldownStore((state) => state.isOnCooldown);
  const getRemainingTime = useCooldownStore((state) => state.getRemainingTime);

  // 빈 타일 존재 여부
  const hasEmptyTile = useMemo(() => {
    const totalTiles = GRID_SIZE * GRID_SIZE;

    return trees.length < totalTiles;
  }, [trees]);

  // 씨앗 광고 시청 가능 여부
  // 조건: 쿨다운 아님 AND 보유 씨앗 0개 AND 빈 타일 존재
  const canWatchSeedAd = useMemo(() => {
    return !isOnCooldown("seed_ad") && seeds.length === 0 && hasEmptyTile;
  }, [isOnCooldown, seeds.length, hasEmptyTile]);

  // 씨앗 광고 불가 사유
  const seedAdDisabledReason = useMemo(() => {
    if (isOnCooldown("seed_ad")) return "cooldown";
    if (seeds.length > 0) return "has_seeds";
    if (!hasEmptyTile) return "no_empty_tile";

    return null;
  }, [isOnCooldown, seeds.length, hasEmptyTile]);

  // 광고로 씨앗 획득
  const claimSeedFromAd = useCallback((): Seed | null => {
    if (!canWatchSeedAd) return null;

    const seed = addSeedAction("common", "ad");
    startCooldown("seed_ad");

    return seed;
  }, [canWatchSeedAd, addSeedAction, startCooldown]);

  // 티어별 씨앗 개수
  const seedsByTier = useMemo(() => {
    return seeds.reduce(
      (acc, seed) => {
        acc[seed.tier] = (acc[seed.tier] || 0) + 1;

        return acc;
      },
      {} as Partial<Record<SeedTier, number>>,
    );
  }, [seeds]);

  // 특정 티어 씨앗 가져오기
  const getSeedsByTier = useCallback(
    (tier: SeedTier): Seed[] => {
      return seeds.filter((s) => s.tier === tier);
    },
    [seeds],
  );

  return {
    // 데이터
    seeds,
    totalSeeds: seeds.length,
    seedsByTier,
    hasEmptyTile,

    // 광고 관련
    canWatchSeedAd,
    seedAdDisabledReason,
    seedAdRemainingTime: getRemainingTime("seed_ad"),
    claimSeedFromAd,

    // 액션
    addSeed: addSeedAction,
    removeSeed,

    // 유틸리티
    getSeedsByTier,
  };
}
