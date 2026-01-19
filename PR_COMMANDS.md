# Git Commands for Shows Pages PR

## Step 1: Create branch and commit
```bash
cd /Users/breelowdermilk/Development/bree-lowdermilk-site/site
git checkout main
git checkout -b feat/shows-pages
git add src/pages/shows/
git commit -m "fix(shows): image fallbacks + build green"
```

## Step 2: Create PR
```bash
git push -u origin feat/shows-pages
# Then create PR with title: "fix(shows): image fallbacks + build green"
```

## PR Title
fix(shows): image fallbacks + build green

## PR Body
Summary
– Shows list and detail pages implemented
– Fallback image import added to prevent broken thumbnails
– Remote images updated with static imports for proper fallback handling
– Fixes previous MissingImageDimension build error
– Added line-clamp for synopsis excerpts to prevent layout shift

## Implementation Details
- Static fallback image: `import defaultImg from '~/assets/images/default.jpg'`
- Fallback logic: `const imageUrl = show.data.heroImage || defaultImg`
- Runtime fallback: `onError={`this.src='${defaultImg}'`}`
- Layout stability: `line-clamp-3` class on synopsis excerpts
- Responsive gallery grid with hover effects and lazy loading

## Files Changed
- `src/pages/shows/index.astro` - Shows list page with cards and fallback handling
- `src/pages/shows/[slug].astro` - Show detail page with hero image and fallback handling

Acceptance checklist
– [x] Build passes (no MissingImageDimension)
– [x] /shows list and /shows/[slug] render without broken images  
– [x] Fallback image works if heroImage is missing
– [x] Only index.astro and [slug].astro changed
– [x] Synopsis excerpts prevent layout shift with line-clamp

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>