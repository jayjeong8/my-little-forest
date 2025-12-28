'use client';

interface ProgressBarProps {
  current: number;
  max: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'blue' | 'yellow' | 'purple';
}

const sizeStyles = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

const colorStyles = {
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
};

export function ProgressBar({
  current,
  max,
  showLabel = true,
  size = 'md',
  color = 'green',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  const isComplete = current >= max;

  return (
    <div className="w-full">
      {/* 라벨 */}
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-gray-600">
            {current}/{max}
          </span>
          {isComplete && (
            <span className="text-green-600 font-medium">완료!</span>
          )}
        </div>
      )}

      {/* 프로그레스 바 */}
      <div
        className={`
          w-full bg-gray-200 rounded-full overflow-hidden
          ${sizeStyles[size]}
        `}
      >
        <div
          className={`
            h-full rounded-full transition-all duration-300 ease-out
            ${colorStyles[color]}
            ${isComplete ? 'animate-pulse' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
