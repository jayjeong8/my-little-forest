'use client';

import { useCallback, useMemo } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useCooldownStore } from '@/stores/cooldownStore';
import type { Tree, TilePosition, TreeStatus } from '@/types/game';

export function useTrees() {
  // Game Store
  const trees = useGameStore((state) => state.trees);
  const plantSeedAction = useGameStore((state) => state.plantSeed);
  const waterTreeAction = useGameStore((state) => state.waterTree);
  const fertilizeTreeAction = useGameStore((state) => state.fertilizeTree);
  const harvestTreeAction = useGameStore((state) => state.harvestTree);
  const getTreeAt = useGameStore((state) => state.getTreeAt);
  const isPositionOccupied = useGameStore((state) => state.isPositionOccupied);

  // Cooldown Store
  const startCooldown = useCooldownStore((state) => state.startCooldown);
  const isOnCooldown = useCooldownStore((state) => state.isOnCooldown);
  const getRemainingTime = useCooldownStore((state) => state.getRemainingTime);

  // 쿨다운 상태
  const waterCooldown = isOnCooldown('water');
  const fertilizerCooldown = isOnCooldown('fertilizer');

  // 액션 가능 여부
  const canWater = !waterCooldown;
  const canFertilize = !fertilizerCooldown;

  // 씨앗 심기
  const plantSeed = useCallback(
    (seedId: string, position: TilePosition): boolean => {
      return plantSeedAction(seedId, position);
    },
    [plantSeedAction]
  );

  // 물주기 (쿨다운 적용)
  const waterTree = useCallback(
    (treeId: string): boolean => {
      if (!canWater) return false;

      const success = waterTreeAction(treeId);
      if (success) {
        startCooldown('water');
      }
      return success;
    },
    [canWater, waterTreeAction, startCooldown]
  );

  // 비료주기 (쿨다운 적용)
  const fertilizeTree = useCallback(
    (treeId: string): boolean => {
      if (!canFertilize) return false;

      const success = fertilizeTreeAction(treeId);
      if (success) {
        startCooldown('fertilizer');
      }
      return success;
    },
    [canFertilize, fertilizeTreeAction, startCooldown]
  );

  // 수확
  const harvestTree = useCallback(
    (treeId: string) => {
      return harvestTreeAction(treeId);
    },
    [harvestTreeAction]
  );

  // 상태별 나무 필터링
  const getTreesByStatus = useCallback(
    (status: TreeStatus): Tree[] => {
      return trees.filter((t) => t.status === status);
    },
    [trees]
  );

  // 파생 상태
  const harvestableCount = useMemo(
    () => trees.filter((t) => t.status === 'mature').length,
    [trees]
  );

  const growingCount = useMemo(
    () =>
      trees.filter(
        (t) => t.status === 'seed' || t.status === 'seedling' || t.status === 'growing'
      ).length,
    [trees]
  );

  return {
    // 데이터
    trees,
    harvestableCount,
    growingCount,

    // 쿨다운 상태
    canWater,
    canFertilize,
    waterRemainingTime: getRemainingTime('water'),
    fertilizerRemainingTime: getRemainingTime('fertilizer'),

    // 액션
    plantSeed,
    waterTree,
    fertilizeTree,
    harvestTree,

    // 유틸리티
    getTreeAt,
    getTreesByStatus,
    isPositionOccupied,
  };
}
