# markdownme.com

## What This Project Does
Web-based markdown editor and viewer with file upload support. Renders markdown with GitHub Flavored Markdown (GFM) support and typography enhancements.

## Key Technologies
- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **react-markdown** - Markdown rendering
- **remark-gfm** - GitHub Flavored Markdown
- **react-dropzone** - File upload
- **Lucide React** - Icons

## Main Structure
```
src/
├── app/              # Next.js App Router pages
└── components/       # React components

backend/              # Backend services (if any)
public/               # Static assets

Configuration:
├── next.config.ts    # Next.js config
├── tsconfig.json     # TypeScript config
├── eslint.config.mjs # ESLint config
└── postcss.config.mjs
```

## How to Run
```bash
npm install
npm run dev      # http://localhost:3000

# Production
npm run build
npm start
```

## Features
- Markdown editing and preview
- File drag-and-drop upload
- GFM support (tables, strikethrough, etc.)
- Typography plugin for beautiful rendering
- Responsive design
