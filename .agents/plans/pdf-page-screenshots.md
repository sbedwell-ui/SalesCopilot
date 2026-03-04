# Feature: PDF Page Screenshots in Test Detail View

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Add screenshots of relevant PDF pages as clickable thumbnails into each test case's detail view. Each test case already has a `pageRef` field (e.g., `"p6-7"`) linking to pages in the source training PDF. This feature pre-extracts all 146 PDF pages as PNGs, displays relevant pages as thumbnails on TestDetail, and opens them in a custom lightbox modal with navigation and "open in new tab" functionality.

## User Story

As a QA tester,
I want to see screenshots of the relevant PDF pages alongside each test case,
So that I have visual context about the feature I'm testing without switching to the PDF document.

## Problem Statement

Testers must currently cross-reference a 146-page PDF to understand the feature context for each test case. There's no visual preview in the app — only text descriptions and a page reference string.

## Solution Statement

Pre-extract all PDF pages as PNGs served as static assets. Parse the existing `pageRef` field to map test cases to their page images. Display thumbnails in a new "Reference Pages" section on TestDetail, with a custom lightbox modal for full-size viewing.

## Feature Metadata

**Feature Type**: Enhancement
**Estimated Complexity**: Medium
**Primary Systems Affected**: TestDetail page, new components (PageThumbnail, ImageLightbox), new utility (parsePageRef), extraction script
**Dependencies**: `pdf-to-png-converter` (devDependency only)

---

## CONTEXT REFERENCES

### Relevant Codebase Files — READ BEFORE IMPLEMENTING

- `src/pages/TestDetail.tsx` — Primary integration point. New section goes between User Story (line ~102) and Assignment (line ~104). Follow the existing section card pattern (`bg-white border border-gray-200 rounded-lg p-4`) and icon+label header pattern.
- `src/components/StatusBadge.tsx` — Pattern for simple functional components: typed props interface, default export, TailwindCSS-only styling.
- `src/components/TestCard.tsx` — Shows how `ChevronRight` from lucide-react is imported (confirms lucide icons availability).
- `src/lib/types.ts` — Existing utility file location. New `parsePageRef.ts` lives alongside it.
- `src/lib/api.ts` — Existing utility file pattern reference.
- `package.json` — Add devDependency and script.
- `vite.config.ts` — Confirms Vite proxy config. No changes needed — Vite serves `public/` at root URL by default.
- `prisma/seed-data/test-cases.ts` — Contains all pageRef values for validation.

### New Files to Create

- `scripts/extract-pdf-pages.ts` — One-time PDF page extraction script
- `public/pdf-pages/` — Directory with 146 PNGs (page-001.png through page-146.png)
- `src/lib/parsePageRef.ts` — Utility to parse pageRef strings into page numbers and image URLs
- `src/components/PageThumbnail.tsx` — Clickable thumbnail component
- `src/components/ImageLightbox.tsx` — Full-screen modal with navigation

### Patterns to Follow

**Component pattern** (from StatusBadge.tsx, TestCard.tsx):
- Simple functional component with typed props interface
- Default export
- TailwindCSS for all styling, no external UI libraries
- Lucide-react for icons

**Section card pattern** (from TestDetail.tsx):
```tsx
<div className="bg-white border border-gray-200 rounded-lg p-4">
  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
    <IconName size={14} />
    Section Title
  </div>
  {/* content */}
</div>
```

**Utility file pattern** (from src/lib/):
- Pure functions, named exports
- TypeScript with explicit return types

**Import pattern**:
```tsx
import { useState } from 'react';
import { IconName } from 'lucide-react';
import { utilFunction } from '../lib/utilFile';
import ComponentName from '../components/ComponentName';
```

---

## IMPLEMENTATION PLAN

### Phase 1: Extraction Setup
- Install `pdf-to-png-converter` as devDependency
- Create extraction script
- Run extraction to generate 146 PNGs in `public/pdf-pages/`

### Phase 2: Core Components
- Create `parsePageRef` utility
- Create `PageThumbnail` component
- Create `ImageLightbox` modal component

### Phase 3: Integration
- Add "Reference Pages" section to TestDetail.tsx
- Wire up lightbox state and thumbnail click handlers

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### Task 1: INSTALL pdf-to-png-converter

- **IMPLEMENT**: Add as devDependency (only used by extraction script, not at runtime)
- **COMMAND**: `npm install --save-dev pdf-to-png-converter`
- **VALIDATE**: `npm ls pdf-to-png-converter` shows it in devDependencies

### Task 2: CREATE scripts/extract-pdf-pages.ts

- **IMPLEMENT**: One-time script that converts all 146 pages of `Copilot for Sales tip time V8.1.pdf` to PNGs in `public/pdf-pages/`
- **Naming**: `page-001.png` through `page-146.png` (zero-padded 3 digits)
- **Scale**: `viewportScale: 2.0` — produces ~1190x1684px images (sharp thumbnails, readable full-size)
- **ESM compatible**: Use `import.meta.url` for `__dirname` (project is `"type": "module"`)
- **Create `public/pdf-pages/` directory** if it doesn't exist (use `mkdirSync` with `recursive: true`)
- **IMPORTS**: `pdf-to-png-converter`, `path`, `url`, `fs`
- **GOTCHA**: The library parameter for controlling output file names may vary by version. Check the `pdf-to-png-converter` docs/types for the exact API — it may use `outputFileMaskFunc`, `outputFileMask`, or similar. Validate the actual API before writing the script.
- **GOTCHA**: If `pdf-to-png-converter` fails on Windows with canvas errors, fall back to `pdf-to-img` which has a similar API.

### Task 3: UPDATE package.json — add extract-pages script

- **IMPLEMENT**: Add `"extract-pages": "tsx scripts/extract-pdf-pages.ts"` to scripts section
- **VALIDATE**: `npm run extract-pages` executes the script

### Task 4: RUN extraction script

- **IMPLEMENT**: Execute `npm run extract-pages`
- **VALIDATE**:
  - `public/pdf-pages/` contains exactly 146 files
  - Files are named `page-001.png` through `page-146.png`
  - Spot-check a few files by opening them (should show readable PDF content)
  - Start Vite dev server and navigate to `http://localhost:5173/pdf-pages/page-001.png` — image should display (Vite serves `public/` at root URL by default, no config needed)

### Task 5: CREATE src/lib/parsePageRef.ts

- **IMPLEMENT**: Two exported pure functions:
  - `parsePageRef(pageRef: string): number[]` — Parses "p6-7" → [6, 7], "p9" → [9], "p28-30" → [28, 29, 30]
  - `pageImageUrl(pageNumber: number): string` — Converts page number to URL: `"/pdf-pages/page-006.png"`
- **Logic**: Strip leading "p", split on "-", parseInt start/end, generate range array
- **VALIDATE**: Mental check against seed data:
  - `parsePageRef("p6-7")` → `[6, 7]`
  - `parsePageRef("p94-98")` → `[94, 95, 96, 97, 98]`
  - `parsePageRef("p102")` → `[102]`
  - `pageImageUrl(6)` → `"/pdf-pages/page-006.png"`

### Task 6: CREATE src/components/PageThumbnail.tsx

- **IMPLEMENT**: Clickable thumbnail button showing a PDF page image
- **Props**: `pageNumber: number`, `imageUrl: string`, `onClick: () => void`
- **Styling**:
  - Width: `w-[120px]` (fits 5 thumbnails in the 720px content area)
  - Rounded border with hover highlight (border turns blue via `group-hover`)
  - Page number label below the image
  - `loading="lazy"` on the `<img>` for performance
- **Use `<button>`** wrapper for keyboard accessibility (focusable, Enter/Space activatable)
- **PATTERN**: Follow StatusBadge.tsx — typed props interface, default export, TailwindCSS only

### Task 7: CREATE src/components/ImageLightbox.tsx

- **IMPLEMENT**: Full-screen modal overlay for viewing PDF pages at full size
- **Props**:
  - `pages: { pageNumber: number; imageUrl: string }[]`
  - `currentIndex: number`
  - `onClose: () => void`
  - `onNavigate: (index: number) => void`
- **Features**:
  - Dark backdrop (`bg-black/70`, `fixed inset-0 z-50`)
  - Full-size image (`max-h-[80vh] max-w-full object-contain`)
  - Close: backdrop click, Escape key, X button
  - Navigate: Left/right arrow buttons (shown only when multiple pages) + keyboard arrow keys
  - "Open in new tab" link (`<a target="_blank">` pointing to image URL)
  - Page counter ("1 of 3") shown when multiple pages
  - Body scroll lock (`document.body.style.overflow = 'hidden'`) with cleanup in useEffect
- **IMPORTS**: `useEffect`, `useCallback` from react; `X`, `ChevronLeft`, `ChevronRight`, `ExternalLink` from lucide-react
- **GOTCHA**: Use `e.stopPropagation()` on inner modal content div to prevent backdrop click handler from firing when clicking the image or controls

### Task 8: UPDATE src/pages/TestDetail.tsx — integrate Reference Pages section

- **ADD imports** (top of file):
  - `FileImage` from lucide-react
  - `parsePageRef`, `pageImageUrl` from `../lib/parsePageRef`
  - `PageThumbnail` from `../components/PageThumbnail`
  - `ImageLightbox` from `../components/ImageLightbox`
- **ADD state**: `const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);` (after existing useState declarations around line 13-15)
- **ADD computed data** (after existing `const prereqs` line ~52):
  ```tsx
  const pages = testCase.pageRef
    ? parsePageRef(testCase.pageRef).map((num) => ({
        pageNumber: num,
        imageUrl: pageImageUrl(num),
      }))
    : [];
  ```
- **ADD "Reference Pages" section** in JSX between User Story and Assignment sections:
  - Conditional render: `{pages.length > 0 && ...}` (matches prereqs pattern on line 126)
  - Section card with `FileImage` icon + "Reference Pages" label
  - `flex flex-wrap gap-3` container for thumbnails
  - Each thumbnail opens lightbox: `onClick={() => setLightboxIndex(index)}`
- **ADD lightbox render** (after Reference Pages section, still inside the main container div):
  ```tsx
  {lightboxIndex !== null && (
    <ImageLightbox
      pages={pages}
      currentIndex={lightboxIndex}
      onClose={() => setLightboxIndex(null)}
      onNavigate={setLightboxIndex}
    />
  )}
  ```
- **VALIDATE**: Full end-to-end test (see Validation section below)

---

## TESTING STRATEGY

### Manual Validation (Primary — matches project's existing approach)

1. **Single-page test case**: Navigate to a test with `pageRef: "p9"` — one thumbnail, lightbox shows single image, no navigation arrows
2. **Multi-page test case**: Navigate to a test with `pageRef: "p6-7"` — two thumbnails, lightbox has left/right navigation
3. **Widest range**: Find the test with `pageRef: "p94-98"` — five thumbnails fit in one row, lightbox navigates through all 5
4. **Keyboard navigation**: Open lightbox, press ArrowLeft/ArrowRight to navigate, Escape to close
5. **Open in new tab**: Click the link — image opens in new browser tab at full resolution
6. **Scroll lock**: Open lightbox, try scrolling — background should not scroll; scrolling resumes after close

### Edge Cases

- Thumbnail `loading="lazy"` — scroll quickly to a test case at the bottom, thumbnails should load on demand
- Lightbox close — verify body scroll is restored after closing
- All 76 test cases have non-null `pageRef` — but the guard handles null defensively

---

## VALIDATION COMMANDS

### Level 1: Extraction
```bash
npm run extract-pages                    # Extract all 146 pages
ls public/pdf-pages/ | wc -l            # Should output 146
ls public/pdf-pages/page-001.png        # First page exists
ls public/pdf-pages/page-146.png        # Last page exists
```

### Level 2: Static Serving
```bash
npm run dev:client                       # Start Vite
# Navigate to http://localhost:5173/pdf-pages/page-001.png — should display image
```

### Level 3: Full Feature
```bash
npm run dev                              # Start both servers
# Navigate to http://localhost:5173
# Click any test case → TestDetail page
# Verify "Reference Pages" section appears between User Story and Assigned To
# Click thumbnail → lightbox opens
# Test keyboard nav (arrows, escape)
# Test "Open in new tab"
# Test backdrop click to close
```

---

## ACCEPTANCE CRITERIA

- [ ] All 146 PDF pages extracted as PNGs in `public/pdf-pages/`
- [ ] `parsePageRef` correctly handles all formats: single page, 2-page range, 3-page range, 5-page range
- [ ] Thumbnails display at ~120px width with hover effect in TestDetail
- [ ] Lightbox shows full-size image with dark overlay
- [ ] Lightbox supports close via: backdrop click, Escape key, X button
- [ ] Lightbox supports navigation via: arrow buttons, keyboard arrow keys (multi-page only)
- [ ] "Open in new tab" opens the image in a new browser tab
- [ ] Body scroll is locked while lightbox is open and restored on close
- [ ] Section placed between User Story and Assignment in TestDetail
- [ ] `pdf-to-png-converter` is a devDependency only (not a runtime dependency)
- [ ] Images lazy-loaded for performance

---

## COMPLETION CHECKLIST

- [ ] All 8 tasks completed in order
- [ ] Extraction script produces 146 correctly named PNGs
- [ ] Vite serves images from `public/` without config changes
- [ ] All component styling uses TailwindCSS only (no external UI libraries)
- [ ] Lightbox keyboard and mouse interactions all work
- [ ] Visual check across single-page and multi-page test cases
- [ ] App runs with `npm run dev` with no console errors

---

## NOTES

### Design Decisions
- **Pre-extraction over on-demand**: Simpler, no runtime dependency on PDF library, images committed to repo so other devs don't need tooling
- **viewportScale 2.0**: ~1190x1684px per page. Sharp enough for full-size viewing, ~100-400KB per PNG, ~20-50MB total. Scale 1.5 is a fallback if repo size is a concern.
- **Custom modal over library**: Project uses zero UI libraries. A ~70-line component is simpler than adding a dependency.
- **`null` lightbox index over separate boolean**: Single state variable for open/closed + current index is cleaner than two states.
- **TestDetail only**: Thumbnails are shown on the detail page only, not on TestCard in CategoryView, to keep the list view clean and fast.

### Potential Issues
- **Large git commit**: 146 PNGs may total 20-50MB. Acceptable for a testing tool. Git LFS is an option if it becomes a concern.
- **pdf-to-png-converter API**: Check actual API shape for output file naming — the `outputFileMaskFunc` parameter name may differ by version. Read the library types or docs before writing the script.
- **Production serving**: Express doesn't serve static files currently. `vite build` copies `public/` into `dist/`, so adding `express.static('dist')` later would serve images in production. Not blocking for dev-mode usage.
- **Arrow button positioning**: Lightbox arrows positioned outside the image (`-translate-x-12` / `translate-x-12`). On very narrow screens they may clip — keyboard navigation serves as fallback.

### pageRef Format Reference (all values in seed data)
- Single page: `p8`, `p9`, `p10`, `p11`, `p12`, `p13`, `p14`, `p15`, `p16`, `p17`, `p18`, `p19`, `p20`, `p21`, `p24`, `p25`, `p26`, `p27`, `p31`, `p32`, `p33`, `p34`, `p35`, `p36`, `p37`, `p38`, `p39`, `p40`, `p44`, `p45`, `p46`, `p47`, `p48`, `p49`, `p51`, `p52`, `p53`, `p54`, `p55`, `p56`, `p57`, `p58`, `p61`, `p62`, `p66`, `p67`, `p68`, `p70`, `p71`, `p72`, `p73`, `p77`, `p81`, `p82`, `p83`, `p84`, `p85`, `p87`, `p88`, `p89`, `p92`, `p93`, `p102`
- Two-page range: `p6-7`, `p22-23`, `p42-43`, `p59-60`, `p90-91`, `p100-101`
- Three-page range: `p28-30`, `p63-65`, `p74-76`, `p78-80`, `p100-102`
- Five-page range: `p94-98`
