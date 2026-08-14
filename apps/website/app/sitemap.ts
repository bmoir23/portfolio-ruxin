import { ENABLE_BUDDY } from '@/config/site';
import { getAllCrafts } from '@/features/craft/data/posts';
import { getAllBlogPosts } from '@/features/blog/data/posts';
import { addPathToBaseURL } from '@/lib/server-url';
import dayjs from 'dayjs';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ['/', '/cal', '/projects', '/blog'].concat(
    ENABLE_BUDDY ? ['/buddy'] : []
  );

  const routesArray = await routes.map(async (route) => ({
    url: await addPathToBaseURL(route),
    lastModified: dayjs().toISOString(),
  }));

  const allProjects = await getAllCrafts();
  const projects = allProjects.map(async (post) => ({
    url: await addPathToBaseURL(`/projects/${post.slug}`),
    lastModified: dayjs(post.metadata.date).toISOString(),
  }));

  const allPosts = await getAllBlogPosts();
  const posts = allPosts.map(async (post) => ({
    url: await addPathToBaseURL(`/blog/${post.slug}`),
    lastModified: dayjs(post.metadata.date).toISOString(),
  }));

  const [projectsResolved, postsResolved, routesArrayResolved] =
    await Promise.all([
      Promise.all(projects),
      Promise.all(posts),
      Promise.all(routesArray),
    ]);

  return [...routesArrayResolved, ...projectsResolved, ...postsResolved];
}
