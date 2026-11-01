import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { SiteLoader } from "@/components/layout/site-loader";
import { getSiteSettings } from "@/lib/data/site-settings";
import { siteConfig, socialLinks as staticSocialLinks } from "@/lib/site-config";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <SmoothScrollProvider>
      <SiteLoader />
      <div className="flex min-h-full flex-col">
        <div
          aria-hidden
          // Static grain without mix-blend: a blend mode on a full-screen fixed layer
          // forces the whole viewport to be re-composited on every scroll frame.
          className="bg-grain pointer-events-none fixed inset-0 z-40 opacity-[0.025] [transform:translateZ(0)]"
        />
        <ScrollProgress />
        <Navbar availableForWork={settings?.available_for_work ?? true} />
        <main className="flex-1">{children}</main>
        <Footer
          name={settings?.name ?? siteConfig.name}
          email={settings?.email ?? siteConfig.email}
          socialLinks={settings?.social_links ?? [...staticSocialLinks]}
        />
      </div>
    </SmoothScrollProvider>
  );
}
