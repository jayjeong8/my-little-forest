"use client";

import type { Seed } from "@/types/game";
import {
  SPECIES_NAMES,
  TIER_NAMES,
  TIER_COLORS,
  TIER_BG_COLORS,
} from "@/lib/constants";

interface SeedCardProps {
  seed: Seed;
  isSelected?: boolean;
  onClick?: () => void;
}

export function SeedCard({ seed, isSelected, onClick }: SeedCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-lg p-3 transition-all duration-200 ${TIER_BG_COLORS[seed.tier]} ${isSelected ? "scale-105 ring-2 ring-blue-500" : ""} hover:scale-105 active:scale-95`}
    >
      <span className="text-2xl">🌰</span>
      <span className={`text-xs font-medium ${TIER_COLORS[seed.tier]}`}>
        {TIER_NAMES[seed.tier]}
      </span>
      <span className="max-w-full truncate text-xs text-gray-600">
        {SPECIES_NAMES[seed.species]}
      </span>
    </button>
  );
}
