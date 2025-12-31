"use client";

import { useEffect } from "react";
import { MockAdButton } from "@/components/ads";
import { ForestGrid } from "@/components/game";
import { SeedInventory } from "@/components/inventory";
import { TutorialOverlay } from "@/components/tutorial";
import { useTutorial } from "@/hooks/useTutorial";
import { useGameStore } from "@/stores/gameStore";

function GameHeader() {
  const totalPoints = useGameStore((state) => state.totalPoints);

  return (
    <header className="border-b border-[var(--eco-beige)] bg-[var(--eco-cream)]">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--eco-green-100)]">
            <span className="text-xl">🌳</span>
          </div>
          <h1 className="text-lg font-bold text-[var(--eco-green-600)]">
            나의 작은 숲
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[var(--eco-yellow-100)] px-4 py-2 shadow-sm">
          <span className="text-lg">🪙</span>
          <span className="font-bold text-[var(--eco-brown-500)]">
            {totalPoints.toLocaleString()}
          </span>
        </div>
      </div>
    </header>
  );
}

function GameScreen() {
  return (
    <div className="min-h-screen bg-[var(--eco-cream)]">
      <GameHeader />

      <main className="mx-auto max-w-md space-y-4 p-4">
        {/* 숲 그리드 */}
        <ForestGrid />

        {/* 씨앗 광고 버튼 */}
        <MockAdButton type="seed" />

        {/* 씨앗 인벤토리 */}
        <SeedInventory />
      </main>

      {/* 튜토리얼 오버레이 */}
      <TutorialOverlay />
    </div>
  );
}

export default function Home() {
  const { isNotStarted, startTutorial } = useTutorial();
  const trees = useGameStore((state) => state.trees);

  // 첫 방문자: 자동으로 튜토리얼 시작
  useEffect(() => {
    if (isNotStarted && trees.length === 0) {
      startTutorial();
    }
  }, [isNotStarted, trees.length, startTutorial]);

  return <GameScreen />;
}
