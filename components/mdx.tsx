import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { FlowChart } from '@/components/flow/flow-chart';
import { IsoTour } from '@/components/flow/iso-tour';
import { Status, StatusBoard } from '@/components/status';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    FlowChart,
    IsoTour,
    Status,
    StatusBoard,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
