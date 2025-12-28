"use client";

import type { Tree as TreeType, TilePosition } from "@/types/game";
import { Tree as TreeComponent } from "./Tree";

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
      className={`group aspect-square rounded-lg transition-all duration-200 ${
        tree
          ? "bg-green-100 hover:bg-green-200"
          : "cursor-pointer bg-amber-100 hover:bg-amber-200"
      } ${isSelected ? "ring-2 ring-blue-500" : ""} `}
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
          className="group flex h-full w-full items-center justify-center"
        >
          <span className="text-2xl opacity-30 transition-opacity group-hover:opacity-60">
            +
          </span>
        </button>
      )}
    </div>
  );
}
