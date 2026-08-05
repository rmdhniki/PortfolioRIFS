import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Reveal } from "@/components/motion/reveal";
import { GalleryCarousel } from "@/components/motion/gallery-carousel";
import { PhoneMockup } from "@/components/motion/device-mockup";
import { getAdjacentProject, getProjectBySlug } from "@/lib/data/projects";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: `${project.title} — Muhammad Rifki Ramadhani`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const next = await getAdjacentProject(slug);
  if (!next) notFound();
  const meta = [
    { label: "Year", value: project.year },
    { label: "Industry", value: project.industry },
    { label: "Client", value: project.client },
    { label: "Duration", value: project.duration },
  ];
  const storyBlocks = [
    { title: "Overview", text: project.overview },
    { title: "Problem", text: project.problem },
    { title: "Solution", text: project.solution },
  ];

  return (
    <article>
      <section className="pt-32 pb-16 md:pt-40">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-10">
          <Reveal>
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Back to Projects
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="mt-6 inline-block rounded-full border border-border px-3 py-1 text-xs tracking-widest text-muted-foreground uppercase">
              {project.category}
            </span>
          </Reveal>
          <Reveal delay={0.2}>
            <h1 className="mt-4 font-display text-4xl font-medium text-foreground md:text-6xl">
              {project.title}
            </h1>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground md:text-lg">
              {project.description}
            </p>
          </Reveal>
        </div>

        <Reveal
          delay={0.4}
          className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-6 px-6 md:grid-cols-4 md:px-10"
        >
          <div className="col-span-2 grid grid-cols-2 gap-6 md:col-span-4 md:grid-cols-4">
            {meta.map((item) => (
              <div key={item.label}>
                <p className="text-xs tracking-widest text-muted-foreground uppercase">
                  {item.label}
                </p>
                <p className="mt-1 font-medium text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.5} className="mx-auto mt-12 max-w-6xl px-6 md:px-10">
          {project.category === "Mobile Development" ? (
            <div className="flex justify-center rounded-[2rem] border border-border bg-card py-12 shadow-2xl shadow-espresso/10">
              <PhoneMockup
                gradient={project.gradient}
                imageUrl={project.image_url}
                className="w-[260px]"
              />
            </div>
          ) : (
            <div
              className={`relative aspect-video w-full overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br shadow-2xl shadow-espresso/10 ${project.gradient}`}
            >
              {project.image_url && (
                <Image
                  src={project.image_url}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 1024px, 100vw"
                  className="object-cover"
                  priority
                />
              )}
            </div>
          )}
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl space-y-16 px-6 py-16 md:px-10">
        {storyBlocks.map((block) => (
          <Reveal key={block.title}>
            <h2 className="font-display text-2xl font-medium text-foreground md:text-3xl">
              {block.title}
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground md:text-lg">
              {block.text}
            </p>
          </Reveal>
        ))}
      </section>

      <section className="bg-card py-16">
        <div className="mx-auto max-w-4xl px-6 md:px-10">
          <Reveal>
            <h2 className="font-display text-2xl font-medium text-foreground md:text-3xl">
              Features
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {project.features.map((feature, i) => (
              <Reveal key={feature} delay={i * 0.08}>
                <div className="flex items-start gap-3 rounded-2xl border border-border bg-background px-5 py-4">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="size-3.5" />
                  </span>
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 md:px-10">
          <Reveal>
            <h2 className="font-display text-2xl font-medium text-foreground md:text-3xl">
              Technology
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-6 flex flex-wrap gap-3">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-full bg-secondary px-4 py-2 text-sm text-secondary-foreground"
              >
                {t}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <Reveal>
            <h2 className="font-display text-2xl font-medium text-foreground md:text-3xl">
              Gallery
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <GalleryCarousel slides={[...project.gallery]} />
          </Reveal>
        </div>
      </section>

      {(project.github || project.demo) && (
        <section className="py-16">
          <Reveal className="mx-auto flex max-w-4xl flex-wrap justify-center gap-4 px-6 md:px-10">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <FaGithub className="size-4" /> Source Code
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
              >
                Live Demo <ArrowUpRight className="size-4" />
              </a>
            )}
          </Reveal>
        </section>
      )}

      <section className="border-t border-border py-16">
        <Reveal className="mx-auto max-w-4xl px-6 text-center md:px-10">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Next Project
          </p>
          <Link
            href={`/project/${next.slug}`}
            className="group mt-4 inline-flex items-center gap-3 font-display text-3xl font-medium text-foreground transition-colors hover:text-primary md:text-5xl"
          >
            {next.title}
            <ArrowUpRight className="size-7 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </Reveal>
      </section>
    </article>
  );
}
