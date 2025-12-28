"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mb-4 text-6xl">🌧️</div>
        <h2 className="mb-2 text-xl font-bold text-gray-800">
          문제가 발생했어요
        </h2>
        <p className="mb-6 text-gray-600">잠시 후 다시 시도해주세요.</p>
        <Button variant="primary" onClick={reset} className="w-full">
          다시 시도
        </Button>
      </div>
    </div>
  );
}
