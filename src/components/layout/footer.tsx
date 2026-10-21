import { FaGithub, FaGitlab, FaLinkedinIn } from "react-icons/fa6";
import { ArrowUpRight } from "lucide-react";
import { SmoothLink } from "@/components/smooth-link";
import { Glow } from "@/components/motion/glow";
import { DeveloperCredit } from "@/components/layout/developer-credit";
import type { SocialLink } from "@/lib/supabase/types";

const socialIcons = {
  linkedin: FaLinkedinIn,
  github: FaGithub,
  gitlab: FaGitlab,
} as const;

export function Footer({
  name,
  email,
  socialLinks,
}: {
  name: string;
  email: string;
  socialLinks: SocialLink[];
}) {
  return (
    <footer
      id="contact-footer"
      className="relative mx-3 mb-3 overflow-hidden rounded-[2.5rem] bg-caramel text-espresso shadow-2xl shadow-espresso/25 md:mx-6 md:mb-6"
    >
      <Glow className="-top-24 -right-20 size-80 bg-cream/30" />
      <Glow className="-bottom-28 -left-16 size-72 bg-espresso/10" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:px-10 lg:py-20">
        <div className="flex flex-col justify-between gap-8 border-b border-espresso/15 pb-10 md:flex-row md:items-end">
          <div>
            <p className="font-display text-3xl font-medium italic md:text-4xl">
              Let&apos;s work together.
            </p>
          </div>
          <SmoothLink
            href="/#contact"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-espresso px-5 py-3 text-sm font-medium text-cream transition-transform hover:scale-105"
          >
            Say Hello
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </SmoothLink>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-espresso/60">
              Email
            </p>
            <a
              href={`mailto:${email}`}
              className="text-sm font-medium hover:underline"
            >
              {email}
            </a>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = socialIcons[social.icon as keyof typeof socialIcons];
              if (!Icon) return null;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="flex size-10 items-center justify-center rounded-full border border-espresso/20 transition-colors hover:bg-espresso hover:text-cream"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2 text-xs text-espresso/60 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
          <DeveloperCredit name={name} />
        </div>
      </div>
    </footer>
  );
}
