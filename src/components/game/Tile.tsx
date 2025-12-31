"use client";

import type { Tree as TreeType, TilePosition } from "@/types/game";
import {
  TreeIllustration,
  EmptyTileIllustration,
} from "@/components/illustrations";

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
    <button
      onClick={handleClick}
      className={`group aspect-square overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
        tree
          ? "border-[var(--eco-green-200)] bg-[var(--eco-green-50)]"
          : "border-[var(--eco-brown-200)] bg-[var(--eco-sand)] hover:border-[var(--eco-brown-300)] hover:bg-[var(--eco-brown-100)]"
      } ${isSelected ? "ring-2 ring-[var(--eco-green-400)] ring-offset-2" : ""}`}
    >
      {tree ? (
        <div className="flex h-full w-full items-center justify-center p-1">
          <TreeIllustration
            status={tree.status}
            tier={tree.tier}
            className="h-full w-full"
          />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center p-1 opacity-60 transition-opacity group-hover:opacity-100">
          <EmptyTileIllustration className="h-full w-full" />
        </div>
      )}
    </button>
  );
}
