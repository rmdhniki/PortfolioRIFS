import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
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
      <div className="flex min-h-full flex-col">
        <div
          aria-hidden
          className="bg-grain pointer-events-none fixed inset-0 z-40 opacity-[0.035] mix-blend-overlay"
        />
        <ScrollProgress />
        <Navbar
          brand={settings?.brand ?? siteConfig.brand}
          availableForWork={settings?.available_for_work ?? siteConfig.availableForWork}
        />
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
