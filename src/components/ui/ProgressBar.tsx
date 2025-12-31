"use client";

interface ProgressBarProps {
  current: number;
  max: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "green" | "blue" | "yellow" | "purple";
}

const sizeStyles = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

const colorStyles = {
  green: "bg-[var(--eco-green-500)]",
  blue: "bg-[var(--eco-green-400)]",
  yellow: "bg-[var(--eco-yellow-400)]",
  purple: "bg-[var(--tier-rare)]",
};

export function ProgressBar({
  current,
  max,
  showLabel = true,
  size = "md",
  color = "green",
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  const isComplete = current >= max;

  return (
    <div className="w-full">
      {/* 라벨 */}
      {showLabel && (
        <div className="mb-1 flex justify-between text-sm">
          <span className="text-[var(--eco-brown-400)]">
            {current}/{max}
          </span>
          {isComplete && (
            <span className="font-medium text-[var(--eco-green-500)]">
              수확 가능!
            </span>
          )}
        </div>
      )}

      {/* 프로그레스 바 */}
      <div
        className={`w-full overflow-hidden rounded-full bg-[var(--eco-brown-100)] ${sizeStyles[size]} `}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${colorStyles[color]} ${isComplete ? "animate-pulse" : ""} `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
