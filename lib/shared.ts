export const appName = 'ONIOKO Developer Docs';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

export const gitConfig = {
  user: 'juanschu-bear',
  repo: 'onioko-docs',
  branch: 'main',
};

// Route handlers live outside /[lang]; the locale is the first segment of their path.
export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];
  return { segments, url: `${docsContentRoute}/${page.locale ?? 'en'}/${segments.join('/')}` };
}

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];
  return { segments, url: `${docsImageRoute}/${page.locale ?? 'en'}/${segments.join('/')}` };
}
