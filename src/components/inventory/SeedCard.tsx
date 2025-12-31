"use client";

import type { Seed } from "@/types/game";
import { SeedIllustration } from "@/components/illustrations";
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
      className={`flex flex-col items-center gap-1 rounded-xl border-2 p-2 transition-all duration-200 ${TIER_BG_COLORS[seed.tier]} border-[var(--eco-beige)] ${isSelected ? "scale-105 ring-2 ring-[var(--eco-green-400)]" : ""} hover:scale-105 hover:shadow-md active:scale-95`}
    >
      <SeedIllustration tier={seed.tier} size="sm" />
      <span className={`text-xs font-medium ${TIER_COLORS[seed.tier]}`}>
        {TIER_NAMES[seed.tier]}
      </span>
      <span className="max-w-full truncate text-xs text-[var(--eco-brown-500)]">
        {SPECIES_NAMES[seed.species]}
      </span>
    </button>
  );
}
