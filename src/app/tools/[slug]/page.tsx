import type { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { tools, getToolBySlug } from "@/lib/tools";
import { ToolLayout } from "@/components/ToolLayout";

const toolComponents: Record<string, React.ComponentType> = {
  "markdown-editor": dynamic(() => import("@/components/tools/MarkdownEditor")),
  "markdown-to-html": dynamic(() => import("@/components/tools/MarkdownToHtml")),
  "html-to-markdown": dynamic(() => import("@/components/tools/HtmlToMarkdown")),
  "csv-to-markdown": dynamic(() => import("@/components/tools/CsvToMarkdown")),
  "json-to-markdown": dynamic(() => import("@/components/tools/JsonToMarkdown")),
  "markdown-to-text": dynamic(() => import("@/components/tools/MarkdownToText")),
  "markdown-table-generator": dynamic(
    () => import("@/components/tools/MarkdownTableGenerator")
  ),
  "toc-generator": dynamic(() => import("@/components/tools/TocGenerator")),
  "readme-generator": dynamic(() => import("@/components/tools/ReadmeGenerator")),
  "slug-generator": dynamic(() => import("@/components/tools/SlugGenerator")),
  "word-counter": dynamic(() => import("@/components/tools/WordCounter")),
  "link-extractor": dynamic(() => import("@/components/tools/LinkExtractor")),
  "heading-extractor": dynamic(() => import("@/components/tools/HeadingExtractor")),
  "markdown-diff": dynamic(() => import("@/components/tools/MarkdownDiff")),
  "markdown-table-formatter": dynamic(
    () => import("@/components/tools/MarkdownTableFormatter")
  ),
  "markdown-to-pdf": dynamic(() => import("@/components/tools/MarkdownToPdf")),
};

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  return {
    title: `${tool.name} - Free Online Tool`,
    description: tool.description,
    keywords: tool.keywords,
    openGraph: {
      title: `${tool.name} - Free Online Markdown Tool | MarkdownMe`,
      description: tool.description,
      url: `https://markdownme.com/tools/${tool.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${tool.name} | MarkdownMe`,
      description: tool.description,
    },
    alternates: {
      canonical: `https://markdownme.com/tools/${tool.slug}`,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const Component = toolComponents[slug];
  if (!Component) notFound();

  return (
    <ToolLayout tool={tool}>
      <Component />
    </ToolLayout>
  );
}
