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
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-green-700">🌳 나의 작은 숲</h1>
        <div className="flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1">
          <span>💰</span>
          <span className="font-bold text-yellow-700">
            {totalPoints.toLocaleString()}
          </span>
        </div>
      </div>
    </header>
  );
}

function GameScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
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
