"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface CheatSheetExample {
  syntax: string;
  description: string;
}

interface CheatSheetSection {
  title: string;
  examples: CheatSheetExample[];
}

const sections: CheatSheetSection[] = [
  {
    title: "Basic Syntax",
    examples: [
      { syntax: "# Heading 1\n## Heading 2\n### Heading 3", description: "Headings" },
      { syntax: "This is a paragraph.\n\nThis is another paragraph.", description: "Paragraphs" },
      { syntax: "Line one  \nLine two (two spaces at end)", description: "Line breaks" },
      { syntax: "**bold text**", description: "Bold" },
      { syntax: "*italic text*", description: "Italic" },
      { syntax: "***bold and italic***", description: "Bold + Italic" },
    ],
  },
  {
    title: "Links & Images",
    examples: [
      { syntax: "[Link text](https://example.com)", description: "Inline link" },
      {
        syntax: '[Link text][1]\n\n[1]: https://example.com "Example"',
        description: "Reference link",
      },
      { syntax: "![Alt text](https://via.placeholder.com/100x50)", description: "Image" },
      {
        syntax: "[![Alt](https://via.placeholder.com/100x50)](https://example.com)",
        description: "Linked image",
      },
    ],
  },
  {
    title: "Lists",
    examples: [
      { syntax: "- Item one\n- Item two\n- Item three", description: "Unordered list" },
      { syntax: "1. First\n2. Second\n3. Third", description: "Ordered list" },
      {
        syntax: "- Parent\n  - Child\n    - Grandchild",
        description: "Nested list",
      },
      {
        syntax: "- [x] Done task\n- [ ] Pending task\n- [ ] Another task",
        description: "Task list",
      },
    ],
  },
  {
    title: "Code",
    examples: [
      { syntax: "Use `inline code` in text.", description: "Inline code" },
      {
        syntax: "```\nfunction hello() {\n  return 'world';\n}\n```",
        description: "Fenced code block",
      },
      {
        syntax: '```javascript\nconst x = 42;\nconsole.log("hello");\n```',
        description: "Syntax highlighting",
      },
    ],
  },
  {
    title: "Blockquotes",
    examples: [
      { syntax: "> This is a blockquote.", description: "Single blockquote" },
      {
        syntax: "> Outer quote\n>> Nested quote",
        description: "Nested blockquote",
      },
    ],
  },
  {
    title: "Tables",
    examples: [
      {
        syntax:
          "| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |",
        description: "Basic table",
      },
      {
        syntax:
          "| Left | Center | Right |\n| :--- | :----: | ----: |\n| L    |   C    |     R |",
        description: "Column alignment",
      },
    ],
  },
  {
    title: "Horizontal Rule",
    examples: [
      { syntax: "---", description: "Horizontal rule (also *** or ___)" },
    ],
  },
  {
    title: "Strikethrough",
    examples: [
      { syntax: "~~deleted text~~", description: "Strikethrough" },
    ],
  },
  {
    title: "Footnotes",
    examples: [
      {
        syntax: "Here is a footnote[^1].\n\n[^1]: This is the footnote content.",
        description: "Footnote",
      },
    ],
  },
  {
    title: "Details / Summary",
    examples: [
      {
        syntax:
          "<details>\n<summary>Click to expand</summary>\n\nHidden content here.\n\n</details>",
        description: "Collapsible section",
      },
    ],
  },
];

export default function MarkdownCheatSheet() {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div
          key={section.title}
          className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900"
        >
          <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
            {section.title}
          </h3>

          <div className="space-y-4">
            {section.examples.map((example, idx) => (
              <div key={idx} className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {example.description}
                </p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Syntax */}
                  <div>
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      Syntax
                    </span>
                    <pre className="overflow-x-auto rounded bg-gray-50 p-3 font-mono text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      {example.syntax}
                    </pre>
                  </div>

                  {/* Rendered Preview */}
                  <div>
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      Rendered Preview
                    </span>
                    <div className="prose prose-sm dark:prose-invert max-w-none rounded bg-gray-50 p-3 dark:bg-gray-800">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {example.syntax}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
