'use client';

import { SeedCard } from './SeedCard';
import { useSeeds } from '@/hooks/useSeeds';

export function SeedInventory() {
  const { seeds, totalSeeds } = useSeeds();

  if (totalSeeds === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-xl">
        <h3 className="font-bold mb-2">🌰 씨앗 보관함</h3>
        <p className="text-gray-500 text-sm">
          씨앗이 없어요. 나무를 수확하거나 광고를 시청해서 씨앗을 얻으세요!
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold">🌰 씨앗 보관함</h3>
        <span className="text-sm text-gray-500">{totalSeeds}개</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {seeds.map((seed) => (
          <SeedCard key={seed.id} seed={seed} />
        ))}
      </div>
    </div>
  );
}
