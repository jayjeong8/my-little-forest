"use client";

import type { CooldownType } from "@/types/game";
import { useCooldown } from "@/hooks/useCooldowns";

interface CooldownTimerProps {
  type: CooldownType;
  className?: string;
}

export function CooldownTimer({ type, className = "" }: CooldownTimerProps) {
  const { isOnCooldown, remainingTimeFormatted } = useCooldown(type);

  if (!isOnCooldown) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-sm text-[var(--eco-brown-400)] ${className} `}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {remainingTimeFormatted}
    </span>
  );
}
