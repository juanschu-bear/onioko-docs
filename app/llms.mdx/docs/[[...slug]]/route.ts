import { docsLlms, source } from '@/lib/source';
import { getPageMarkdownUrl } from '@/lib/shared';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/llms.mdx/docs/[[...slug]]'>) {
  const { slug } = await params;
  // URL shape: /llms.mdx/docs/<lang>/<...slugs>/content.md
  const [lang, ...rest] = slug ?? [];
  const page = source.getPage(rest.slice(0, -1), lang);
  if (!page) notFound();
  return new Response(await docsLlms.page(page), { headers: { 'Content-Type': 'text/markdown' } });
}

export function generateStaticParams() {
  return source.getPages().flatMap((page) => {
    const lang = page.locale ?? 'en';
    return [{ slug: [lang, ...getPageMarkdownUrl(page).segments] }];
  });
}
