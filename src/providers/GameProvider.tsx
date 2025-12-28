"use client";

import { ReactNode, useEffect, useState } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { checkAndMigrate } from "@/lib/storage";

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // 마이그레이션 체크
    checkAndMigrate().then(() => {
      setIsHydrated(true);
    });
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
