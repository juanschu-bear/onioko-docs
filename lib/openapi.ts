import { createOpenAPI } from 'fumadocs-openapi/server';

/**
 * The public ONIOKO API contract. The file is a verbatim copy of
 * anima-core/docs/public-api/openapi.json, synced by `npm run sync:public-api`.
 * Nothing in this repository edits the contract by hand.
 */
export const openapi = createOpenAPI({
  input: ['./public-api/openapi.json'],
});
