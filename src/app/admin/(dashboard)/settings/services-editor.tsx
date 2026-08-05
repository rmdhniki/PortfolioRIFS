"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { ServiceItem } from "@/lib/supabase/types";

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-caramel";

export function ServicesEditor({ initial }: { initial: ServiceItem[] }) {
  const [items, setItems] = useState<ServiceItem[]>(initial);

  function update(index: number, patch: Partial<ServiceItem>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="services" value={JSON.stringify(items)} />
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 rounded-lg border border-zinc-800 p-3">
          <div className="flex-1 space-y-2">
            <input
              value={item.title}
              onChange={(e) => update(i, { title: e.target.value })}
              placeholder="Judul service"
              className={inputClass}
            />
            <textarea
              value={item.description}
              onChange={(e) => update(i, { description: e.target.value })}
              placeholder="Deskripsi"
              rows={2}
              className={inputClass}
            />
          </div>
          <button
            type="button"
            onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
            className="flex h-fit items-center justify-center rounded-lg p-1.5 text-zinc-500 hover:bg-red-950/50 hover:text-red-400"
            aria-label="Hapus"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems((prev) => [...prev, { title: "", description: "" }])}
        className="flex items-center gap-1.5 text-sm text-caramel hover:underline"
      >
        <Plus className="size-3.5" />
        Add service
      </button>
    </div>
  );
}
