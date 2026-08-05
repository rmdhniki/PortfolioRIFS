"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

export function DeleteButton({
  action,
  confirmMessage,
}: {
  action: () => Promise<void>;
  confirmMessage: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(() => {
          action();
        });
      }}
      className="flex size-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-red-950/50 hover:text-red-400 disabled:opacity-50"
      aria-label="Hapus"
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Trash2 className="size-4" />
      )}
    </button>
  );
}
