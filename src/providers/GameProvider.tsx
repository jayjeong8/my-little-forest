"use client";

import { ReactNode, useEffect, useState } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { checkAndMigrate } from "@/lib/storage";
import { useCooldownStore } from "@/stores/cooldownStore";
import { useGameStore } from "@/stores/gameStore";

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      // 마이그레이션 체크
      await checkAndMigrate();

      // Zustand store 수동 hydration
      await useGameStore.persist.rehydrate();
      await useCooldownStore.persist.rehydrate();

      setIsHydrated(true);
    };

    hydrate();
  }, []);

  // SSR에서는 로딩 표시
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="mb-4 animate-bounce text-4xl">🌳</div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return <ToastProvider>{children}</ToastProvider>;
}
