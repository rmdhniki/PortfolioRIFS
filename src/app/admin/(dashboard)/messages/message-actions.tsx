"use client";

import { useTransition } from "react";
import { Loader2, Mail, MailOpen } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { toggleRead, deleteMessage } from "./actions";

export function MessageActions({ id, isRead }: { id: string; isRead: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => toggleRead(id, !isRead))}
        className="flex size-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-50"
        aria-label={isRead ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : isRead ? (
          <MailOpen className="size-4" />
        ) : (
          <Mail className="size-4" />
        )}
      </button>
      <DeleteButton action={deleteMessage.bind(null, id)} confirmMessage="Hapus pesan ini?" />
    </div>
  );
}
