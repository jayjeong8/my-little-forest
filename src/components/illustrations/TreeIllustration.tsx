"use client";

import type { TreeStatus, SeedTier } from "@/types/game";

interface TreeIllustrationProps {
  status: TreeStatus;
  tier: SeedTier;
  className?: string;
}

const TIER_COLORS: Record<SeedTier, { leaf: string; leafDark: string }> = {
  common: { leaf: "#8bc5a5", leafDark: "#6bb389" },
  uncommon: { leaf: "#7cbcd4", leafDark: "#5ba8c4" },
  rare: { leaf: "#a89ed4", leafDark: "#8b7fc4" },
  epic: { leaf: "#d49eb8", leafDark: "#c47f9e" },
  legendary: { leaf: "#e8c86b", leafDark: "#d4b44e" },
  mythic: { leaf: "#e89e9e", leafDark: "#d47f7f" },
};

function SeedStage({ tier }: { tier: SeedTier }) {
  const colors = TIER_COLORS[tier];

  return (
    <svg viewBox="0 0 64 64" className="h-full w-full">
      {/* 흙 */}
      <ellipse cx="32" cy="52" rx="20" ry="6" fill="#c4b199" />
      <ellipse cx="32" cy="50" rx="18" ry="5" fill="#ddd0c0" />

      {/* 씨앗 */}
      <ellipse
        cx="32"
        cy="44"
        rx="8"
        ry="6"
        fill={colors.leafDark}
        transform="rotate(-15 32 44)"
      />
      <ellipse
        cx="31"
        cy="43"
        rx="6"
        ry="4"
        fill={colors.leaf}
        transform="rotate(-15 31 43)"
      />
    </svg>
  );
}

function SeedlingStage({ tier }: { tier: SeedTier }) {
  const colors = TIER_COLORS[tier];

  return (
    <svg viewBox="0 0 64 64" className="h-full w-full">
      {/* 흙 */}
      <ellipse cx="32" cy="52" rx="20" ry="6" fill="#c4b199" />
      <ellipse cx="32" cy="50" rx="18" ry="5" fill="#ddd0c0" />

      {/* 줄기 */}
      <rect x="30" y="32" width="4" height="18" rx="2" fill="#8b7355" />

      {/* 새싹 잎 */}
      <ellipse
        cx="24"
        cy="30"
        rx="8"
        ry="5"
        fill={colors.leaf}
        transform="rotate(-30 24 30)"
      />
      <ellipse
        cx="40"
        cy="30"
        rx="8"
        ry="5"
        fill={colors.leaf}
        transform="rotate(30 40 30)"
      />
      <ellipse
        cx="23"
        cy="29"
        rx="6"
        ry="3"
        fill={colors.leafDark}
        transform="rotate(-30 23 29)"
        opacity="0.5"
      />
      <ellipse
        cx="41"
        cy="29"
        rx="6"
        ry="3"
        fill={colors.leafDark}
        transform="rotate(30 41 29)"
        opacity="0.5"
      />
    </svg>
  );
}

function GrowingStage({ tier }: { tier: SeedTier }) {
  const colors = TIER_COLORS[tier];

  return (
    <svg viewBox="0 0 64 64" className="h-full w-full">
      {/* 흙 */}
      <ellipse cx="32" cy="54" rx="22" ry="6" fill="#c4b199" />
      <ellipse cx="32" cy="52" rx="20" ry="5" fill="#ddd0c0" />

      {/* 줄기 */}
      <rect x="29" y="28" width="6" height="24" rx="3" fill="#a8917a" />
      <rect x="30" y="30" width="4" height="20" rx="2" fill="#8b7355" />

      {/* 나뭇잎 */}
      <ellipse cx="32" cy="22" rx="16" ry="14" fill={colors.leaf} />
      <ellipse
        cx="28"
        cy="18"
        rx="10"
        ry="8"
        fill={colors.leafDark}
        opacity="0.4"
      />
      <ellipse
        cx="38"
        cy="24"
        rx="8"
        ry="6"
        fill={colors.leafDark}
        opacity="0.3"
      />

      {/* 하이라이트 */}
      <ellipse cx="26" cy="16" rx="4" ry="3" fill="white" opacity="0.3" />
    </svg>
  );
}

function MatureStage({ tier }: { tier: SeedTier }) {
  const colors = TIER_COLORS[tier];

  return (
    <svg viewBox="0 0 64 64" className="h-full w-full">
      {/* 흙 */}
      <ellipse cx="32" cy="56" rx="24" ry="6" fill="#c4b199" />
      <ellipse cx="32" cy="54" rx="22" ry="5" fill="#ddd0c0" />

      {/* 나무 줄기 */}
      <path d="M28 54 L26 36 L30 36 L30 54 Z" fill="#a8917a" />
      <path d="M36 54 L38 36 L34 36 L34 54 Z" fill="#a8917a" />
      <rect x="28" y="34" width="8" height="20" rx="2" fill="#8b7355" />

      {/* 큰 나뭇잎 */}
      <ellipse cx="32" cy="18" rx="22" ry="18" fill={colors.leaf} />
      <ellipse cx="22" cy="22" rx="10" ry="10" fill={colors.leaf} />
      <ellipse cx="42" cy="22" rx="10" ry="10" fill={colors.leaf} />

      {/* 입체감 */}
      <ellipse
        cx="26"
        cy="14"
        rx="12"
        ry="10"
        fill={colors.leafDark}
        opacity="0.4"
      />
      <ellipse
        cx="40"
        cy="20"
        rx="10"
        ry="8"
        fill={colors.leafDark}
        opacity="0.3"
      />

      {/* 하이라이트 */}
      <ellipse cx="22" cy="10" rx="6" ry="4" fill="white" opacity="0.3" />

      {/* 열매 (수확 가능 표시) */}
      <circle cx="20" cy="26" r="3" fill="#f5d06b" />
      <circle cx="44" cy="24" r="3" fill="#f5d06b" />
      <circle cx="32" cy="28" r="3" fill="#f5d06b" />
      <circle cx="19" cy="25" r="1.5" fill="#f9e29a" />
      <circle cx="43" cy="23" r="1.5" fill="#f9e29a" />
      <circle cx="31" cy="27" r="1.5" fill="#f9e29a" />
    </svg>
  );
}

export function TreeIllustration({
  status,
  tier,
  className = "",
}: TreeIllustrationProps) {
  const renderTree = () => {
    switch (status) {
      case "seed":
        return <SeedStage tier={tier} />;
      case "seedling":
        return <SeedlingStage tier={tier} />;
      case "growing":
        return <GrowingStage tier={tier} />;
      case "mature":
        return <MatureStage tier={tier} />;
      default:
        return <SeedStage tier={tier} />;
    }
  };

  return (
    <div className={`transition-transform hover:scale-105 ${className}`}>
      {renderTree()}
    </div>
  );
}
