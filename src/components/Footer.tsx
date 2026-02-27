import Link from "next/link";
import { tools, categories, categoryLabels, getToolsByCategory } from "@/lib/tools";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {categories.map((cat) => (
            <div key={cat}>
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                {categoryLabels[cat]}
              </h3>
              <ul className="space-y-2">
                {getToolsByCategory(cat).map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-gray-200 pt-8 dark:border-gray-800">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Free online Markdown tools. No signup required. All processing happens
              in your browser.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              &copy; {new Date().getFullYear()} MarkdownMe.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
