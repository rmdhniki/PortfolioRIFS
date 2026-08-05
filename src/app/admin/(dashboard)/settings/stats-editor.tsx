"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { StatItem } from "@/lib/supabase/types";

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-caramel";

export function StatsEditor({ initial }: { initial: StatItem[] }) {
  const [items, setItems] = useState<StatItem[]>(initial);

  function update(index: number, patch: Partial<StatItem>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="stats" value={JSON.stringify(items)} />
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_5rem_4rem_2rem] gap-2">
          <input
            value={item.label}
            onChange={(e) => update(i, { label: e.target.value })}
            placeholder="Label"
            className={inputClass}
          />
          <input
            type="number"
            value={item.value}
            onChange={(e) => update(i, { value: Number(e.target.value) })}
            placeholder="Value"
            className={inputClass}
          />
          <input
            value={item.suffix}
            onChange={(e) => update(i, { suffix: e.target.value })}
            placeholder="+"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
            className="flex items-center justify-center rounded-lg text-zinc-500 hover:bg-red-950/50 hover:text-red-400"
            aria-label="Hapus"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems((prev) => [...prev, { label: "", value: 0, suffix: "+" }])}
        className="flex items-center gap-1.5 text-sm text-caramel hover:underline"
      >
        <Plus className="size-3.5" />
        Add stat
      </button>
    </div>
  );
}
