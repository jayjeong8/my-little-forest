'use client';

import { Button } from '@/components/ui/Button';
import { useTutorial, TUTORIAL_MESSAGES } from '@/hooks/useTutorial';

export function TutorialOverlay() {
  const { currentStep, isActive, skipTutorial, progress } = useTutorial();

  if (!isActive) return null;

  const message = TUTORIAL_MESSAGES[currentStep];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="bg-blue-600 text-white rounded-xl shadow-lg p-4">
          {/* 진행률 바 */}
          <div className="h-1 bg-blue-400 rounded-full mb-3 overflow-hidden">
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
              className="text-sm text-blue-200 hover:text-white transition-colors"
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-green-100 to-green-200">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-6xl mb-4">🌳</div>
        <h1 className="text-2xl font-bold mb-2">나의 작은 숲</h1>
        <p className="text-gray-600 mb-6">
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
