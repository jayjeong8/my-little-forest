import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CooldownType, Cooldown } from '@/types/game';
import { COOLDOWN_DURATIONS, STORAGE_KEYS } from '@/lib/constants';

interface CooldownState {
  cooldowns: Record<CooldownType, Cooldown | null>;
}

interface CooldownActions {
  // 쿨다운 시작
  startCooldown: (type: CooldownType) => void;

  // 쿨다운 중인지 확인
  isOnCooldown: (type: CooldownType) => boolean;

  // 남은 시간 (밀리초)
  getRemainingTime: (type: CooldownType) => number;

  // 쿨다운 초기화 (특정 타입)
  resetCooldown: (type: CooldownType) => void;

  // 일일 쿨다운 리셋 (물주기)
  resetDailyCooldowns: () => void;

  // 전체 초기화
  resetAllCooldowns: () => void;
}

type CooldownStore = CooldownState & CooldownActions;

const initialCooldowns: Record<CooldownType, Cooldown | null> = {
  water: null,
  fertilizer: null,
  seed_ad: null,
};

export const useCooldownStore = create<CooldownStore>()(
  persist(
    (set, get) => ({
      cooldowns: { ...initialCooldowns },

      startCooldown: (type) => {
        set((state) => ({
          cooldowns: {
            ...state.cooldowns,
            [type]: {
              type,
              lastUsedAt: new Date().toISOString(),
              durationMs: COOLDOWN_DURATIONS[type],
            },
          },
        }));
      },

      isOnCooldown: (type) => {
        const cooldown = get().cooldowns[type];
        if (!cooldown) return false;

        const elapsed = Date.now() - new Date(cooldown.lastUsedAt).getTime();
        return elapsed < cooldown.durationMs;
      },

      getRemainingTime: (type) => {
        const cooldown = get().cooldowns[type];
        if (!cooldown) return 0;

        const elapsed = Date.now() - new Date(cooldown.lastUsedAt).getTime();
        const remaining = cooldown.durationMs - elapsed;

        return Math.max(0, remaining);
      },

      resetCooldown: (type) => {
        set((state) => ({
          cooldowns: {
            ...state.cooldowns,
            [type]: null,
          },
        }));
      },

      resetDailyCooldowns: () => {
        // 물주기 쿨다운만 초기화 (자정 기준)
        set((state) => ({
          cooldowns: {
            ...state.cooldowns,
            water: null,
          },
        }));
      },

      resetAllCooldowns: () => {
        set({ cooldowns: { ...initialCooldowns } });
      },
    }),
    {
      name: STORAGE_KEYS.cooldowns,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// 남은 시간을 포맷팅하는 유틸리티 함수
export function formatRemainingTime(ms: number): string {
  if (ms <= 0) return '00:00';

  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
