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
  | "formatters"
  | "utilities";

export const categoryLabels: Record<ToolCategory, string> = {
  converters: "Converters",
  generators: "Generators",
  analysis: "Analysis",
  formatters: "Formatters",
  utilities: "Utilities",
};

export const categoryDescriptions: Record<ToolCategory, string> = {
  converters: "Convert between Markdown and other formats",
  generators: "Generate Markdown content from scratch",
  analysis: "Analyze and inspect Markdown documents",
  formatters: "Clean up and format Markdown",
  utilities: "Reference guides and power-user tools",
};

export const tools: Tool[] = [
  // ── Converters ──
  {
    slug: "markdown-editor",
    name: "Markdown Editor",
    description:
      "Free online Markdown editor with live preview. Write and preview Markdown in real-time with GitHub Flavored Markdown support.",
    longDescription:
      "Write Markdown in the editor and see it rendered in real-time. Supports GitHub Flavored Markdown including tables, task lists, strikethrough, and more.",
    keywords: ["markdown editor", "online markdown editor", "markdown live preview", "markdown writer", "GFM editor"],
    category: "converters",
    icon: "FileEdit",
  },
  {
    slug: "wysiwyg-editor",
    name: "WYSIWYG Markdown Editor",
    description:
      "Rich text WYSIWYG editor that outputs clean Markdown. Free online visual Markdown editor.",
    longDescription:
      "Write using a familiar rich text toolbar (bold, italic, headings, lists, links) and get clean Markdown output. Perfect for users who prefer visual editing over writing raw Markdown syntax.",
    keywords: ["wysiwyg markdown editor", "visual markdown editor", "rich text to markdown", "wysiwyg to markdown"],
    category: "converters",
    icon: "PenLine",
  },
  {
    slug: "markdown-to-html",
    name: "Markdown to HTML",
    description:
      "Convert Markdown to clean HTML code instantly. Free online Markdown to HTML converter with copy and download options.",
    longDescription:
      "Paste your Markdown and get clean, semantic HTML output. Perfect for embedding in websites, emails, or CMS platforms.",
    keywords: ["markdown to html", "markdown to html converter", "convert markdown to html", "md to html"],
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
    keywords: ["html to markdown", "html to markdown converter", "convert html to markdown", "html to md"],
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
    keywords: ["csv to markdown", "csv to markdown table", "convert csv to markdown", "spreadsheet to markdown"],
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
    keywords: ["json to markdown", "json to markdown table", "convert json to markdown", "json to md"],
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
    keywords: ["markdown to text", "strip markdown", "remove markdown formatting", "markdown to plain text"],
    category: "converters",
    icon: "Type",
  },
  {
    slug: "markdown-to-pdf",
    name: "Markdown to PDF",
    description:
      "Convert Markdown to a downloadable PDF. Free online Markdown to PDF converter with styled output.",
    longDescription:
      "Paste Markdown and generate a beautifully styled PDF document. Uses your browser's built-in PDF engine for perfect rendering.",
    keywords: ["markdown to pdf", "convert markdown to pdf", "markdown pdf converter", "md to pdf"],
    category: "converters",
    icon: "FileDown",
  },
  {
    slug: "markdown-to-slack",
    name: "Markdown to Slack/Discord",
    description:
      "Convert standard Markdown to Slack mrkdwn or Discord formatting. Free online Markdown to Slack converter.",
    longDescription:
      "Translate standard Markdown into Slack's mrkdwn syntax or Discord's flavor. Handles bold, italic, links, code blocks, and lists with the correct platform syntax.",
    keywords: ["markdown to slack", "markdown to discord", "slack mrkdwn converter", "discord markdown"],
    category: "converters",
    icon: "MessageSquare",
  },
  {
    slug: "markdown-to-bbcode",
    name: "Markdown to BBCode",
    description:
      "Convert Markdown to BBCode for forums. Free online Markdown to BBCode converter.",
    longDescription:
      "Paste Markdown and get BBCode output ready to post on forums like phpBB, vBulletin, and XenForo. Converts headings, bold, italic, links, images, code, and lists.",
    keywords: ["markdown to bbcode", "bbcode converter", "convert markdown to bbcode", "forum formatting"],
    category: "converters",
    icon: "Code",
  },
  {
    slug: "markdown-to-latex",
    name: "Markdown to LaTeX",
    description:
      "Convert Markdown to LaTeX source code. Free online Markdown to LaTeX converter for academic writing.",
    longDescription:
      "Paste Markdown and get LaTeX output for academic papers, theses, and scientific documents. Handles headings, lists, bold, italic, links, images, and code blocks.",
    keywords: ["markdown to latex", "latex converter", "convert markdown to latex", "academic markdown"],
    category: "converters",
    icon: "GraduationCap",
  },
  {
    slug: "markdown-to-jira",
    name: "Markdown to Jira/Confluence",
    description:
      "Convert Markdown to Jira and Confluence wiki markup. Free online converter for Atlassian users.",
    longDescription:
      "Paste standard Markdown and get Jira or Confluence wiki markup. Translates headings, lists, bold, italic, code blocks, links, images, and tables to Atlassian syntax.",
    keywords: ["markdown to jira", "markdown to confluence", "jira markup converter", "atlassian wiki markup"],
    category: "converters",
    icon: "Ticket",
  },
  // ── Generators ──
  {
    slug: "markdown-table-generator",
    name: "Markdown Table Generator",
    description:
      "Generate Markdown tables visually. Free online Markdown table generator with a spreadsheet-like interface.",
    longDescription:
      "Build Markdown tables using a visual spreadsheet-like grid. Add rows and columns, set alignment, and copy the generated Markdown table code.",
    keywords: ["markdown table generator", "create markdown table", "markdown table maker", "generate markdown table"],
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
    keywords: ["markdown table of contents", "toc generator", "markdown toc", "table of contents generator"],
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
    keywords: ["readme generator", "github readme generator", "readme template", "create readme", "readme maker"],
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
    keywords: ["slug generator", "markdown slug", "anchor link generator", "heading slug", "url slug generator"],
    category: "generators",
    icon: "Hash",
  },
  {
    slug: "badge-generator",
    name: "Badge Generator",
    description:
      "Generate shields.io badges for your README. Free visual badge builder with Markdown output.",
    longDescription:
      "Build shields.io badges visually - pick a style, set label, message, and color, then copy the Markdown image syntax. Perfect for GitHub READMEs.",
    keywords: ["badge generator", "shields.io badge", "github badge generator", "readme badge maker"],
    category: "generators",
    icon: "Award",
  },
  {
    slug: "changelog-generator",
    name: "Changelog Generator",
    description:
      "Generate a Markdown changelog following Keep a Changelog format. Free online changelog builder.",
    longDescription:
      "Fill in a form with your changes (Added, Changed, Deprecated, Removed, Fixed, Security) and generate a properly formatted changelog following the Keep a Changelog convention.",
    keywords: ["changelog generator", "keep a changelog", "markdown changelog", "generate changelog"],
    category: "generators",
    icon: "ClipboardList",
  },
  {
    slug: "license-generator",
    name: "License Generator",
    description:
      "Generate a LICENSE file in Markdown. Pick from MIT, Apache, GPL, BSD, and more. Free license text generator.",
    longDescription:
      "Select a popular open source license, fill in your name and year, and get the complete license text ready to copy into your repository as a LICENSE or LICENSE.md file.",
    keywords: ["license generator", "mit license generator", "open source license", "license file generator"],
    category: "generators",
    icon: "Scale",
  },
  {
    slug: "footnote-generator",
    name: "Footnote Generator",
    description:
      "Create and manage Markdown footnotes visually. Free online footnote builder for Markdown documents.",
    longDescription:
      "Add footnote references and their definitions through a simple form. Generates properly formatted Markdown footnote syntax with numbered references and bottom-of-page definitions.",
    keywords: ["markdown footnotes", "footnote generator", "markdown footnote syntax", "create footnotes"],
    category: "generators",
    icon: "Subscript",
  },
  {
    slug: "collapsible-generator",
    name: "Collapsible Section Generator",
    description:
      "Generate collapsible/expandable sections for Markdown. Free online details/summary block builder.",
    longDescription:
      "Create HTML details/summary blocks that work in GitHub Flavored Markdown. Build collapsible sections for FAQs, long code blocks, or supplementary content.",
    keywords: ["collapsible markdown", "details summary markdown", "expandable section", "markdown accordion"],
    category: "generators",
    icon: "ChevronsUpDown",
  },
  {
    slug: "contributing-generator",
    name: "CONTRIBUTING.md Generator",
    description:
      "Generate a CONTRIBUTING.md for your open source project. Free online contributing guide builder.",
    longDescription:
      "Fill in a form and generate a complete CONTRIBUTING.md with sections for how to contribute, code style, pull request process, issue reporting, and code of conduct reference.",
    keywords: ["contributing md generator", "contributing guide", "open source contributing", "contributing template"],
    category: "generators",
    icon: "Users",
  },
  // ── Analysis ──
  {
    slug: "word-counter",
    name: "Word & Character Counter",
    description:
      "Count words, characters, sentences, and reading time in Markdown. Free online Markdown-aware word counter.",
    longDescription:
      "Get accurate word, character, sentence, and paragraph counts from Markdown text. Markdown-aware: doesn't count syntax characters. Also estimates reading time.",
    keywords: ["word counter", "markdown word counter", "character counter", "reading time calculator", "word count"],
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
    keywords: ["markdown link extractor", "extract links from markdown", "markdown url extractor"],
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
    keywords: ["markdown heading extractor", "extract headings from markdown", "markdown outline"],
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
    keywords: ["markdown diff", "compare markdown", "markdown compare tool", "diff markdown files"],
    category: "analysis",
    icon: "GitCompareArrows",
  },
  {
    slug: "broken-link-checker",
    name: "Broken Link Checker",
    description:
      "Find malformed and broken links in Markdown. Free online Markdown link validator.",
    longDescription:
      "Paste Markdown and scan for malformed URLs, missing protocols, empty links, duplicate links, and improperly formatted Markdown link syntax.",
    keywords: ["broken link checker", "markdown link validator", "check markdown links", "find broken links"],
    category: "analysis",
    icon: "Unlink",
  },
  {
    slug: "readability-score",
    name: "Readability Score",
    description:
      "Calculate Flesch-Kincaid readability score for Markdown text. Free online readability analyzer.",
    longDescription:
      "Paste Markdown and get Flesch-Kincaid Reading Ease, Grade Level, and other readability metrics. Strips Markdown syntax before analysis for accurate results.",
    keywords: ["readability score", "flesch kincaid", "readability analyzer", "reading level checker"],
    category: "analysis",
    icon: "BookCheck",
  },
  {
    slug: "image-extractor",
    name: "Image Extractor",
    description:
      "Extract all image references from Markdown with alt text audit. Free online Markdown image extractor.",
    longDescription:
      "Parse Markdown and list every image reference with its URL, alt text, and title. Flags missing alt text for accessibility review. Export as CSV.",
    keywords: ["markdown image extractor", "extract images from markdown", "alt text checker", "markdown accessibility"],
    category: "analysis",
    icon: "Image",
  },
  {
    slug: "markdown-linter",
    name: "Markdown Linter",
    description:
      "Lint Markdown for common issues. Free online Markdown linter checks formatting, consistency, and best practices.",
    longDescription:
      "Paste Markdown and get instant feedback on common issues: inconsistent list markers, missing alt text, trailing spaces, inconsistent heading styles, long lines, and more.",
    keywords: ["markdown linter", "markdownlint", "lint markdown", "markdown checker", "markdown best practices"],
    category: "analysis",
    icon: "SearchCheck",
  },
  // ── Formatters ──
  {
    slug: "markdown-table-formatter",
    name: "Markdown Table Formatter",
    description:
      "Beautify and align Markdown tables. Free online Markdown table formatter and prettifier.",
    longDescription:
      "Paste a messy Markdown table and get it properly padded, aligned, and formatted. Fixes inconsistent spacing and pipe alignment.",
    keywords: ["markdown table formatter", "format markdown table", "beautify markdown table", "markdown table prettifier"],
    category: "formatters",
    icon: "AlignJustify",
  },
  {
    slug: "markdown-prettifier",
    name: "Markdown Prettifier",
    description:
      "Normalize and beautify an entire Markdown document. Free online Markdown formatter.",
    longDescription:
      "Normalize heading styles, list markers, blank lines, and spacing across an entire Markdown document. Choose ATX or Setext headings, dash or asterisk lists, and more.",
    keywords: ["markdown prettifier", "markdown beautifier", "format markdown", "normalize markdown"],
    category: "formatters",
    icon: "Sparkles",
  },
  {
    slug: "list-sorter",
    name: "List Sorter",
    description:
      "Sort Markdown bullet and numbered lists alphabetically. Free online Markdown list sorter.",
    longDescription:
      "Paste a Markdown list (bulleted or numbered) and sort items alphabetically, in reverse, or by line length. Handles nested lists and preserves indentation.",
    keywords: ["markdown list sorter", "sort markdown list", "alphabetize list", "markdown sort"],
    category: "formatters",
    icon: "ArrowUpDown",
  },
  {
    slug: "url-reference-converter",
    name: "URL Reference Converter",
    description:
      "Convert inline Markdown links to reference-style and vice versa. Free link style converter.",
    longDescription:
      "Convert all inline links [text](url) to reference-style [text][ref] with definitions at the bottom, or convert reference links back to inline. Keeps your document clean.",
    keywords: ["markdown reference links", "inline to reference", "markdown link converter", "reference style links"],
    category: "formatters",
    icon: "Replace",
  },
  // ── Utilities ──
  {
    slug: "markdown-cheat-sheet",
    name: "Markdown Cheat Sheet",
    description:
      "Interactive Markdown cheat sheet with live examples. Free Markdown syntax reference guide.",
    longDescription:
      "Complete Markdown syntax reference with live rendered examples side by side. Covers standard Markdown, GitHub Flavored Markdown, and common extensions.",
    keywords: ["markdown cheat sheet", "markdown syntax", "markdown reference", "markdown guide", "markdown help"],
    category: "utilities",
    icon: "BookMarked",
  },
  {
    slug: "regex-find-replace",
    name: "Regex Find & Replace",
    description:
      "Find and replace text in Markdown using regex. Free online regex find and replace with live preview.",
    longDescription:
      "Search your Markdown with plain text or regular expressions and replace matches with live preview. See highlighted matches before applying changes.",
    keywords: ["regex find replace", "markdown find replace", "regex search", "text find replace"],
    category: "utilities",
    icon: "Search",
  },
  {
    slug: "frontmatter-editor",
    name: "YAML Frontmatter Editor",
    description:
      "Visual editor for YAML/TOML frontmatter. Free online frontmatter builder for Jekyll, Hugo, and Astro.",
    longDescription:
      "Build and edit YAML or TOML frontmatter visually. Add fields like title, date, tags, and categories through a form, then copy the formatted frontmatter block.",
    keywords: ["frontmatter editor", "yaml frontmatter", "hugo frontmatter", "jekyll frontmatter", "astro frontmatter"],
    category: "utilities",
    icon: "Settings",
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
  "utilities",
];
