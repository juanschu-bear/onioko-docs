'use client';
import { createOpenAPIPage } from 'fumadocs-openapi/ui';

// Playground stays off until a resource is released and the spec carries a real `servers` URL.
export const OpenAPIPage = createOpenAPIPage({ playground: { enabled: false } });
