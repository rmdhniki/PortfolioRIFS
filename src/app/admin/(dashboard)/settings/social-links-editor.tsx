"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { SocialLink } from "@/lib/supabase/types";

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-caramel";

const ICON_OPTIONS = ["linkedin", "github", "gitlab"];

export function SocialLinksEditor({ initial }: { initial: SocialLink[] }) {
  const [items, setItems] = useState<SocialLink[]>(initial);

  function update(index: number, patch: Partial<SocialLink>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="social_links" value={JSON.stringify(items)} />
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[6rem_1fr_6rem_2rem] gap-2">
          <select
            value={item.icon}
            onChange={(e) => update(i, { icon: e.target.value })}
            className={inputClass}
          >
            {ICON_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <input
            value={item.href}
            onChange={(e) => update(i, { href: e.target.value })}
            placeholder="https://..."
            className={inputClass}
          />
          <input
            value={item.label}
            onChange={(e) => update(i, { label: e.target.value })}
            placeholder="Label"
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
        onClick={() =>
          setItems((prev) => [...prev, { label: "", href: "", icon: "github" }])
        }
        className="flex items-center gap-1.5 text-sm text-caramel hover:underline"
      >
        <Plus className="size-3.5" />
        Add social link
      </button>
    </div>
  );
}
