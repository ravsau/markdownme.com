export interface Tool {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  keywords: string[];
  category: ToolCategory;
  icon: string;
}

export type ToolCategory =
  | "converters"
  | "generators"
  | "analysis"
  | "formatters";

export const categoryLabels: Record<ToolCategory, string> = {
  converters: "Converters",
  generators: "Generators",
  analysis: "Analysis",
  formatters: "Formatters",
};

export const categoryDescriptions: Record<ToolCategory, string> = {
  converters: "Convert between Markdown and other formats",
  generators: "Generate Markdown content from scratch",
  analysis: "Analyze and inspect Markdown documents",
  formatters: "Clean up and format Markdown",
};

export const tools: Tool[] = [
  {
    slug: "markdown-editor",
    name: "Markdown Editor",
    description:
      "Free online Markdown editor with live preview. Write and preview Markdown in real-time with GitHub Flavored Markdown support.",
    longDescription:
      "Write Markdown in the editor and see it rendered in real-time. Supports GitHub Flavored Markdown including tables, task lists, strikethrough, and more.",
    keywords: [
      "markdown editor",
      "online markdown editor",
      "markdown live preview",
      "markdown writer",
      "GFM editor",
    ],
    category: "converters",
    icon: "FileEdit",
  },
  {
    slug: "markdown-to-html",
    name: "Markdown to HTML",
    description:
      "Convert Markdown to clean HTML code instantly. Free online Markdown to HTML converter with copy and download options.",
    longDescription:
      "Paste your Markdown and get clean, semantic HTML output. Perfect for embedding in websites, emails, or CMS platforms.",
    keywords: [
      "markdown to html",
      "markdown to html converter",
      "convert markdown to html",
      "md to html",
    ],
    category: "converters",
    icon: "FileCode",
  },
  {
    slug: "html-to-markdown",
    name: "HTML to Markdown",
    description:
      "Convert HTML to clean Markdown instantly. Free online HTML to Markdown converter. Paste HTML and get Markdown output.",
    longDescription:
      "Paste your HTML code and get clean Markdown output. Great for migrating content from websites to Markdown-based systems like GitHub, Jekyll, or Obsidian.",
    keywords: [
      "html to markdown",
      "html to markdown converter",
      "convert html to markdown",
      "html to md",
    ],
    category: "converters",
    icon: "FileText",
  },
  {
    slug: "csv-to-markdown",
    name: "CSV to Markdown Table",
    description:
      "Convert CSV data to a formatted Markdown table. Free online CSV to Markdown converter with alignment options.",
    longDescription:
      "Paste CSV data or tab-separated values and instantly get a properly formatted Markdown table. Supports custom delimiters and column alignment.",
    keywords: [
      "csv to markdown",
      "csv to markdown table",
      "convert csv to markdown",
      "spreadsheet to markdown",
    ],
    category: "converters",
    icon: "Table",
  },
  {
    slug: "json-to-markdown",
    name: "JSON to Markdown Table",
    description:
      "Convert JSON arrays to Markdown tables. Free online JSON to Markdown converter for developers.",
    longDescription:
      "Paste a JSON array of objects and get a formatted Markdown table. Perfect for converting API responses or data files into readable documentation.",
    keywords: [
      "json to markdown",
      "json to markdown table",
      "convert json to markdown",
      "json to md",
    ],
    category: "converters",
    icon: "Braces",
  },
  {
    slug: "markdown-to-text",
    name: "Markdown to Plain Text",
    description:
      "Strip Markdown formatting and get clean plain text. Free online Markdown to text converter.",
    longDescription:
      "Remove all Markdown syntax (headings, bold, italic, links, images, code blocks) and get clean, readable plain text.",
    keywords: [
      "markdown to text",
      "strip markdown",
      "remove markdown formatting",
      "markdown to plain text",
    ],
    category: "converters",
    icon: "Type",
  },
  {
    slug: "markdown-table-generator",
    name: "Markdown Table Generator",
    description:
      "Generate Markdown tables visually. Free online Markdown table generator with a spreadsheet-like interface.",
    longDescription:
      "Build Markdown tables using a visual spreadsheet-like grid. Add rows and columns, set alignment, and copy the generated Markdown table code.",
    keywords: [
      "markdown table generator",
      "create markdown table",
      "markdown table maker",
      "generate markdown table",
    ],
    category: "generators",
    icon: "Grid3x3",
  },
  {
    slug: "toc-generator",
    name: "Table of Contents Generator",
    description:
      "Generate a Markdown table of contents from your document. Free online TOC generator with anchor links.",
    longDescription:
      "Paste a Markdown document and automatically generate a linked table of contents based on the heading structure. Supports H1-H6 with proper nesting.",
    keywords: [
      "markdown table of contents",
      "toc generator",
      "markdown toc",
      "table of contents generator",
    ],
    category: "generators",
    icon: "List",
  },
  {
    slug: "readme-generator",
    name: "README Generator",
    description:
      "Generate a professional GitHub README.md. Free online README generator with templates and badges.",
    longDescription:
      "Fill in a simple form and generate a complete, professional README.md for your GitHub project. Includes sections for description, installation, usage, badges, and more.",
    keywords: [
      "readme generator",
      "github readme generator",
      "readme template",
      "create readme",
      "readme maker",
    ],
    category: "generators",
    icon: "BookOpen",
  },
  {
    slug: "slug-generator",
    name: "Slug Generator",
    description:
      "Generate URL-friendly slugs from Markdown headings. Free online slug generator for anchor links.",
    longDescription:
      "Convert headings or any text into URL-friendly slugs compatible with GitHub, GitLab, and other Markdown renderers. See how your heading will be anchored.",
    keywords: [
      "slug generator",
      "markdown slug",
      "anchor link generator",
      "heading slug",
      "url slug generator",
    ],
    category: "generators",
    icon: "Hash",
  },
  {
    slug: "word-counter",
    name: "Word & Character Counter",
    description:
      "Count words, characters, sentences, and reading time in Markdown. Free online Markdown-aware word counter.",
    longDescription:
      "Get accurate word, character, sentence, and paragraph counts from Markdown text. Markdown-aware: doesn't count syntax characters. Also estimates reading time.",
    keywords: [
      "word counter",
      "markdown word counter",
      "character counter",
      "reading time calculator",
      "word count",
    ],
    category: "analysis",
    icon: "LetterText",
  },
  {
    slug: "link-extractor",
    name: "Link Extractor",
    description:
      "Extract all URLs and links from Markdown text. Free online Markdown link extractor.",
    longDescription:
      "Paste Markdown and extract all links including inline links, reference links, and bare URLs. Export as a plain list or CSV.",
    keywords: [
      "markdown link extractor",
      "extract links from markdown",
      "markdown url extractor",
      "find links in markdown",
    ],
    category: "analysis",
    icon: "Link",
  },
  {
    slug: "heading-extractor",
    name: "Heading Extractor",
    description:
      "Extract all headings from a Markdown document as a structured outline. Free online heading extractor.",
    longDescription:
      "Parse a Markdown document and extract all headings (H1-H6) as a structured, indented outline. Useful for reviewing document structure at a glance.",
    keywords: [
      "markdown heading extractor",
      "extract headings from markdown",
      "markdown outline",
      "document structure",
    ],
    category: "analysis",
    icon: "Heading",
  },
  {
    slug: "markdown-diff",
    name: "Markdown Diff",
    description:
      "Compare two Markdown documents side by side. Free online Markdown diff tool with highlighted changes.",
    longDescription:
      "Paste two Markdown documents and see the differences highlighted. Additions, deletions, and modifications are color-coded for easy review.",
    keywords: [
      "markdown diff",
      "compare markdown",
      "markdown compare tool",
      "diff markdown files",
    ],
    category: "analysis",
    icon: "GitCompareArrows",
  },
  {
    slug: "markdown-table-formatter",
    name: "Markdown Table Formatter",
    description:
      "Beautify and align Markdown tables. Free online Markdown table formatter and prettifier.",
    longDescription:
      "Paste a messy Markdown table and get it properly padded, aligned, and formatted. Fixes inconsistent spacing and pipe alignment.",
    keywords: [
      "markdown table formatter",
      "format markdown table",
      "beautify markdown table",
      "align markdown table",
      "markdown table prettifier",
    ],
    category: "formatters",
    icon: "AlignJustify",
  },
  {
    slug: "markdown-to-pdf",
    name: "Markdown to PDF",
    description:
      "Convert Markdown to a downloadable PDF. Free online Markdown to PDF converter with styled output.",
    longDescription:
      "Paste Markdown and generate a beautifully styled PDF document. Uses your browser's built-in PDF engine for perfect rendering.",
    keywords: [
      "markdown to pdf",
      "convert markdown to pdf",
      "markdown pdf converter",
      "md to pdf",
      "export markdown as pdf",
    ],
    category: "converters",
    icon: "FileDown",
  },
];

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((t) => t.category === category);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export const categories: ToolCategory[] = [
  "converters",
  "generators",
  "analysis",
  "formatters",
];
