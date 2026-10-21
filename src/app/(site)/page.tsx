import { HeroServicesAbout } from "@/components/sections/hero-services-about";
import { TechStack } from "@/components/sections/tech-stack";
import { Projects } from "@/components/sections/projects";
import { Contact } from "@/components/sections/contact";
import { getSiteSettings } from "@/lib/data/site-settings";
import { getProjects } from "@/lib/data/projects";
import {
  siteConfig,
  aboutContent,
  services as staticServices,
  techStack as staticTechStack,
} from "@/lib/site-config";

export default async function Home() {
  const [settings, projects] = await Promise.all([getSiteSettings(), getProjects()]);

  const serviceOptions = settings?.services?.map((s) => s.title);

  return (
    <>
      <HeroServicesAbout
        name={settings?.name ?? siteConfig.name}
        roles={settings?.roles ?? [...siteConfig.roles]}
        aboutTitle={settings?.about_title ?? aboutContent.title}
        aboutEducation={settings?.about_education ?? aboutContent.education}
        aboutDescription={settings?.about_description ?? aboutContent.description}
        stats={settings?.stats ?? [...aboutContent.stats]}
        services={settings?.services ?? [...staticServices]}
        portraitImageUrl={settings?.portrait_image_url ?? null}
        workspaceImageUrl={settings?.workspace_image_url ?? null}
      />
      <TechStack
        row1={settings?.tech_stack_row1 ?? [...staticTechStack.row1]}
        row2={settings?.tech_stack_row2 ?? [...staticTechStack.row2]}
      />
      <Projects projects={projects} />
      <Contact serviceOptions={serviceOptions} />
    </>
  );
}
