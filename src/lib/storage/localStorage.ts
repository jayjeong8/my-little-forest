import type { StorageAdapter } from './types';
import type { GameState } from '@/types/game';
import { STORAGE_KEYS, CURRENT_VERSION } from '@/lib/constants';

/**
 * LocalStorage 기반 Storage Adapter 구현
 *
 * 참고: Zustand의 persist 미들웨어가 주 저장소 역할을 하므로,
 * 이 어댑터는 직접 데이터를 읽거나 마이그레이션할 때 사용됩니다.
 */
export class LocalStorageAdapter implements StorageAdapter {
  private storageKey: string;

  constructor(storageKey: string = STORAGE_KEYS.game) {
    this.storageKey = storageKey;
  }

  async load(): Promise<GameState | null> {
    if (typeof window === 'undefined') return null;

    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;

      // Zustand persist 형식: { state: {...}, version: 0 }
      const parsed = JSON.parse(raw);
      return parsed.state as GameState;
    } catch (error) {
      console.error('Failed to load game state:', error);
      return null;
    }
  }

  async save(state: GameState): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const toSave = {
        state: {
          ...state,
          lastSavedAt: new Date().toISOString(),
        },
        version: 0, // Zustand persist 버전 (게임 버전과 별개)
      };
      localStorage.setItem(this.storageKey, JSON.stringify(toSave));
    } catch (error) {
      console.error('Failed to save game state:', error);
      throw error;
    }
  }

  async patch<K extends keyof GameState>(
    key: K,
    value: GameState[K]
  ): Promise<void> {
    const current = await this.load();
    if (!current) {
      throw new Error('No game state to patch');
    }

    await this.save({
      ...current,
      [key]: value,
    });
  }

  async clear(): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.storageKey);
  }

  async getVersion(): Promise<number> {
    const state = await this.load();
    return state?.version ?? 0;
  }

  async migrate(fromVersion: number, toVersion: number): Promise<void> {
    const state = await this.load();
    if (!state) return;

    let migrated = { ...state };

    // 버전별 마이그레이션 로직
    if (fromVersion < 1 && toVersion >= 1) {
      // v0 -> v1: stats 필드 추가
      migrated = {
        ...migrated,
        stats: migrated.stats ?? {
          totalHarvested: 0,
          weeklyHarvested: 0,
          weeklyScore: 0,
          lastWeekReset: new Date().toISOString(),
        },
        version: 1,
      };
    }

    // 추가 마이그레이션은 여기에...

    await this.save(migrated);
  }
}

/**
 * LocalStorage Adapter 팩토리 함수
 */
export function createLocalStorageAdapter(
  storageKey?: string
): StorageAdapter {
  return new LocalStorageAdapter(storageKey);
}

/**
 * 게임 상태 존재 여부 확인
 */
export function hasExistingGameState(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.game);
    return raw !== null;
  } catch {
    return false;
  }
}

/**
 * 게임 상태 초기화 필요 여부 확인
 */
export async function needsInitialization(): Promise<boolean> {
  const adapter = new LocalStorageAdapter();
  const state = await adapter.load();

  // 상태가 없거나 튜토리얼이 시작되지 않은 경우
  return !state || state.tutorial.currentStep === 'not_started';
}

/**
 * 마이그레이션 필요 여부 확인 및 실행
 */
export async function checkAndMigrate(): Promise<void> {
  const adapter = new LocalStorageAdapter();
  const currentVersion = await adapter.getVersion();

  if (currentVersion < CURRENT_VERSION) {
    console.log(
      `Migrating game state from v${currentVersion} to v${CURRENT_VERSION}`
    );
    await adapter.migrate(currentVersion, CURRENT_VERSION);
  }
}
