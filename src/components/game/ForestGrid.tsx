'use client';

import { useState, useCallback } from 'react';
import { Tile } from './Tile';
import { ActionPanel } from './ActionPanel';
import { useTrees } from '@/hooks/useTrees';
import { useSeeds } from '@/hooks/useSeeds';
import { useTutorial } from '@/hooks/useTutorial';
import { useToast } from '@/components/ui/Toast';
import { GRID_SIZE } from '@/lib/constants';
import type { Tree, TilePosition } from '@/types/game';

interface SelectedTile {
  position: TilePosition;
  tree?: Tree;
}

export function ForestGrid() {
  const [selectedTile, setSelectedTile] = useState<SelectedTile | null>(null);
  const { trees, getTreeAt, harvestTree } = useTrees();
  const { seeds } = useSeeds();
  const { currentStep, advanceTutorial, isStep } = useTutorial();
  const { showToast } = useToast();

  // 타일 선택 핸들러
  const handleTileSelect = useCallback(
    (position: TilePosition, tree?: Tree) => {
      // 같은 타일 다시 클릭하면 선택 해제
      if (
        selectedTile?.position.x === position.x &&
        selectedTile?.position.y === position.y
      ) {
        setSelectedTile(null);
        return;
      }

      setSelectedTile({ position, tree });
    },
    [selectedTile]
  );

  // 선택 해제
  const clearSelection = useCallback(() => {
    setSelectedTile(null);
  }, []);

  // 수확 핸들러
  const handleHarvest = useCallback(
    (treeId: string) => {
      const result = harvestTree(treeId);
      if (result) {
        showToast(`🎉 ${result.reward} 포인트 획득! 씨앗도 받았어요!`, 'success');
        clearSelection();

        // 튜토리얼 진행
        if (isStep('harvest_tree')) {
          advanceTutorial();
        }
      }
    },
    [harvestTree, showToast, clearSelection, isStep, advanceTutorial]
  );

  // 5x5 그리드 생성
  const gridPositions = Array.from({ length: GRID_SIZE }, (_, y) =>
    Array.from({ length: GRID_SIZE }, (_, x) => ({ x, y }))
  ).flat();

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 그리드 */}
      <div
        className="grid gap-2 p-4 bg-green-50 rounded-xl"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {gridPositions.map((position) => {
          const tree = getTreeAt(position);
          const isSelected =
            selectedTile?.position.x === position.x &&
            selectedTile?.position.y === position.y;

          return (
            <Tile
              key={`${position.x}-${position.y}`}
              position={position}
              tree={tree}
              isSelected={isSelected}
              onSelect={handleTileSelect}
            />
          );
        })}
      </div>

      {/* 액션 패널 */}
      {selectedTile && (
        <ActionPanel
          selectedTile={selectedTile}
          onClose={clearSelection}
          onHarvest={handleHarvest}
          hasSeed={seeds.length > 0}
        />
      )}
    </div>
  );
}
