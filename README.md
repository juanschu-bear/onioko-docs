# ONIOKO Developer Docs

Source of docs.onioko.com. Built with Fumadocs (Next.js), English and German.

## Rules

- **Honest or absent.** Nothing here claims a resource exists that the code does not expose. Resources are released, migrating or planned; the state comes from `public-api/STATUS.json`.
- **The API reference is generated, never typed.** `public-api/openapi.json` is a verbatim copy of `anima-core/docs/public-api/openapi.json`. One page per released operation is generated at build time.
- **Do not edit `public-api/*` by hand.** Run `npm run sync:public-api [path-to-anima-core]` (default `../anima-core`).

## Develop

```bash
npm ci
npm run dev        # http://localhost:3000 (redirects to /en)
npm run build
npm run types:check
```

## Content

- `content/docs/*.mdx` English, `*.de.mdx` German. Sidebar order in `meta.json` / `meta.de.json`.
- Flow charts: `components/flow/` (pure SVG, bilingual data in `data.ts`). Use `<FlowChart />` or `<FlowChart case="robot" />` in MDX.
- Status board: `components/status.tsx`, reads `public-api/STATUS.json`.

## Deploy

Next.js app, deploys as is on Vercel or via OpenNext on Cloudflare (Fumadocs does not run on the Edge runtime).
