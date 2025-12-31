"use client";

import { SeedCard } from "./SeedCard";
import { useSeeds } from "@/hooks/useSeeds";

export function SeedInventory() {
  const { seeds, totalSeeds } = useSeeds();

  if (totalSeeds === 0) {
    return (
      <div className="rounded-2xl border-2 border-[var(--eco-brown-200)] bg-[var(--eco-sand)] p-4">
        <h3 className="mb-2 font-bold text-[var(--eco-brown-500)]">
          씨앗 보관함
        </h3>
        <p className="text-sm text-[var(--eco-brown-400)]">
          씨앗이 없어요. 나무를 수확하거나 광고를 시청해서 씨앗을 얻으세요!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-[var(--eco-brown-200)] bg-[var(--eco-sand)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold text-[var(--eco-brown-500)]">씨앗 보관함</h3>
        <span className="rounded-full bg-[var(--eco-brown-100)] px-3 py-1 text-sm text-[var(--eco-brown-500)]">
          {totalSeeds}개
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {seeds.map((seed) => (
          <SeedCard key={seed.id} seed={seed} />
        ))}
      </div>
    </div>
  );
}
