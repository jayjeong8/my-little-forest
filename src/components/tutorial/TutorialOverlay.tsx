"use client";

import { Button } from "@/components/ui/Button";
import { useTutorial, TUTORIAL_MESSAGES } from "@/hooks/useTutorial";

export function TutorialOverlay() {
  const { currentStep, isActive, skipTutorial, progress } = useTutorial();

  if (!isActive) return null;

  const message = TUTORIAL_MESSAGES[currentStep];

  return (
    <div className="pointer-events-none fixed right-0 bottom-0 left-0 z-40 p-4">
      <div className="pointer-events-auto mx-auto max-w-md">
        <div className="rounded-xl bg-blue-600 p-4 text-white shadow-lg">
          {/* 진행률 바 */}
          <div className="mb-3 h-1 overflow-hidden rounded-full bg-blue-400">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* 메시지 */}
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <p className="font-medium">{message}</p>
            </div>
          </div>

          {/* 건너뛰기 버튼 */}
          <div className="mt-3 flex justify-end">
            <button
              onClick={skipTutorial}
              className="text-sm text-blue-200 transition-colors hover:text-white"
            >
              튜토리얼 건너뛰기 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TutorialStartScreenProps {
  onStart: () => void;
}

export function TutorialStartScreen({ onStart }: TutorialStartScreenProps) {
  const { skipTutorial } = useTutorial();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-100 to-green-200 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mb-4 text-6xl">🌳</div>
        <h1 className="mb-2 text-2xl font-bold">나의 작은 숲</h1>
        <p className="mb-6 text-gray-600">
          나무를 키우고, 수확하여 보상을 받으세요!
        </p>

        <div className="space-y-3">
          <Button
            variant="success"
            size="lg"
            className="w-full"
            onClick={onStart}
          >
            🌱 시작하기
          </Button>
          <button
            onClick={() => {
              skipTutorial();
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            튜토리얼 없이 시작
          </button>
        </div>
      </div>
    </div>
  );
}
