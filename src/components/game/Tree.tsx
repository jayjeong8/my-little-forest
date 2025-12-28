'use client';

import type { Tree as TreeType, SeedTier } from '@/types/game';
import { TIER_COLORS, SPECIES_NAMES } from '@/lib/constants';

interface TreeProps {
  tree: TreeType;
  isSelected?: boolean;
  onClick?: () => void;
}

// 성장 단계별 이모지
const GROWTH_STAGES = {
  seed: '🌱',
  seedling: '🌿',
  growing: '🌳',
  mature: '🌲',
} as const;

// 티어별 장식 이모지
const TIER_DECORATIONS: Record<SeedTier, string> = {
  common: '',
  uncommon: '✨',
  rare: '💎',
  epic: '🔮',
  legendary: '👑',
  mythic: '🌟',
};

export function Tree({ tree, isSelected, onClick }: TreeProps) {
  const emoji = GROWTH_STAGES[tree.status];
  const decoration = TIER_DECORATIONS[tree.tier];
  const isMature = tree.status === 'mature';

  return (
    <button
      onClick={onClick}
      className={`
        relative w-full h-full
        flex flex-col items-center justify-center
        rounded-lg transition-all duration-200
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${isMature ? 'animate-bounce-slow' : ''}
        hover:scale-105 active:scale-95
      `}
    >
      {/* 메인 이모지 */}
      <span className="text-3xl sm:text-4xl">{emoji}</span>

      {/* 티어 장식 */}
      {decoration && (
        <span className="absolute top-0 right-0 text-sm">{decoration}</span>
      )}

      {/* 수확 가능 표시 */}
      {isMature && (
        <span className="absolute -top-1 -left-1 text-lg animate-pulse">
          ✅
        </span>
      )}

      {/* 성장 진행률 */}
      <div className="mt-1 w-full px-1">
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isMature ? 'bg-green-500' : 'bg-blue-400'
            }`}
            style={{
              width: `${(tree.currentStep / tree.requiredSteps) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* 종류 이름 (호버 시 표시) */}
      <span
        className={`
          absolute bottom-full left-1/2 -translate-x-1/2 mb-1
          px-2 py-1 text-xs rounded bg-gray-800 text-white
          opacity-0 group-hover:opacity-100 transition-opacity
          whitespace-nowrap pointer-events-none
          ${TIER_COLORS[tree.tier]}
        `}
      >
        {SPECIES_NAMES[tree.species]}
      </span>
    </button>
  );
}
