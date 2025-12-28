'use client';

import { Tree as TreeComponent } from './Tree';
import type { Tree as TreeType, TilePosition } from '@/types/game';

interface TileProps {
  position: TilePosition;
  tree?: TreeType;
  isSelected?: boolean;
  onSelect: (position: TilePosition, tree?: TreeType) => void;
}

export function Tile({ position, tree, isSelected, onSelect }: TileProps) {
  const handleClick = () => {
    onSelect(position, tree);
  };

  return (
    <div
      className={`
        group
        aspect-square
        rounded-lg
        transition-all duration-200
        ${
          tree
            ? 'bg-green-100 hover:bg-green-200'
            : 'bg-amber-100 hover:bg-amber-200 cursor-pointer'
        }
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
      `}
    >
      {tree ? (
        <TreeComponent
          tree={tree}
          isSelected={isSelected}
          onClick={handleClick}
        />
      ) : (
        <button
          onClick={handleClick}
          className="w-full h-full flex items-center justify-center group"
        >
          <span className="text-2xl opacity-30 group-hover:opacity-60 transition-opacity">
            +
          </span>
        </button>
      )}
    </div>
  );
}
