import type { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { tools, getToolBySlug } from "@/lib/tools";
import { ToolLayout } from "@/components/ToolLayout";

const toolComponents: Record<string, React.ComponentType> = {
  // Existing
  "markdown-editor": dynamic(() => import("@/components/tools/MarkdownEditor")),
  "markdown-to-html": dynamic(() => import("@/components/tools/MarkdownToHtml")),
  "html-to-markdown": dynamic(() => import("@/components/tools/HtmlToMarkdown")),
  "csv-to-markdown": dynamic(() => import("@/components/tools/CsvToMarkdown")),
  "json-to-markdown": dynamic(() => import("@/components/tools/JsonToMarkdown")),
  "markdown-to-text": dynamic(() => import("@/components/tools/MarkdownToText")),
  "markdown-to-pdf": dynamic(() => import("@/components/tools/MarkdownToPdf")),
  "markdown-table-generator": dynamic(() => import("@/components/tools/MarkdownTableGenerator")),
  "toc-generator": dynamic(() => import("@/components/tools/TocGenerator")),
  "readme-generator": dynamic(() => import("@/components/tools/ReadmeGenerator")),
  "slug-generator": dynamic(() => import("@/components/tools/SlugGenerator")),
  "word-counter": dynamic(() => import("@/components/tools/WordCounter")),
  "link-extractor": dynamic(() => import("@/components/tools/LinkExtractor")),
  "heading-extractor": dynamic(() => import("@/components/tools/HeadingExtractor")),
  "markdown-diff": dynamic(() => import("@/components/tools/MarkdownDiff")),
  "markdown-table-formatter": dynamic(() => import("@/components/tools/MarkdownTableFormatter")),
  // New converters
  "markdown-to-slack": dynamic(() => import("@/components/tools/MarkdownToSlack")),
  "markdown-to-bbcode": dynamic(() => import("@/components/tools/MarkdownToBbcode")),
  "markdown-to-latex": dynamic(() => import("@/components/tools/MarkdownToLatex")),
  "markdown-to-jira": dynamic(() => import("@/components/tools/MarkdownToJira")),
  // New generators
  "badge-generator": dynamic(() => import("@/components/tools/BadgeGenerator")),
  "changelog-generator": dynamic(() => import("@/components/tools/ChangelogGenerator")),
  "license-generator": dynamic(() => import("@/components/tools/LicenseGenerator")),
  "footnote-generator": dynamic(() => import("@/components/tools/FootnoteGenerator")),
  "collapsible-generator": dynamic(() => import("@/components/tools/CollapsibleGenerator")),
  "contributing-generator": dynamic(() => import("@/components/tools/ContributingGenerator")),
  // New analysis
  "broken-link-checker": dynamic(() => import("@/components/tools/BrokenLinkChecker")),
  "readability-score": dynamic(() => import("@/components/tools/ReadabilityScore")),
  "image-extractor": dynamic(() => import("@/components/tools/ImageExtractor")),
  "markdown-linter": dynamic(() => import("@/components/tools/MarkdownLinter")),
  // New formatters
  "markdown-prettifier": dynamic(() => import("@/components/tools/MarkdownPrettifier")),
  "list-sorter": dynamic(() => import("@/components/tools/ListSorter")),
  "url-reference-converter": dynamic(() => import("@/components/tools/UrlReferenceConverter")),
  // Utilities
  "markdown-cheat-sheet": dynamic(() => import("@/components/tools/MarkdownCheatSheet")),
  "regex-find-replace": dynamic(() => import("@/components/tools/RegexFindReplace")),
  "frontmatter-editor": dynamic(() => import("@/components/tools/FrontmatterEditor")),
  "wysiwyg-editor": dynamic(() => import("@/components/tools/WysiwygEditor")),
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
