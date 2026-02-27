import Link from "next/link";
import type { Tool } from "@/lib/tools";
import { tools } from "@/lib/tools";

interface ToolLayoutProps {
  tool: Tool;
  children: React.ReactNode;
}

export function ToolLayout({ tool, children }: ToolLayoutProps) {
  const related = tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{tool.name}</span>
      </nav>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          {tool.name}
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          {tool.longDescription}
        </p>
      </div>

      {/* Tool */}
      <div className="mb-12">{children}</div>

      {/* Related Tools */}
      {related.length > 0 && (
        <div className="border-t border-gray-200 pt-10 dark:border-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Related Tools
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-700 dark:hover:border-indigo-600 dark:hover:bg-gray-800"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">{t.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                  {t.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-10 border-t border-gray-200 pt-10 dark:border-gray-800">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
          About {tool.name}
        </h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {tool.description} This tool runs entirely in your browser — no data is sent
          to any server. Your content stays private and secure. MarkdownMe provides free,
          fast, and reliable Markdown tools for developers, writers, and anyone who works
          with Markdown.
        </p>
      </div>
    </div>
  );
}
