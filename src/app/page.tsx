import Link from "next/link";
import {
  tools,
  categories,
  categoryLabels,
  categoryDescriptions,
  getToolsByCategory,
} from "@/lib/tools";
import {
  FileEdit, FileCode, FileText, Table, Braces, Type, Grid3x3, List,
  BookOpen, Hash, LetterText, Link as LinkIcon, Heading, GitCompareArrows,
  AlignJustify, FileDown, ArrowRight, MessageSquare, Code, GraduationCap,
  Ticket, Award, ClipboardList, Scale, Subscript, ChevronsUpDown, Users,
 Unlink, BookCheck, Image, SearchCheck, Sparkles, ArrowUpDown,
  Replace, BookMarked, Search, Settings, PenLine, Megaphone, Twitter, Eraser,
} from "lucide-react";
import type { Tool } from "@/lib/tools";

const iconMap: Record<string, React.ReactNode> = {
  FileEdit: <FileEdit className="h-5 w-5" />,
  FileCode: <FileCode className="h-5 w-5" />,
  FileText: <FileText className="h-5 w-5" />,
  Table: <Table className="h-5 w-5" />,
  Braces: <Braces className="h-5 w-5" />,
  Type: <Type className="h-5 w-5" />,
  Grid3x3: <Grid3x3 className="h-5 w-5" />,
  List: <List className="h-5 w-5" />,
  BookOpen: <BookOpen className="h-5 w-5" />,
  Hash: <Hash className="h-5 w-5" />,
  LetterText: <LetterText className="h-5 w-5" />,
  Link: <LinkIcon className="h-5 w-5" />,
  Heading: <Heading className="h-5 w-5" />,
  GitCompareArrows: <GitCompareArrows className="h-5 w-5" />,
  AlignJustify: <AlignJustify className="h-5 w-5" />,
  FileDown: <FileDown className="h-5 w-5" />,
  MessageSquare: <MessageSquare className="h-5 w-5" />,
  Code: <Code className="h-5 w-5" />,
  GraduationCap: <GraduationCap className="h-5 w-5" />,
  Ticket: <Ticket className="h-5 w-5" />,
  Award: <Award className="h-5 w-5" />,
  ClipboardList: <ClipboardList className="h-5 w-5" />,
  Scale: <Scale className="h-5 w-5" />,
  Subscript: <Subscript className="h-5 w-5" />,
  ChevronsUpDown: <ChevronsUpDown className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  Unlink: <Unlink className="h-5 w-5" />,
  BookCheck: <BookCheck className="h-5 w-5" />,
  Image: <Image className="h-5 w-5" />,
  SearchCheck: <SearchCheck className="h-5 w-5" />,
  Sparkles: <Sparkles className="h-5 w-5" />,
  ArrowUpDown: <ArrowUpDown className="h-5 w-5" />,
  Replace: <Replace className="h-5 w-5" />,
  BookMarked: <BookMarked className="h-5 w-5" />,
  Search: <Search className="h-5 w-5" />,
  Settings: <Settings className="h-5 w-5" />,
  PenLine: <PenLine className="h-5 w-5" />,
  Megaphone: <Megaphone className="h-5 w-5" />,
  Twitter: <Twitter className="h-5 w-5" />,
  Eraser: <Eraser className="h-5 w-5" />,
};

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex items-start gap-4 rounded-xl border border-gray-200 p-5 transition-all hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:hover:border-indigo-600"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400 dark:group-hover:bg-indigo-900">
        {iconMap[tool.icon] || <FileEdit className="h-5 w-5" />}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
          {tool.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
          {tool.longDescription}
        </p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-indigo-500 dark:text-gray-600" />
    </Link>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-indigo-50/50 to-white py-16 sm:py-24 dark:from-gray-900 dark:to-gray-950 dark:border-gray-800">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
            Free Online{" "}
            <span className="text-indigo-600">Markdown Tools</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 sm:text-xl dark:text-gray-400">
            {tools.length} free tools to edit, convert, generate, and analyze Markdown.
            No signup. No AI. Everything runs in your browser.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/tools/markdown-editor" className="tool-btn text-base px-6 py-3">
              Open Editor
            </Link>
            <Link href="#tools" className="tool-btn-secondary text-base px-6 py-3">
              Browse Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {categories.map((cat) => {
            const catTools = getToolsByCategory(cat);
            return (
              <div key={cat} className="mb-14 last:mb-0">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {categoryLabels[cat]}
                  </h2>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    {categoryDescriptions[cat]}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {catTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SEO Section */}
      <section className="border-t border-gray-200 bg-gray-50 py-16 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            Why MarkdownMe?
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">100% Browser-Based</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Every tool runs entirely in your browser. Your data never leaves your device. No server processing, no uploads, no tracking.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">No Signup Required</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use any tool instantly. No accounts, no email verification, no paywalls. Just open a tool and start working.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">GitHub Flavored Markdown</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Full support for GFM including tables, task lists, strikethrough, footnotes, and syntax-highlighted code blocks.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
