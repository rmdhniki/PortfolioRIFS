import { NextResponse } from "next/server";
import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { getSiteSettings } from "@/lib/data/site-settings";

export async function POST(request: Request) {
  const { name, email, service, message } = await request.json();

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof service !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !service.trim() ||
    !message.trim()
  ) {
    return NextResponse.json(
      { error: "Semua field wajib diisi." },
      { status: 400 }
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { error: "Format email tidak valid." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json(
      { error: "Server belum dikonfigurasi untuk mengirim email." },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);
  const settings = await getSiteSettings();

  const { error } = await resend.emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>",
    to: settings?.email ?? siteConfig.email,
    replyTo: email,
    subject: `[Portfolio] ${service} — pesan dari ${name}`,
    text: `Nama: ${name}\nEmail: ${email}\nKebutuhan: ${service}\n\nPesan:\n${message}`,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Gagal mengirim pesan. Coba lagi nanti." },
      { status: 502 }
    );
  }

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      await supabase.from("contact_messages").insert({ name, email, service, message });
    } catch (err) {
      console.error("Failed to store contact message:", err);
    }
  }

  return NextResponse.json({ success: true });
}
