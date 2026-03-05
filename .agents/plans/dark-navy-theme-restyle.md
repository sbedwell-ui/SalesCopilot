# Feature: Dark Navy Corporate Theme Restyle

The following plan should be complete, but it's important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Restyle the SalesCopilot testing checklist app from its current light corporate SaaS theme (white backgrounds, gray borders, blue accents) to a dark corporate navy theme matching the MCIEligibilityValidator app (deep navy backgrounds, cyan accents, light text). No functionality changes — purely visual transformation using the same Tailwind CSS framework.

## User Story

As a test team member
I want the SalesCopilot app to use the same dark navy corporate theme as our other Data#3 tools
So that the visual experience is consistent across our toolset

## Problem Statement

The SalesCopilot app uses a default light theme that visually differs from the MCIEligibilityValidator and other Data#3-branded tools. This creates an inconsistent user experience across the toolset.

## Solution Statement

Systematically replace all Tailwind color utility classes across 14 files with dark navy theme equivalents using a custom `data3` color namespace in the Tailwind config. Add custom scrollbar styling and font family to match the target app.

## Feature Metadata

**Feature Type**: Enhancement (Visual Restyle)
**Estimated Complexity**: Medium
**Primary Systems Affected**: All frontend components and pages (React/Tailwind)
**Dependencies**: None new — uses existing Tailwind CSS

---

## CONTEXT REFERENCES

### Relevant Codebase Files — IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

**Configuration & Global:**
- `tailwind.config.js` — Current Tailwind theme config with category colors; ADD data3 namespace + font
- `src/index.css` — Currently just Tailwind directives; ADD CSS variables, scrollbar, form accent
- `index.html` — Body tag classes `bg-gray-50 text-gray-900`; CHANGE to data3 equivalents

**Shared Components (update first — used by all pages):**
- `src/components/Layout.tsx` — Main layout with sidebar navigation; heaviest change (sidebar bg, nav states, border, export button)
- `src/components/StatusBadge.tsx` — Pass/fail/blocked/untested badges used everywhere
- `src/components/ProgressBar.tsx` — Colored progress bar track and segments
- `src/components/TestCard.tsx` — Card used in CategoryView for each test case
- `src/components/TesterPicker.tsx` — Select dropdown for tester selection
- `src/components/PageThumbnail.tsx` — PDF page thumbnail with hover border
- `src/components/ImageLightbox.tsx` — Full-screen image viewer overlay

**Pages (update after components):**
- `src/pages/Dashboard.tsx` — Stats cards, progress, category list, recent activity, tester stats
- `src/pages/CategoryView.tsx` — Category header, controls bar, bulk assign, test card list
- `src/pages/TestDetail.tsx` — Most complex page: user story box, CRM notes, assignment, steps, form controls, status buttons, result history
- `src/pages/Testers.tsx` — Tester list, add form, remove modal with confirmation dialog
- `src/pages/AuditLog.tsx` — Table with header, rows, pagination

### Target Theme Reference (MCIEligibilityValidator)

**Tailwind config colors (`data3` namespace):**
```js
data3: {
  background: '#002061',       // Deep navy — body/page background
  surface: '#0a3080',          // Dark blue — card/panel background
  'surface-light': '#1a4a9f',  // Medium blue — hover states, input backgrounds
  accent: '#6dcff6',           // Bright cyan — primary action, links, focus rings
  button: '#32373c',           // Dark gray — legacy button bg (rarely used)
  text: '#ffffff',             // White — primary text
  'text-muted': '#b0c4de',    // Light blue-gray — secondary/muted text
  border: '#1a4090',           // Dark blue — all borders
}
```

**CSS Variables:**
```css
:root {
  --background: 218 100% 19%;
  --foreground: 0 0% 100%;
  --border: 218 50% 33%;
}
```

**Font Family:**
```js
fontFamily: {
  sans: ['Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'sans-serif'],
}
```

**Scrollbar:**
```css
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: #0a3080; }
::-webkit-scrollbar-thumb { background: #6dcff6; border-radius: 5px; }
::-webkit-scrollbar-thumb:hover { background: #8dd8f8; }
```

### Patterns to Follow

**MCIEligibilityValidator component patterns (exact classes to replicate):**

| Element | Classes |
|---------|---------|
| Page background | `bg-data3-background` |
| Card/panel | `bg-data3-surface border border-data3-border rounded-lg` |
| Card hover | `hover:border-data3-accent/40` or `hover:shadow-lg hover:shadow-data3-accent/10` |
| Primary heading | `text-2xl font-bold text-white` |
| Section heading | `text-sm font-semibold text-data3-text-muted` or `text-lg font-semibold text-white` |
| Muted text | `text-data3-text-muted` |
| Primary button | `bg-data3-accent text-white rounded-lg hover:bg-data3-accent/80 disabled:opacity-50` |
| Secondary button | `text-data3-text-muted hover:text-white transition-colors` |
| Cancel button | `border border-data3-border text-data3-text-muted hover:bg-data3-surface-light rounded-lg` |
| Input/select | `bg-data3-surface-light border border-data3-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-data3-accent` |
| Textarea | Same as input + `placeholder-data3-text-muted/50 resize-none` |
| Nav link active | `bg-data3-surface-light text-data3-accent` |
| Nav link inactive | `text-data3-text-muted hover:text-white hover:bg-data3-surface-light` |
| Table header | `bg-data3-surface border-b border-data3-border` |
| Table body | `bg-data3-surface-light divide-y divide-data3-border` |
| Table row hover | `hover:bg-data3-surface transition-colors` |
| Table cell text | `text-sm text-white` |
| Modal overlay | `fixed inset-0 z-50 bg-black bg-opacity-50` |
| Modal box | `bg-data3-surface rounded-xl shadow-2xl` |
| Modal header | `border-b border-data3-border` |
| Modal footer | `border-t border-data3-border` |
| Tab active | `border-data3-accent text-data3-accent` |
| Tab inactive | `text-data3-text-muted hover:text-white` |
| Pagination button | `border border-data3-border rounded-md hover:bg-data3-surface text-white disabled:opacity-50` |
| Success indicator | `bg-green-900/30 text-green-400 border-green-500/50` |
| Error indicator | `bg-red-900/30 text-red-400 border-red-500/50` |
| Warning indicator | `bg-yellow-900/30 text-yellow-400 border-yellow-500/50` |

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation (Config + Global CSS)

Set up the data3 color tokens, font, CSS variables, and scrollbar. Everything else depends on these being defined first.

**Tasks:**
- Extend tailwind.config.js with data3 colors and font family
- Add CSS variables, scrollbar, and form accent to index.css
- Update index.html body classes

### Phase 2: Shared Components

Update all reusable components. These are imported by multiple pages, so changing them first gives maximum visual impact.

**Tasks:**
- Layout.tsx (sidebar, nav, export)
- StatusBadge.tsx (pass/fail/blocked/untested)
- ProgressBar.tsx (track and segment colors)
- TestCard.tsx (card appearance)
- TesterPicker.tsx (select control)
- PageThumbnail.tsx (thumbnail borders)
- ImageLightbox.tsx (overlay styling)

### Phase 3: Pages

Update each page's page-level styling (headings, cards, sections, forms, tables).

**Tasks:**
- Dashboard.tsx
- CategoryView.tsx
- TestDetail.tsx (most complex)
- Testers.tsx (includes modal)
- AuditLog.tsx (table + pagination)

### Phase 4: Verification

Visual check of all pages and interactive states.

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

---

### Task 1: UPDATE `tailwind.config.js`

**IMPLEMENT**: Add `data3` color namespace and font family to theme.extend. Keep existing `cat-*` category colors.

**REPLACE** the full file content with:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cat-productivity': '#3B82F6',
        'cat-interactions': '#06B6D4',
        'cat-flow': '#F59E0B',
        'cat-administration': '#EF4444',
        'cat-monitoring': '#8B5CF6',
        data3: {
          background: '#002061',
          surface: '#0a3080',
          'surface-light': '#1a4a9f',
          accent: '#6dcff6',
          button: '#32373c',
          text: '#ffffff',
          'text-muted': '#b0c4de',
          border: '#1a4090',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

**VALIDATE**: Run `npx tailwindcss --help` to confirm Tailwind can parse config. Then `npm run dev` — app should still load (no visual changes yet since classes aren't used).

---

### Task 2: UPDATE `src/index.css`

**IMPLEMENT**: Replace minimal Tailwind directives with full dark theme globals.

**REPLACE** entire file with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 218 100% 19%;
  --foreground: 0 0% 100%;
  --border: 218 50% 33%;
}

body {
  color: hsl(var(--foreground));
  background: hsl(var(--background));
}

/* Form control accent for checkboxes and radios */
input[type="checkbox"],
input[type="radio"] {
  accent-color: #6dcff6;
}

/* Dark placeholder text */
::placeholder {
  color: #b0c4de80;
}

/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #0a3080;
}

::-webkit-scrollbar-thumb {
  background: #6dcff6;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #8dd8f8;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

**VALIDATE**: `npm run dev` — scrollbars should appear cyan on navy when scrolling content.

---

### Task 3: UPDATE `index.html`

**IMPLEMENT**: Change body classes from light to dark theme.

**CHANGE**: `class="bg-gray-50 text-gray-900 antialiased"` → `class="bg-data3-background text-data3-text antialiased"`

**VALIDATE**: Page background should now be deep navy (#002061).

---

### Task 4: ADD logo file to `public/`

**IMPLEMENT**: Copy `salescopilotlogo.png` into the `public/` directory so it can be referenced as `/salescopilotlogo.png` from Layout.tsx.

**NOTE**: The user must provide the `salescopilotlogo.png` file. If it doesn't exist yet, create a placeholder reference and the user can drop the file in later. The MCIEligibilityValidator uses a similar pattern: `<img src="/data3-logo.png" alt="Data#3" className="h-8" />` in the header area.

**VALIDATE**: Confirm `public/salescopilotlogo.png` exists (or is expected to be added by user).

---

### Task 5: UPDATE `src/components/Layout.tsx`

**IMPLEMENT**: Retheme entire sidebar, navigation, and export button. This is the visual frame of the app. **Add the `salescopilotlogo.png` logo to the sidebar header** (top-left), replacing or augmenting the current text-only header.

**Logo addition**: In the sidebar header `<div className="p-4 border-b ...">`, add an `<img>` tag:
```tsx
<img src="/salescopilotlogo.png" alt="Copilot for Sales" className="h-8" />
```
Place it above or alongside the existing `<h1>` and subtitle text. Follow the MCIEligibilityValidator pattern where the logo sits in the header bar. The logo should be the visual anchor of the sidebar — visible at all times.

**Color mapping for this file:**

| Current | Target |
|---------|--------|
| `bg-gray-50` (outer flex) | `bg-data3-background` |
| `bg-white` (sidebar aside) | `bg-data3-surface` |
| `border-r border-gray-200` | `border-r border-data3-border` |
| `text-lg font-bold text-gray-900` (h1) | `text-lg font-bold text-white` |
| `text-xs text-gray-500` (subtitle) | `text-xs text-data3-text-muted` |
| `border-b border-gray-200` (header divider) | `border-b border-data3-border` |
| Nav active: `bg-blue-50 text-blue-700` | `bg-data3-surface-light text-data3-accent` |
| Nav inactive: `text-gray-600 hover:bg-gray-100 hover:text-gray-900` | `text-data3-text-muted hover:bg-data3-surface-light hover:text-white` |
| `text-xs font-semibold text-gray-400` (categories heading) | `text-xs font-semibold text-data3-text-muted` |
| `text-xs text-gray-400` (category stats) | `text-xs text-data3-text-muted` |
| `border-t border-gray-200` (export divider) | `border-t border-data3-border` |
| Export button: `text-gray-600 hover:bg-gray-100 hover:text-gray-900` | `text-data3-text-muted hover:bg-data3-surface-light hover:text-white` |

**VALIDATE**: Sidebar should be dark navy with the Sales Copilot logo in the top-left and cyan active state on current nav item.

---

### Task 6: UPDATE `src/components/StatusBadge.tsx`

**IMPLEMENT**: Update badge colors for dark background readability.

**Color mapping:**

| Status | Current | Target |
|--------|---------|--------|
| pass | `bg-green-100 text-green-700` | `bg-green-900/30 text-green-400` |
| fail | `bg-red-100 text-red-700` | `bg-red-900/30 text-red-400` |
| blocked | `bg-yellow-100 text-yellow-700` | `bg-yellow-900/30 text-yellow-400` |
| untested | `bg-gray-100 text-gray-500` | `bg-data3-surface-light text-data3-text-muted` |

Keep: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium`

**VALIDATE**: Navigate to any page showing badges — colors should be translucent on dark background.

---

### Task 7: UPDATE `src/components/ProgressBar.tsx`

**IMPLEMENT**: Dark track and adjusted segment visibility.

**Color mapping:**

| Element | Current | Target |
|---------|---------|--------|
| Track bg | `bg-gray-200` | `bg-data3-surface-light` |
| Pass segment | `bg-green-500` | `bg-green-500` (keep — visible on dark) |
| Fail segment | `bg-red-500` | `bg-red-500` (keep) |
| Blocked segment | `bg-yellow-500` | `bg-yellow-500` (keep) |
| Untested dots | `bg-gray-300` | `bg-data3-text-muted/30` |
| Label text colors | `text-green-600`, `text-red-600`, `text-yellow-600`, `text-gray-400` | `text-green-400`, `text-red-400`, `text-yellow-400`, `text-data3-text-muted` |

**VALIDATE**: Dashboard progress bars should show colored segments on dark blue track.

---

### Task 8: UPDATE `src/components/TestCard.tsx`

**IMPLEMENT**: Dark card appearance.

**Color mapping:**

| Element | Current | Target |
|---------|---------|--------|
| Card container | `bg-white border border-gray-200 hover:border-gray-300` | `bg-data3-surface border border-data3-border hover:border-data3-accent/40` |
| Title text | `text-gray-900` (implied) | `text-white` |
| Persona text | `text-gray-500` | `text-data3-text-muted` |
| Page ref text | `text-gray-400` | `text-data3-text-muted` |
| Assignee text | `text-gray-500` | `text-data3-text-muted` |

**VALIDATE**: Category page should show dark cards with visible text.

---

### Task 9: UPDATE `src/components/TesterPicker.tsx`

**IMPLEMENT**: Dark select control.

**CHANGE**: `block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500`

**TO**: `block w-full rounded-md bg-data3-surface-light border-data3-border text-white text-sm focus:border-data3-accent focus:ring-data3-accent`

Also update option text if visible — ensure `<option>` elements are readable. May need to add `bg-data3-surface-light` to the select element so dropdown options inherit dark background.

**VALIDATE**: Tester picker dropdowns should show white text on dark blue background.

---

### Task 10: UPDATE `src/components/PageThumbnail.tsx`

**IMPLEMENT**: Dark borders and hover accent.

**Color mapping:**

| Element | Current | Target |
|---------|---------|--------|
| Border | `border-2 border-gray-200` | `border-2 border-data3-border` |
| Hover border | `group-hover:border-blue-400` | `group-hover:border-data3-accent` |
| Focus border | `group-focus:border-blue-400` | `group-focus:border-data3-accent` |
| Label text | `text-xs text-gray-500` | `text-xs text-data3-text-muted` |
| Label hover | `group-hover:text-blue-600` | `group-hover:text-data3-accent` |

**VALIDATE**: Test detail page thumbnails should have dark borders with cyan hover.

---

### Task 11: UPDATE `src/components/ImageLightbox.tsx`

**IMPLEMENT**: Minimal changes — overlay is already dark. Just update button/text styling.

**Color mapping:**

| Element | Current | Target |
|---------|---------|--------|
| Overlay | `bg-black/70` | `bg-black/70` (keep) |
| Text | `text-white/80` | `text-white/80` (keep) |
| Hover text | `hover:text-white` | `hover:text-white` (keep) |
| Download link colors | keep as-is | keep as-is |

**Note**: This component is already essentially dark-themed. May only need minor tweaks if any text references gray colors.

**VALIDATE**: Open lightbox on test detail page — should look the same.

---

### Task 12: UPDATE `src/pages/Dashboard.tsx`

**IMPLEMENT**: Dark stat cards, section panels, and text.

**Color mapping:**

| Element | Current | Target |
|---------|---------|--------|
| Page heading | `text-2xl font-bold text-gray-900` | `text-2xl font-bold text-white` |
| Subtitle | `text-sm text-gray-500` | `text-sm text-data3-text-muted` |
| Stat cards | `bg-white rounded-lg border border-gray-200` | `bg-data3-surface rounded-lg border border-data3-border` |
| Stat label | `text-xs font-medium text-gray-500 uppercase tracking-wider` | `text-xs font-medium text-data3-text-muted uppercase tracking-wider` |
| Stat value `text-gray-900` | `text-white` |
| Stat value `text-green-600` | `text-green-400` |
| Stat value `text-red-600` | `text-red-400` |
| Stat value `text-yellow-600` | `text-yellow-400` |
| Stat value `text-gray-400` (untested) | `text-data3-text-muted` |
| Overall progress panel | `bg-white rounded-lg border border-gray-200` | `bg-data3-surface rounded-lg border border-data3-border` |
| Progress label | `text-sm font-medium text-gray-700` | `text-sm font-medium text-data3-text-muted` |
| Progress percentage | `text-sm font-bold text-gray-900` | `text-sm font-bold text-white` |
| Categories panel | `bg-white rounded-lg border border-gray-200` | `bg-data3-surface rounded-lg border border-data3-border` |
| Section heading | `text-sm font-semibold text-gray-700` | `text-sm font-semibold text-data3-text-muted` |
| Category link hover | `hover:bg-gray-50` | `hover:bg-data3-surface-light` |
| Category name | `text-sm font-medium text-gray-900` | `text-sm font-medium text-white` |
| Category stats | `text-xs text-gray-500` | `text-xs text-data3-text-muted` |
| Recent activity panel | same card pattern | same dark card |
| No results text | `text-sm text-gray-400` | `text-sm text-data3-text-muted` |
| Activity item text | `text-gray-700` | `text-white` |
| Activity link hover | `hover:text-blue-600` | `hover:text-data3-accent` |
| Activity meta | `text-xs text-gray-400` | `text-xs text-data3-text-muted` |
| Tester name | `text-gray-700 font-medium` | `text-white font-medium` |
| Tester stats | `text-xs text-gray-500` | `text-xs text-data3-text-muted` |
| Tester pass count | `text-green-600` | `text-green-400` |
| Tester fail count | `text-red-600` | `text-red-400` |

**VALIDATE**: Dashboard should be fully dark with readable stats and colored progress bars.

---

### Task 13: UPDATE `src/pages/CategoryView.tsx`

**IMPLEMENT**: Dark header, controls, and card list area.

**Color mapping:**

| Element | Current | Target |
|---------|---------|--------|
| Page heading | `text-2xl font-bold text-gray-900` | `text-2xl font-bold text-white` |
| Description text | `text-sm text-gray-500` | `text-sm text-data3-text-muted` |
| Select all checkbox label | `text-gray-500` | `text-data3-text-muted` |
| Bulk assign button | `border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600` | `border border-data3-border rounded-lg hover:bg-data3-surface-light text-data3-text-muted` |
| Assign button (blue) | `bg-blue-600 text-white hover:bg-blue-700` | `bg-data3-accent text-white hover:bg-data3-accent/80` |
| Checkbox | `text-blue-600 focus:ring-blue-500` | Handled by CSS accent-color in index.css |

**VALIDATE**: Category page should show dark background with cards and working bulk assign.

---

### Task 14: UPDATE `src/pages/TestDetail.tsx`

**IMPLEMENT**: This is the most complex page — user story box, CRM notes, assignment, steps, form, status buttons, result history.

**Color mapping:**

| Element | Current | Target |
|---------|---------|--------|
| Back link | `text-gray-500 hover:text-gray-700` | `text-data3-text-muted hover:text-white` |
| Title | `text-xl font-bold text-gray-900` | `text-xl font-bold text-white` |
| Meta text | `text-sm text-gray-500` | `text-sm text-data3-text-muted` |
| **User Story box** | `bg-blue-50 border border-blue-200` | `bg-data3-surface-light border border-data3-border` |
| User Story heading | `text-sm font-medium text-blue-700` | `text-sm font-medium text-data3-accent` |
| User Story text | `text-sm text-blue-900` | `text-sm text-white` |
| **Reference Pages panel** | `bg-white border border-gray-200` | `bg-data3-surface border border-data3-border` |
| Section heading | `text-sm font-medium text-gray-700` | `text-sm font-medium text-data3-text-muted` |
| **Assignment panel** | `bg-white border border-gray-200` | `bg-data3-surface border border-data3-border` |
| Assignee name | `text-sm text-gray-900 font-medium` | `text-sm text-white font-medium` |
| Unassigned text | `text-sm text-gray-400` | `text-sm text-data3-text-muted` |
| **Prerequisites panel** | `bg-white border border-gray-200` | `bg-data3-surface border border-data3-border` |
| Prereq heading | `text-sm font-medium text-gray-700` | `text-sm font-medium text-data3-text-muted` |
| Prereq items | `text-sm text-gray-600` | `text-sm text-data3-text-muted` |
| **Test Steps panel** | `bg-white border border-gray-200` | `bg-data3-surface border border-data3-border` |
| Steps heading | `text-sm font-medium text-gray-700` | `text-sm font-medium text-data3-text-muted` |
| Step items | `text-sm text-gray-600` | `text-sm text-data3-text-muted` |
| **CRM Notes box** | `bg-amber-50 border border-amber-200` | `bg-amber-900/20 border border-amber-500/30` |
| CRM heading | `text-sm font-medium text-amber-700` | `text-sm font-medium text-amber-400` |
| CRM text | `text-sm text-amber-900` | `text-sm text-amber-200` |
| **Record Result panel** | `bg-white border border-gray-200` | `bg-data3-surface border border-data3-border` |
| Form heading | `text-sm font-semibold text-gray-700` | `text-sm font-semibold text-data3-text-muted` |
| Label | `text-xs font-medium text-gray-500` | `text-xs font-medium text-data3-text-muted` |
| **Status buttons — unselected** | `border-gray-300 text-gray-600 hover:bg-gray-50` | `border-data3-border text-data3-text-muted hover:bg-data3-surface-light` |
| **Status btn — pass selected** | `bg-green-100 border-green-300 text-green-700` | `bg-green-900/30 border-green-500/50 text-green-400` |
| **Status btn — fail selected** | `bg-red-100 border-red-300 text-red-700` | `bg-red-900/30 border-red-500/50 text-red-400` |
| **Status btn — blocked selected** | `bg-yellow-100 border-yellow-300 text-yellow-700` | `bg-yellow-900/30 border-yellow-500/50 text-yellow-400` |
| Textarea | `border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500` | `bg-data3-surface-light border-data3-border text-white focus:border-data3-accent focus:ring-data3-accent` |
| Submit button | `bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50` | `bg-data3-accent text-white hover:bg-data3-accent/80 disabled:opacity-50` |
| **Result History panel** | `bg-white border border-gray-200` | `bg-data3-surface border border-data3-border` |
| History heading | `text-sm font-semibold text-gray-700` | `text-sm font-semibold text-data3-text-muted` |
| Tester name | `text-gray-700 font-medium` | `text-white font-medium` |
| Notes text | `text-gray-500` | `text-data3-text-muted` |
| Timestamp | `text-xs text-gray-400` | `text-xs text-data3-text-muted` |
| Row border | `border-b border-gray-100` | `border-b border-data3-border` |

**VALIDATE**: Test detail page should be fully dark with all sections readable. Test status button selection and form submission.

---

### Task 15: UPDATE `src/pages/Testers.tsx`

**IMPLEMENT**: Dark cards, add form, remove modal.

**Color mapping:**

| Element | Current | Target |
|---------|---------|--------|
| Page heading | `text-2xl font-bold text-gray-900` | `text-2xl font-bold text-white` |
| Add button | `bg-blue-600 text-white hover:bg-blue-700` | `bg-data3-accent text-white hover:bg-data3-accent/80` |
| **Add form panel** | `bg-white border border-gray-200` | `bg-data3-surface border border-data3-border` |
| Form labels | `text-xs font-medium text-gray-500` | `text-xs font-medium text-data3-text-muted` |
| Form inputs | `border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500` | `bg-data3-surface-light border-data3-border text-white focus:border-data3-accent focus:ring-data3-accent` |
| Create button | `bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50` | `bg-data3-accent text-white hover:bg-data3-accent/80 disabled:opacity-50` |
| Cancel button | `border border-gray-300 hover:bg-gray-50 text-gray-600` | `border border-data3-border hover:bg-data3-surface-light text-data3-text-muted` |
| Error text | `text-sm text-red-600` | `text-sm text-red-400` |
| **Active tester card** | `bg-white border border-gray-200` | `bg-data3-surface border border-data3-border` |
| Tester name | `text-sm font-medium text-gray-900` | `text-sm font-medium text-white` |
| Tester meta | `text-xs text-gray-500` | `text-xs text-data3-text-muted` |
| Remove button | `text-red-600 bg-red-50 hover:bg-red-100` | `text-red-400 bg-red-900/30 hover:bg-red-900/50` |
| **Inactive section heading** | `text-sm font-semibold text-gray-400` | `text-sm font-semibold text-data3-text-muted` |
| Inactive card | `bg-white border border-gray-200 opacity-60` | `bg-data3-surface border border-data3-border opacity-60` |
| Inactive name | `text-sm font-medium text-gray-400` | `text-sm font-medium text-data3-text-muted` |
| Inactive meta | `text-xs text-gray-400` | `text-xs text-data3-text-muted` |
| Re-add button | `text-green-700 bg-green-50 hover:bg-green-100` | `text-green-400 bg-green-900/30 hover:bg-green-900/50` |
| **Modal overlay** | `bg-black/50` | `bg-black/50` (keep) |
| **Modal box** | `bg-white rounded-lg shadow-xl` | `bg-data3-surface rounded-xl shadow-2xl` |
| Modal heading | `text-lg font-semibold text-gray-900` | `text-lg font-semibold text-white` |
| Modal subtext | `text-sm text-gray-500` | `text-sm text-data3-text-muted` |
| Modal body text | `text-sm text-gray-600` | `text-sm text-data3-text-muted` |
| Alert icon bg | `bg-red-100` | `bg-red-900/30` |
| Alert icon | `text-red-600` | `text-red-400` |
| Remove & Keep btn | `bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100` | `bg-yellow-900/30 border-yellow-500/50 text-yellow-400 hover:bg-yellow-900/50` |
| Remove & Clear btn | `bg-red-50 border-red-300 text-red-700 hover:bg-red-100` | `bg-red-900/30 border-red-500/50 text-red-400 hover:bg-red-900/50` |
| Cancel modal btn | `border border-gray-300 text-gray-600 hover:bg-gray-50` | `border border-data3-border text-data3-text-muted hover:bg-data3-surface-light` |

**VALIDATE**: Testers page should show dark cards. Test the add form, remove modal with both options.

---

### Task 16: UPDATE `src/pages/AuditLog.tsx`

**IMPLEMENT**: Dark table, header, rows, and pagination.

**Color mapping:**

| Element | Current | Target |
|---------|---------|--------|
| Page heading | `text-2xl font-bold text-gray-900` | `text-2xl font-bold text-white` |
| Row count | `text-sm text-gray-500` | `text-sm text-data3-text-muted` |
| Loading text | `text-gray-500` | `text-data3-text-muted` |
| No results text | `text-gray-400` | `text-data3-text-muted` |
| **Table container** | `bg-white border border-gray-200 rounded-lg overflow-hidden` | `bg-data3-surface border border-data3-border rounded-lg overflow-hidden` |
| Table header row | `border-b border-gray-200 bg-gray-50` | `border-b border-data3-border bg-data3-surface` |
| Header cells | `font-medium text-gray-500` | `font-medium text-data3-text-muted` |
| Data rows | `border-b border-gray-100 hover:bg-gray-50` | `border-b border-data3-border hover:bg-data3-surface-light` |
| Timestamp cell | `text-gray-500 text-xs whitespace-nowrap` | `text-data3-text-muted text-xs whitespace-nowrap` |
| Test link | `text-gray-800 hover:text-blue-600` | `text-white hover:text-data3-accent` |
| Tester name | `text-gray-500` | `text-data3-text-muted` |
| Category name | `text-gray-600` | `text-data3-text-muted` |
| Notes text | `text-gray-500 truncate` | `text-data3-text-muted truncate` |
| **Pagination** | `flex items-center justify-center gap-2` | keep layout |
| Page buttons | `border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50` | `border border-data3-border rounded hover:bg-data3-surface-light text-white disabled:opacity-50` |
| Active page | implicit (no special class currently) | If there's an active page indicator, use `bg-data3-accent text-white` |
| Page info text | `text-sm text-gray-500` | `text-sm text-data3-text-muted` |

**VALIDATE**: Audit log table should be dark with readable headers, rows, and working pagination.

---

## TESTING STRATEGY

### Visual Testing (Manual)

No automated tests exist in this project. All validation is visual.

1. **Dashboard** (`/`): Check stat cards, progress bars, category links, recent activity, tester stats
2. **Category page** (`/category/productivity`): Check header, controls, test cards, bulk assign
3. **Test detail** (`/test/{id}`): Check all sections — user story, reference pages, assignment, prerequisites, steps, CRM notes, result form, status buttons, result history
4. **Testers** (`/testers`): Check active/inactive lists, add form, remove modal
5. **Audit log** (`/audit`): Check table, pagination

### Edge Cases

- Empty states (no results, no testers assigned)
- Modal overlays (lightbox, tester removal dialog)
- Disabled button states
- Focus rings on form inputs
- Category dot colors (inline styles — should still work)
- Progress bar with 0% completion vs 100%
- Long text truncation in table cells

---

## VALIDATION COMMANDS

### Level 1: Build Check

```bash
npm run build
```

Must complete with zero errors. TypeScript and Vite compilation should succeed (we're only changing class strings, not logic).

### Level 2: Dev Server

```bash
npm run dev
```

Both Vite (5173) and Express (3001) should start. Visit http://localhost:5173.

### Level 3: Manual Visual Validation

Visit each route and verify:
- `http://localhost:5173/` — Dashboard
- `http://localhost:5173/category/productivity` — Category page
- `http://localhost:5173/test/{any-id}` — Test detail (click any test card)
- `http://localhost:5173/testers` — Testers management
- `http://localhost:5173/audit` — Audit log

### Level 4: Interactive State Testing

- Click sidebar nav items → active state should be cyan on dark blue
- Open tester picker dropdown → options readable on dark
- Click status buttons (pass/fail/blocked) → selected state visible
- Open image lightbox → overlay and navigation work
- Open tester removal modal → dark modal with readable buttons
- Export CSV → button hover state visible

---

## ACCEPTANCE CRITERIA

- [ ] All 15 files updated with data3 theme colors
- [ ] salescopilotlogo.png displayed in sidebar top-left
- [ ] `npm run build` completes with zero errors
- [ ] Body background is deep navy (#002061)
- [ ] Cards/panels use dark blue surface (#0a3080)
- [ ] Primary text is white, muted text is light blue-gray
- [ ] Accent color (cyan #6dcff6) used for active nav, buttons, links, focus rings
- [ ] Status badges readable on dark background (translucent colored backgrounds)
- [ ] Progress bars show colored segments on dark track
- [ ] Form inputs have dark background with white text
- [ ] Modals have dark surface background with shadow-2xl
- [ ] Custom scrollbar shows cyan thumb on dark track
- [ ] Category dot colors still display correctly (inline styles unaffected)
- [ ] All hover/focus/disabled states work properly
- [ ] Font renders as Segoe UI on Windows
- [ ] No functionality regressions — all CRUD operations still work

---

## COMPLETION CHECKLIST

- [ ] Task 1: tailwind.config.js updated with data3 colors + font
- [ ] Task 2: index.css updated with CSS variables + scrollbar + form accent
- [ ] Task 3: index.html body classes updated
- [ ] Task 4: salescopilotlogo.png added to public/
- [ ] Task 5: Layout.tsx sidebar fully dark-themed + logo in top-left
- [ ] Task 6: StatusBadge.tsx dark-safe badge colors
- [ ] Task 7: ProgressBar.tsx dark track and label colors
- [ ] Task 8: TestCard.tsx dark card styling
- [ ] Task 9: TesterPicker.tsx dark select control
- [ ] Task 10: PageThumbnail.tsx dark borders + cyan hover
- [ ] Task 11: ImageLightbox.tsx verified (minimal changes)
- [ ] Task 12: Dashboard.tsx fully dark-themed
- [ ] Task 13: CategoryView.tsx fully dark-themed
- [ ] Task 14: TestDetail.tsx fully dark-themed (most complex)
- [ ] Task 15: Testers.tsx fully dark-themed including modal
- [ ] Task 16: AuditLog.tsx dark table and pagination
- [ ] Build passes
- [ ] All pages visually verified

---

## NOTES

- **No new dependencies** required. Only Tailwind class string changes + config additions.
- **Category colors** (productivity, interactions, flow-of-work, administration, monitoring) are applied via inline `style={{ backgroundColor: cat.color }}` and remain unchanged.
- **Status semantic colors** (green/red/yellow) shift from light variants (100/700) to dark variants (900/30 + 400) for contrast on dark backgrounds.
- **Font stack** defaults to Segoe UI on Windows, San Francisco on macOS — good cross-platform coverage.
- The `cat-*` color names in tailwind.config.js are currently prefixed with `cat-` but the DB stores the raw hex values. These class names may not even be used in components (category colors come from DB `color` field via inline styles). Keep them for potential future use.
