"use client";

import { useTutorial, TUTORIAL_MESSAGES } from "@/hooks/useTutorial";

export function TutorialOverlay() {
  const { currentStep, isActive, progress } = useTutorial();

  if (!isActive) return null;

  const message = TUTORIAL_MESSAGES[currentStep];

  return (
    <div className="pointer-events-none fixed right-0 bottom-0 left-0 z-40 p-4">
      <div className="pointer-events-auto mx-auto max-w-md">
        <div className="rounded-xl bg-blue-600 p-4 text-white shadow-lg">
          <div className="mb-3 h-1 overflow-hidden rounded-full bg-blue-400">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <p className="font-medium">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
