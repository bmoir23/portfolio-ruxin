import { MasonryGrid } from '@/components/masonary-grid';
import { FloatingHeader } from '@/components/navigation/floating-header';
import { ScrollArea } from '@/components/scroll-area';
import { getAllCrafts } from '@/features/craft/data/posts';
import { createOgImage } from '@/lib/createOgImage';
import { Blog, JsonLd, WithContext } from '@/lib/seo/json-ld';
import { createMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { Card } from './page-client';

// Force static generation at build time
export const dynamic = 'force-static';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Projects';
  const description =
    "Things I've architected & shipped — multi-agent platforms, RAG pipelines, and enterprise AI infrastructure.";

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
  const allProjects = await getAllCrafts();

  const jsonLd: WithContext<Blog> = {
    '@type': 'Blog',
    '@context': 'https://schema.org',
  };

  return (
    <>
      <JsonLd code={jsonLd} />
      <ScrollArea useScrollAreaId className="bg-grid">
        <FloatingHeader scrollTitle="Projects" />
        <div className="content-wrapper px-4 pb-4 pt-8 sm:px-8">
          <p className="font-mono text-sm tracking-widest text-muted-foreground uppercase">
            My Work
          </p>
          <h1 className="mt-1 font-semibold text-2xl">
            Things I&apos;ve architected &amp; shipped
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-foreground/70">
            A selection of AI platforms and pipelines I&apos;ve designed and
            built — from multi-agent orchestration systems to production RAG
            and data-extraction infrastructure.
          </p>
        </div>
        <MasonryGrid
          breakpoints={{
            sm: 1,
            lg: 2,
            xl: 3,
          }}
        >
          {allProjects.map((item, index) => (
            <Card
              key={`${item.metadata.title}-${index}`}
              title={item.metadata.title}
              date={new Date(item.metadata.date).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
              href={
                item.metadata.href
                  ? item.metadata.href
                  : `/projects/${item.slug}`
              }
              src={
                item.metadata.video ? item.metadata.video : item.metadata.image
              }
              srcDark={item.metadata.videoDark || undefined}
              type={item.metadata.video ? 'video' : 'image'}
              blurImage={item.metadata.blurImage}
              craft_type={item.metadata.type}
              theme={item.metadata.theme}
              aspectRatio={item.metadata.aspect_ratio}
            />
          ))}
        </MasonryGrid>
      </ScrollArea>
    </>
  );
}
