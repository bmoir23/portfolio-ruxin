import { FloatingHeader } from '@/components/navigation/floating-header';
import { RevealOnLoad } from '@/components/reveal-on-load';
import { ScrollArea } from '@/components/scroll-area';
import { Section } from '@/components/section';
import Separator from '@/components/separator';
import { SkillsVenn } from '@/components/skills-venn';
import { GithubCalendar } from '@/components/ui/retro-space-shooter-git-hub-calendar';
import { WordmarkFooter } from '@/components/wordmark-footer';
import { USER } from '@/config/user';
import { Experiences } from '@/features/home/components/experiences';
import Info from '@/features/home/components/info';
import { Projects } from '@/features/home/components/projects';
import { Button } from '@repo/design-system/components/ui/button';
import { DownloadIcon } from 'lucide-react';
import { createOgImage } from '@/lib/createOgImage';
import { JsonLd, Organization, WithContext } from '@/lib/seo/json-ld';
import { createMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next/types';

// Force static generation at build time
export const dynamic = 'force-static';

export async function generateMetadata(): Promise<Metadata> {
  const title = USER.tagline;
  const description = USER.description;
  const image = createOgImage({
    title: title,
    meta: description,
  });
  return createMetadata({
    title: title,
    description: description,
    image: image,
  });
}

export default async function Page() {
  const jsonLd: WithContext<Organization> = {
    '@type': 'Organization',
    '@context': 'https://schema.org',
  };

  return (
    <>
      <JsonLd code={jsonLd} />
      <Info show={['time', 'screen', 'llms']} />
      <ScrollArea useScrollAreaId className="">
        <FloatingHeader scrollTitle={USER.name} />

        <Separator />

        {/* Hero Section */}
        <Section>
          <RevealOnLoad delay={0} duration={0.5}>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-2xl">{USER.name}</h1>
              </div>
              <p className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
                {USER.jobTitle}
              </p>
            </div>
          </RevealOnLoad>

          <RevealOnLoad delay={0.15} duration={0.5}>
            <div className="mt-6 space-y-3 text-foreground/70">
              <p className="leading-relaxed">
                I&apos;m the CTO &amp; Principal AI Architect at{' '}
                <a
                  href="https://get.liinkd.xyz/"
                  className="text-foreground underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Liink&apos;d
                </a>
                , where I designed the Syncc Executive Agent OS — a production
                multi-agent platform built on LangChain orchestration, the MCP
                protocol, n8n agentic workflows, and vector database retrieval.
              </p>
              <p className="leading-relaxed">
                I bring 10+ years of technical leadership across SaaS and
                enterprise platforms, owning product strategy, delivery
                execution, and cross-functional roadmap alignment from discovery
                to launch. I specialize in LLM platform design, multi-agent
                orchestration, and enterprise AI operating models — including
                evaluation frameworks, governance controls, observability, and
                scale-ready cloud deployment across GCP and Vertex AI.
              </p>
              <p className="pt-2">
                <Button asChild size="sm">
                  <a
                    href={USER.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Brian-Moir-Resume.pdf"
                  >
                    <DownloadIcon />
                    Download resume / CV
                  </a>
                </Button>
              </p>
            </div>
          </RevealOnLoad>

          <RevealOnLoad delay={0.3} duration={0.6}>
            <SkillsVenn
              profileImage={USER.image.profile}
              skills={{
                top: 'Multi-Agent Systems',
                left: 'RAG Pipelines',
                right: 'Enterprise AI',
                bottom: 'MCP &\nOrchestration',
              }}
              className="mt-8"
            />
          </RevealOnLoad>
        </Section>

        <Separator />

        <Section>
          <h2 className="sr-only">GitHub Contribution</h2>
          <GithubCalendar username={USER.username} className="w-full" />
        </Section>

        <Separator />

        <Section>
          <Projects />
        </Section>

        <Separator />

        <Section>
          <Experiences />
        </Section>

        <Separator />

        <Section className="px-0 py-0 sm:px-0 md:py-0">
          <WordmarkFooter brandName={USER.name} />
        </Section>

        <Separator />
        <div className="h-[clamp(80px,10vh,200px)] shrink-0" />
      </ScrollArea>
    </>
  );
}
