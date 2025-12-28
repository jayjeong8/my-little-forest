import type { GameState } from "@/types/game";

/**
 * Storage Adapter 인터페이스
 *
 * 현재는 LocalStorage를 사용하지만,
 * 향후 Supabase 등 백엔드로 교체할 수 있도록 추상화합니다.
 */
export interface StorageAdapter {
  /**
   * 전체 게임 상태 로드
   */
  load(): Promise<GameState | null>;

  /**
   * 전체 게임 상태 저장
   */
  save(state: GameState): Promise<void>;

  /**
   * 부분 업데이트 (최적화용)
   */
  patch<K extends keyof GameState>(key: K, value: GameState[K]): Promise<void>;

  /**
   * 게임 상태 삭제
   */
  clear(): Promise<void>;

  /**
   * 저장된 버전 확인
   */
  getVersion(): Promise<number>;

  /**
   * 마이그레이션 실행
   */
  migrate(fromVersion: number, toVersion: number): Promise<void>;
}

/**
 * Storage Context 타입
 */
export interface StorageContextType {
  adapter: StorageAdapter;
  isLoading: boolean;
  error: Error | null;
}
