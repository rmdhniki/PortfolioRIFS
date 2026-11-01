import { HeroServicesAbout } from "@/components/sections/hero-services-about";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { Certification } from "@/components/sections/certification";
import { Contact } from "@/components/sections/contact";
import { getSiteSettings } from "@/lib/data/site-settings";
import { getProjects } from "@/lib/data/projects";
import { getExperiences } from "@/lib/data/experiences";
import { getCertifications } from "@/lib/data/certifications";
import {
  siteConfig,
  aboutContent,
  services as staticServices,
  techStack as staticTechStack,
} from "@/lib/site-config";

// Statically cached (ISR): visitors get the cached page instead of waiting on a
// database round trip (Netlify functions run in Ohio, Supabase is in Tokyo).
// Admin saves refresh it on demand via revalidatePath("/", "layout"); this
// hourly refresh is only a safety net.
export const revalidate = 3600;

export default async function Home() {
  const [settings, projects, experiences, certifications] = await Promise.all([
    getSiteSettings(),
    getProjects(),
    getExperiences(),
    getCertifications(),
  ]);

  const serviceOptions = settings?.services?.map((s) => s.title);
  const techRow1 = settings?.tech_stack_row1 ?? [...staticTechStack.row1];
  const techRow2 = settings?.tech_stack_row2 ?? [...staticTechStack.row2];

  return (
    <>
      <HeroServicesAbout
        roles={settings?.roles ?? [...siteConfig.roles]}
        cvUrl={settings?.cv_url ?? null}
        aboutTitle={settings?.about_title ?? aboutContent.title}
        aboutEducation={settings?.about_education ?? aboutContent.education}
        aboutDescription={settings?.about_description ?? aboutContent.description}
        stats={settings?.stats ?? [...aboutContent.stats]}
        services={settings?.services ?? [...staticServices]}
        heroImageUrl={settings?.hero_image_url ?? null}
        servicesImageUrl={settings?.services_image_url ?? null}
        aboutFrontImageUrl={settings?.about_front_image_url ?? null}
        aboutBackImageUrl={settings?.about_back_image_url ?? null}
        lanyardStrapImageUrl={settings?.lanyard_strap_image_url ?? null}
        techRow1={techRow1}
        techRow2={techRow2}
      />
      <Projects projects={projects} />
      <Experience experiences={experiences} />
      <Certification certifications={certifications} />
      <Contact serviceOptions={serviceOptions} />
    </>
  );
}
