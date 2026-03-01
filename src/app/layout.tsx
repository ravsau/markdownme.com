import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://markdownme.com"),
  title: {
    default: "MarkdownMe - Free Online Markdown Tools",
    template: "%s | MarkdownMe",
  },
  description:
    "Free online Markdown tools: editor, converters, table generator, word counter, and more. No signup, no AI, no data uploaded. Everything runs in your browser.",
  keywords: [
    "markdown tools",
    "markdown editor",
    "markdown converter",
    "markdown to html",
    "html to markdown",
    "markdown table generator",
    "online markdown tools",
    "free markdown tools",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://markdownme.com",
    siteName: "MarkdownMe",
    title: "MarkdownMe - Free Online Markdown Tools",
    description:
      "Free online Markdown tools: editor, converters, table generator, word counter, and more. No signup required.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MarkdownMe - Free Online Markdown Tools",
    description:
      "Free online Markdown tools: editor, converters, table generator, word counter, and more.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-CKZTR4DJ2W"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-CKZTR4DJ2W');`}
      </Script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
