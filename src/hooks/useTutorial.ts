"use client";

import type { TutorialStep } from "@/types/game";
import { useCallback, useMemo } from "react";
import { useGameStore } from "@/stores/gameStore";

// 튜토리얼 단계별 안내 메시지
export const TUTORIAL_MESSAGES: Record<TutorialStep, string> = {
  not_started: "",
  water_tree: "새싹에게 물을 주세요! 나무를 탭하고 물주기 버튼을 누르세요.",
  harvest_tree: "나무가 다 자랐어요! 수확 버튼을 눌러 보상을 받으세요.",
  plant_seed: "씨앗을 받았어요! 빈 땅을 탭해서 씨앗을 심어보세요.",
  fertilize_intro:
    "비료를 주면 나무가 더 빨리 자라요. 광고를 시청하고 비료를 받아보세요.",
  completed: "",
};

// 튜토리얼 단계 순서
const STEP_ORDER: TutorialStep[] = [
  "not_started",
  "water_tree",
  "harvest_tree",
  "plant_seed",
  "fertilize_intro",
  "completed",
];

export function useTutorial() {
  const tutorial = useGameStore((state) => state.tutorial);
  const initializeTutorial = useGameStore((state) => state.initializeTutorial);
  const advanceTutorial = useGameStore((state) => state.advanceTutorial);
  const setTutorialStep = useGameStore((state) => state.setTutorialStep);

  // 현재 단계
  const currentStep = tutorial.currentStep;

  // 완료 여부
  const isCompleted = currentStep === "completed";

  // 진행 중 여부
  const isActive = currentStep !== "not_started" && currentStep !== "completed";

  // 시작 전 여부
  const isNotStarted = currentStep === "not_started";

  // 현재 메시지
  const currentMessage = TUTORIAL_MESSAGES[currentStep];

  // 진행률 (0 ~ 100)
  const progress = useMemo(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    const totalSteps = STEP_ORDER.length - 1; // not_started 제외

    return Math.round((currentIndex / totalSteps) * 100);
  }, [currentStep]);

  // 튜토리얼 시작
  const startTutorial = useCallback(() => {
    initializeTutorial();
  }, [initializeTutorial]);

  // 특정 단계로 이동
  const goToStep = useCallback(
    (step: TutorialStep) => {
      setTutorialStep(step);
    },
    [setTutorialStep],
  );

  // 튜토리얼 건너뛰기
  const skipTutorial = useCallback(() => {
    setTutorialStep("completed");
  }, [setTutorialStep]);

  // 특정 단계인지 확인
  const isStep = useCallback(
    (step: TutorialStep) => {
      return currentStep === step;
    },
    [currentStep],
  );

  return {
    currentStep,
    isCompleted,
    isActive,
    isNotStarted,
    currentMessage,
    progress,
    completedAt: tutorial.completedAt,
    startTutorial,
    advanceTutorial,
    goToStep,
    skipTutorial,
    isStep,
  };
}
