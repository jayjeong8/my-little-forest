"use client";

import type { SeedTier } from "@/types/game";

interface SeedIllustrationProps {
  tier: SeedTier;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const TIER_COLORS: Record<
  SeedTier,
  { main: string; dark: string; highlight: string }
> = {
  common: { main: "#b5dcc6", dark: "#8bc5a5", highlight: "#d8ede2" },
  uncommon: { main: "#9dd1e2", dark: "#6bb8d1", highlight: "#c5e4ed" },
  rare: { main: "#c5b8e8", dark: "#a89ed4", highlight: "#ddd6f3" },
  epic: { main: "#e8b8d4", dark: "#d49eb8", highlight: "#f3d6e8" },
  legendary: { main: "#f9d89a", dark: "#f5d06b", highlight: "#fcf0c3" },
  mythic: { main: "#f5b8b8", dark: "#e89e9e", highlight: "#fad6d6" },
};

const SIZE_CLASSES = {
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-14 h-14",
};

export function SeedIllustration({
  tier,
  className = "",
  size = "md",
}: SeedIllustrationProps) {
  const colors = TIER_COLORS[tier];

  return (
    <div className={`${SIZE_CLASSES[size]} ${className}`}>
      <svg viewBox="0 0 40 40" className="h-full w-full">
        {/* 씨앗 그림자 */}
        <ellipse cx="20" cy="34" rx="10" ry="3" fill="#c4b199" opacity="0.5" />

        {/* 씨앗 본체 */}
        <ellipse
          cx="20"
          cy="22"
          rx="12"
          ry="14"
          fill={colors.main}
          transform="rotate(-10 20 22)"
        />

        {/* 씨앗 어두운 부분 */}
        <ellipse
          cx="24"
          cy="26"
          rx="8"
          ry="10"
          fill={colors.dark}
          transform="rotate(-10 24 26)"
          opacity="0.5"
        />

        {/* 씨앗 하이라이트 */}
        <ellipse
          cx="16"
          cy="16"
          rx="4"
          ry="5"
          fill={colors.highlight}
          transform="rotate(-10 16 16)"
        />

        {/* 씨앗 줄무늬 */}
        <path
          d="M18 10 Q20 22 18 32"
          stroke={colors.dark}
          strokeWidth="1.5"
          fill="none"
          opacity="0.4"
        />

        {/* 새싹 힌트 (상단) */}
        <ellipse cx="18" cy="8" rx="3" ry="2" fill="#8bc5a5" />
        <ellipse cx="17" cy="7" rx="1.5" ry="1" fill="#b5dcc6" />
      </svg>
    </div>
  );
}

export function EmptyTileIllustration({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <svg viewBox="0 0 64 64" className="h-full w-full">
        {/* 빈 땅 */}
        <ellipse cx="32" cy="40" rx="26" ry="12" fill="#ddd0c0" />
        <ellipse cx="32" cy="38" rx="24" ry="10" fill="#e8e0d5" />

        {/* 흙 텍스처 */}
        <circle cx="22" cy="38" r="2" fill="#c4b199" opacity="0.5" />
        <circle cx="32" cy="40" r="2.5" fill="#c4b199" opacity="0.5" />
        <circle cx="42" cy="37" r="2" fill="#c4b199" opacity="0.5" />
        <circle cx="27" cy="42" r="1.5" fill="#c4b199" opacity="0.4" />
        <circle cx="38" cy="41" r="1.5" fill="#c4b199" opacity="0.4" />

        {/* 심기 힌트 (점선 원) */}
        <circle
          cx="32"
          cy="32"
          r="8"
          fill="none"
          stroke="#a8917a"
          strokeWidth="2"
          strokeDasharray="4 3"
          opacity="0.4"
        />

        {/* 플러스 아이콘 */}
        <rect
          x="30"
          y="28"
          width="4"
          height="8"
          rx="1"
          fill="#a8917a"
          opacity="0.4"
        />
        <rect
          x="28"
          y="30"
          width="8"
          height="4"
          rx="1"
          fill="#a8917a"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}
