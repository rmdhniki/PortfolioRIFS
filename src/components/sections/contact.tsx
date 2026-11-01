"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Glow } from "@/components/motion/glow";
import { serviceOptions as staticServiceOptions } from "@/lib/site-config";

type Status = "idle" | "loading" | "success" | "error";

export function Contact({
  serviceOptions = staticServiceOptions,
}: {
  serviceOptions?: readonly string[];
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      service: formData.get("service"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Gagal mengirim pesan.");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Gagal mengirim pesan. Periksa koneksi kamu.");
    }
  }

  return (
    <section
      id="contact"
      className="relative overflow-x-clip bg-card/40 py-24 md:py-32"
    >
      <Glow className="top-0 -right-40 size-[30rem] bg-primary/15" />
      <Glow className="-bottom-24 left-0 size-80 bg-secondary/60" />
      <div className="relative mx-auto max-w-2xl px-6 text-center md:px-10">
        <Reveal>
          <p className="eyebrow">
            Contact
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-3 font-display text-4xl font-semibold text-foreground md:text-6xl">
            Let&apos;s Work Together
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Terbuka untuk kolaborasi, freelance project, maupun full-time
            opportunity. Ceritakan kebutuhanmu di bawah.
          </p>
        </Reveal>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 space-y-5 rounded-3xl border border-border bg-card p-6 text-left shadow-sm md:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Nama
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Nama kamu"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="service"
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              Service Needed
            </label>
            <select
              id="service"
              name="service"
              required
              defaultValue=""
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
            >
              <option value="" disabled>
                Pilih kebutuhan kamu
              </option>
              {serviceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="message"
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              What can I help you?
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Ceritakan kebutuhan proyekmu..."
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-button text-primary-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 sm:w-auto"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                Kirim Pesan
                <Send className="size-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          {status === "success" && (
            <p className="text-sm text-primary">
              Pesan terkirim! Terima kasih, aku akan segera membalas.
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
