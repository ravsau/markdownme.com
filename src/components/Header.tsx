"use client";

import Link from "next/link";
import { useState } from "react";
import { tools, categories, categoryLabels, getToolsByCategory } from "@/lib/tools";
import { Menu, X, ChevronDown } from "lucide-react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="text-indigo-600">Markdown</span>
          <span className="dark:text-white">Me</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <div
            className="relative"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              Tools <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {toolsOpen && (
              <div className="absolute left-0 top-full w-[540px] rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                <div className="grid grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <div key={cat}>
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {categoryLabels[cat]}
                      </h3>
                      <ul className="space-y-1">
                        {getToolsByCategory(cat).map((tool) => (
                          <li key={tool.slug}>
                            <Link
                              href={`/tools/${tool.slug}`}
                              className="block rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
                              onClick={() => setToolsOpen(false)}
                            >
                              {tool.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link
            href="https://github.com"
            target="_blank"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            GitHub
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-gray-800"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden dark:border-gray-800 dark:bg-gray-950">
          {categories.map((cat) => (
            <div key={cat} className="mb-4">
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {categoryLabels[cat]}
              </h3>
              <ul className="space-y-0.5">
                {getToolsByCategory(cat).map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="block rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 dark:text-gray-300 dark:hover:bg-gray-800"
                      onClick={() => setMobileOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
