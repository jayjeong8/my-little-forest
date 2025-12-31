"use client";

import { useTutorial, TUTORIAL_MESSAGES } from "@/hooks/useTutorial";

export function TutorialOverlay() {
  const { currentStep, isActive, progress } = useTutorial();

  if (!isActive) return null;

  const message = TUTORIAL_MESSAGES[currentStep];

  return (
    <div className="pointer-events-none fixed right-0 bottom-0 left-0 z-40 p-4">
      <div className="pointer-events-auto mx-auto max-w-md">
        <div className="rounded-2xl border-2 border-[var(--eco-green-300)] bg-[var(--eco-green-500)] p-4 text-white shadow-lg">
          <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-[var(--eco-green-400)]">
            <div
              className="h-full bg-[var(--eco-cream)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--eco-green-400)]">
              <span className="text-xl">🌱</span>
            </div>
            <div className="flex-1">
              <p className="leading-relaxed font-medium">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
