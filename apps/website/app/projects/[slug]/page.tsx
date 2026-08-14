import { MDX } from '@/components/mdx';

import { FloatingHeader } from '@/components/navigation/floating-header';
import { ScrollArea } from '@/components/scroll-area';
import { USER } from '@/config/user';
import { LLMCopyButtonWithViewOptions } from '@/features/craft/components/copy-page';
import { getAllCrafts, getCraftBySlug } from '@/features/craft/data/posts';
import { createOgImage } from '@/lib/createOgImage';
import { BlogPosting, JsonLd, WithContext } from '@/lib/seo/json-ld';
import { createMetadata } from '@/lib/seo/metadata';
import { cn } from '@/lib/utils';
import { Prose } from '@repo/design-system/components/ui/typography';
import dayjs from 'dayjs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Force static generation at build time
export const dynamic = 'force-static';
export const dynamicParams = false;

export const generateStaticParams = async () => {
  const projects = await getAllCrafts();
  return projects.map((p) => ({ slug: p.slug }));
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const post = await getCraftBySlug(slug);

  if (!post) {
    notFound();
  }

  const { title, date, description } = post.metadata;

  const ogImage = createOgImage({
    title: title,
    meta: USER.domain + ' · ' + date,
  });

  return createMetadata({
    title: title,
    description: description,
    image: ogImage,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const slug = (await params).slug;
  const post = await getCraftBySlug(slug);

  if (!post) {
    notFound();
  }

  const { title, date, description } = post.metadata;

  const jsonLd: WithContext<BlogPosting> = {
    '@type': 'BlogPosting',
    '@context': 'https://schema.org',
    datePublished: dayjs(date).toISOString(),
    description: description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': new URL(`/projects/${post.slug}`, USER.website).toString(),
    },
    headline: title,
    image: post.metadata.image,
    dateModified: dayjs(date).toISOString(),
    author: USER.name,
    isAccessibleForFree: true,
  };

  return (
    <>
      <JsonLd code={jsonLd} />
      <ScrollArea useScrollAreaId>
        <FloatingHeader scrollTitle={title} />
        <div className="layout relative z-10 content-wrapper">
          <div className="mx-auto w-full">
            <div className="mb-8 flex flex-nowrap items-start justify-start">
              <div className="w-full">
                <h1
                  className={cn('scroll-m-20 font-bold text-xl tracking-tight')}
                >
                  {title}
                </h1>
                <p className="text-balance text-muted-foreground text-sm">
                  {new Date(date).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <LLMCopyButtonWithViewOptions
                  markdownUrl={`/projects/${post.slug}.mdx`}
                  isComponent
                />
              </div>
            </div>

            <Prose className="pb-12">
              <p className="lead mt-6 mb-6">{post.metadata.description}</p>

              <MDX code={post.content} />
            </Prose>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
