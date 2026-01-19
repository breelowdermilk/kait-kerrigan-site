# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio site for Kait Kerrigan (Bookwriter, Lyricist, Playwright). Built on AstroWind template with custom theming.

## Commands

```bash
npm run dev          # Dev server at localhost:4321
npm run build        # Production build to ./dist/
npm run preview      # Preview production build
npm run check        # Run astro check + eslint + prettier
npm run fix          # Auto-fix eslint + prettier issues
```

## Architecture

### Tech Stack
- **Astro 5** with static output mode
- **Tailwind CSS** with custom Kait theme
- **MDX** for blog content
- **astro-icon** with Tabler icons
- **astro-compress** for production optimization

### Key Files
- `src/config.yaml` - Site metadata, SEO, blog settings, theme mode (currently `light:only`)
- `src/navigation.ts` - Header and footer link definitions
- `astro.config.ts` - Astro integrations, markdown plugins, Vite aliases (`~` → `./src`)

### Directory Structure
```
src/
├── assets/styles/kait-theme.css  # Custom warm gold/charcoal theme
├── components/
│   ├── widgets/       # Page sections (Hero, Header, Footer, etc.)
│   ├── media/         # Video/audio players, galleries
│   ├── ui/            # Reusable UI primitives
│   └── blog/          # Blog-specific components
├── data/media/        # Media content data (albums, videos, streaming links)
├── layouts/           # Page layouts (Layout, PageLayout, MarkdownLayout)
├── pages/             # Routes: index, about, work, songs, media, contact
└── utils/             # Permalink generation, blog helpers, image processing
```

### Media Data System
The `src/data/media/` directory contains typed data structures for:
- **albums.ts** - Spotify album embeds with streaming platform links
- **videoGallery.ts** - Videos organized by category (Greatest Hits, Broadway, Live, etc.)
- **streamingLinks.ts** - Multi-platform streaming links per song
- **index.ts** - Central exports and search utilities

### Custom Theme (kait-theme.css)
Warm editorial palette derived from hero photo:
- **Gold primary**: `#c9a227` (titles, accents, buttons)
- **Charcoal**: `#3d3632` (body text)
- **Display font**: Cormorant Garamond
- **Body font**: Libre Baskerville
- **UI font**: DM Sans

### Shows System
Shows use Astro content collections from `src/content/shows/*.mdx`.

**Frontmatter structure:**
```yaml
title: "Show Name"
status: "development" | "licensed" | "archived" | "touring"
heroImage: "/images/shows/show-name.jpg"
synopsis: "Short description"
credits:
  - "Book by Kait Kerrigan"
  - "Music by Composer Name"
pressQuotes:
  - quote: "Review text"
    outlet: "Publication"
    date: "2024-01-01"
```

**Display order** is controlled by the `showOrder` array in `src/pages/shows/index.astro` — shows not in this array won't display.

**Images** go in `public/images/shows/` and are referenced as `/images/shows/filename.jpg`.

**GLightbox** powers the inline modals on the shows page.

### Vendor Integration
`vendor/` contains a custom AstroWind integration that loads `src/config.yaml` at build time.
