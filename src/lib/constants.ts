import type { SeedTier, CooldownType, TreeSpecies } from "@/types/game";

// 그리드 크기
export const GRID_SIZE = 5;
export const TOTAL_TILES = GRID_SIZE * GRID_SIZE; // 25

// 티어별 필요 스텝
export const TIER_STEPS: Record<SeedTier, number> = {
  common: 2,
  uncommon: 3,
  rare: 4,
  epic: 5,
  legendary: 6,
  mythic: 8,
};

// 티어별 가중치 (주간 점수 계산용)
export const TIER_WEIGHTS: Record<SeedTier, number> = {
  common: 1,
  uncommon: 1.5,
  rare: 2,
  epic: 2.5,
  legendary: 3,
  mythic: 4,
};

// 티어별 기본 리워드
export const TIER_BASE_REWARDS: Record<SeedTier, number> = {
  common: 10,
  uncommon: 20,
  rare: 35,
  epic: 50,
  legendary: 80,
  mythic: 150,
};

// 쿨다운 시간 (밀리초)
export const COOLDOWN_DURATIONS: Record<CooldownType, number> = {
  water: 24 * 60 * 60 * 1000, // 24시간
  fertilizer: 20 * 60 * 1000, // 20분
  seed_ad: 3 * 60 * 60 * 1000, // 3시간
};

// 티어별 나무 종류
export const SPECIES_BY_TIER: Record<SeedTier, TreeSpecies[]> = {
  common: ["willow", "poplar", "birch"],
  uncommon: ["pine", "cherry", "apple"],
  rare: ["olive", "maple"],
  epic: ["sequoia", "baobab"],
  legendary: ["dragon_blood", "bristlecone"],
  mythic: ["wollemi"],
};

// 나무 종류별 한글 이름
export const SPECIES_NAMES: Record<TreeSpecies, string> = {
  willow: "버드나무",
  poplar: "포플러",
  birch: "자작나무",
  pine: "소나무",
  cherry: "벚나무",
  apple: "사과나무",
  olive: "올리브나무",
  maple: "단풍나무",
  sequoia: "세쿼이아",
  baobab: "바오밥",
  dragon_blood: "용혈수",
  bristlecone: "브리슬콘 소나무",
  wollemi: "월레미 소나무",
};

// 티어 한글 이름
export const TIER_NAMES: Record<SeedTier, string> = {
  common: "일반",
  uncommon: "고급",
  rare: "희귀",
  epic: "영웅",
  legendary: "전설",
  mythic: "신화",
};

// 티어 색상 (Tailwind 클래스용)
export const TIER_COLORS: Record<SeedTier, string> = {
  common: "text-gray-500",
  uncommon: "text-green-500",
  rare: "text-blue-500",
  epic: "text-purple-500",
  legendary: "text-orange-500",
  mythic: "text-red-500",
};

// 티어 배경색
export const TIER_BG_COLORS: Record<SeedTier, string> = {
  common: "bg-gray-100",
  uncommon: "bg-green-100",
  rare: "bg-blue-100",
  epic: "bg-purple-100",
  legendary: "bg-orange-100",
  mythic: "bg-red-100",
};

// 게임 상태 버전 (마이그레이션용)
export const CURRENT_VERSION = 1;

// 스토리지 키
export const STORAGE_KEYS = {
  game: "my-little-forest-game",
  cooldowns: "my-little-forest-cooldowns",
} as const;
