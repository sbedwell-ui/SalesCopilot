# Feature: Copilot for Sales Testing Checklist Web Application

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Build a local web application that serves as an interactive testing checklist for Microsoft Copilot for Sales. The app contains ~75 testable features extracted from a training PDF (V8.1), organized into 5 categories: Productivity, Interactions, Flow of Work, Administration, and Monitoring. Testers can be created, assigned to tests, log results (pass/fail/blocked/skipped), add notes, and view a full audit trail. The app uses SQLite locally but is architected for easy Azure deployment later.

**Key constraints:**
- Focus on Salesforce CRM — exclude Dynamics 365-only features
- Note CRM-specific differences in test descriptions
- Name-based tester picker (no auth)
- Tests assignable to testers but reassignable
- Full audit trail of every status change
- D365-specific features excluded unless they have a Salesforce equivalent

## User Story

As a QA tester on the Copilot for Sales project,
I want an interactive checklist application with all testable features organized by category,
So that I can systematically execute tests, track results, and report on testing progress.

## Problem Statement

The team has a 146-page PDF training guide with ~75+ testable Copilot for Sales features but no structured way to track test execution, assign testers, or monitor progress. Manual tracking in spreadsheets is error-prone and doesn't provide audit trails.

## Solution Statement

Build a full-stack web application (React + Express + SQLite) that seeds all test cases from the PDF, provides an interactive checklist UI organized by category, supports tester management and assignment, logs every status change with timestamps, and can export results. The app runs locally with a clear migration path to Azure.

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: High
**Primary Systems Affected**: New greenfield application
**Dependencies**: Node.js, React, Vite, Express, Prisma, SQLite, Tailwind CSS

---

## CONTEXT REFERENCES

### Project Directory

- `c:\Users\steve\ClaudeProjects\SalesCopilot\` — greenfield project, only contains the source PDF and PPTX

### New Files to Create

**Root configuration:**
- `package.json` — root package with scripts for dev, build, start, db commands
- `tsconfig.json` — TypeScript config for the backend
- `.env` — environment variables (DATABASE_URL, PORT)
- `.gitignore` — node_modules, .env, *.db, dist/
- `vite.config.ts` — Vite config with proxy to Express API

**Prisma / Database:**
- `prisma/schema.prisma` — data model
- `prisma/seed.ts` — seed script with all ~75 test cases
- `prisma/seed-data/categories.ts` — category definitions
- `prisma/seed-data/test-cases.ts` — all test case data extracted from PDF

**Backend (Express API):**
- `server/index.ts` — Express app entry point
- `server/routes/categories.ts` — category routes
- `server/routes/testers.ts` — tester CRUD routes
- `server/routes/testCases.ts` — test case routes with filtering
- `server/routes/testResults.ts` — result logging + history
- `server/routes/assignments.ts` — test assignment routes
- `server/routes/dashboard.ts` — aggregated stats
- `server/routes/export.ts` — CSV export
- `server/middleware/errorHandler.ts` — centralized error handling
- `server/lib/prisma.ts` — Prisma client singleton

**Frontend (React + Tailwind):**
- `src/main.tsx` — React entry point
- `src/App.tsx` — root component with routing
- `src/api/client.ts` — API helper (fetch wrapper)
- `src/pages/Dashboard.tsx` — overview with progress bars
- `src/pages/CategoryView.tsx` — tests listed under a category
- `src/pages/TestDetail.tsx` — single test execution view
- `src/pages/Testers.tsx` — tester management
- `src/pages/AuditLog.tsx` — full audit trail view
- `src/components/Layout.tsx` — app shell with nav sidebar
- `src/components/Sidebar.tsx` — navigation sidebar
- `src/components/StatusBadge.tsx` — colored status badges
- `src/components/ProgressBar.tsx` — category progress bar
- `src/components/TestCard.tsx` — expandable test case card
- `src/components/TesterPicker.tsx` — name-based tester dropdown
- `src/components/NotesEditor.tsx` — notes input for test results
- `src/components/AuditTrail.tsx` — timeline of status changes
- `src/components/ExportButton.tsx` — CSV export trigger
- `src/components/FilterBar.tsx` — status/category/tester/keyword filters
- `src/types/index.ts` — shared TypeScript types
- `index.html` — Vite HTML entry
- `tailwind.config.js` — Tailwind config with category colors
- `postcss.config.js` — PostCSS config

### Relevant Documentation

- [Prisma SQLite Setup](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-sqlite)
- [Prisma Seeding](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding)
- [Vite Proxy Configuration](https://vite.dev/config/server-options#server-proxy)
- [Express Error Handling](https://expressjs.com/en/guide/error-handling.html)
- [TanStack React Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Patterns to Follow

**Naming Conventions:** camelCase for variables/functions, PascalCase for components/types, kebab-case for routes
**Error Handling:** Centralized Express error middleware + async wrapper
**Validation:** Zod schemas shared between frontend form validation and backend request validation
**State Management:** TanStack Query for server state, React useState for local UI state
**Database:** Prisma with SQLite, String types for enums (SQLite compatibility), String for JSON fields

---

## DATA MODEL (Prisma Schema)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Category {
  id           String     @id @default(uuid())
  name         String     @unique
  slug         String     @unique
  displayOrder Int
  description  String
  color        String     // hex color for UI
  testCases    TestCase[]
  createdAt    DateTime   @default(now())
}

model Tester {
  id          String           @id @default(uuid())
  name        String           @unique
  email       String?
  role        String           @default("tester") // "tester" | "lead"
  isActive    Boolean          @default(true)
  assignments TestAssignment[]
  testResults TestResult[]
  createdAt   DateTime         @default(now())
}

model TestCase {
  id            String           @id @default(uuid())
  categoryId    String
  category      Category         @relation(fields: [categoryId], references: [id])
  title         String
  userStory     String           // full user story text
  persona       String           // e.g. "Yuri - Email-Burdened Seller"
  testSteps     String           // JSON array of step strings
  prerequisites String           // JSON array of prerequisite strings
  crmNotes      String?          // Salesforce-specific notes, CRM differences
  pageRef       String?          // page reference in PDF
  displayOrder  Int
  assignments   TestAssignment[]
  testResults   TestResult[]
  createdAt     DateTime         @default(now())

  @@index([categoryId])
}

model TestAssignment {
  id         String   @id @default(uuid())
  testCaseId String
  testCase   TestCase @relation(fields: [testCaseId], references: [id], onDelete: Cascade)
  testerId   String
  tester     Tester   @relation(fields: [testerId], references: [id])
  assignedAt DateTime @default(now())

  @@unique([testCaseId]) // one assignment per test case (reassignable)
  @@index([testerId])
}

model TestResult {
  id         String   @id @default(uuid())
  testCaseId String
  testCase   TestCase @relation(fields: [testCaseId], references: [id], onDelete: Cascade)
  testerId   String
  tester     Tester   @relation(fields: [testerId], references: [id])
  status     String   // "pass" | "fail" | "blocked" | "skipped" | "not-started"
  notes      String?
  createdAt  DateTime @default(now())

  @@index([testCaseId])
  @@index([testerId])
  @@index([createdAt])
}
```

---

## API ENDPOINTS

```
CATEGORIES
  GET    /api/categories                → list all with test counts & progress stats
  GET    /api/categories/:id            → single category with test cases

TEST CASES
  GET    /api/test-cases                → list with filters (?categoryId, ?status, ?testerId, ?search)
  GET    /api/test-cases/:id            → single test case with latest result + assignment
  PUT    /api/test-cases/:id            → update test case details

TESTERS
  GET    /api/testers                   → list all testers
  POST   /api/testers                   → create tester { name, email?, role? }
  PUT    /api/testers/:id               → update tester
  DELETE /api/testers/:id               → soft-delete (set isActive=false)

TEST RESULTS (audit trail)
  POST   /api/test-results              → log result { testCaseId, testerId, status, notes? }
  GET    /api/test-results/:testCaseId  → full history for a test case (ordered by createdAt desc)

ASSIGNMENTS
  POST   /api/assignments               → assign { testCaseId, testerId }
  PUT    /api/assignments/:testCaseId   → reassign { testerId }
  DELETE /api/assignments/:testCaseId   → unassign
  POST   /api/assignments/bulk          → bulk assign { testCaseIds[], testerId }

DASHBOARD
  GET    /api/dashboard/summary         → overall stats (total, by status, pass rate)
  GET    /api/dashboard/by-category     → stats per category
  GET    /api/dashboard/by-tester       → stats per tester
  GET    /api/dashboard/recent-activity → recent test results (last 20)

EXPORT
  GET    /api/export/csv                → download CSV of all results with filters
```

---

## REACT COMPONENT HIERARCHY

```
App
├── Layout
│   ├── Sidebar (nav links to categories, dashboard, testers, audit)
│   └── Main Content Area
│       ├── Dashboard (default route /)
│       │   ├── SummaryCards (total tests, pass rate, blocked, untested)
│       │   ├── CategoryProgressList
│       │   │   └── ProgressBar (one per category, color-coded)
│       │   ├── TesterProgressList
│       │   └── RecentActivity (last 20 status changes)
│       │
│       ├── CategoryView (/category/:slug)
│       │   ├── CategoryHeader (name, description, progress)
│       │   ├── FilterBar (status filter, tester filter, search)
│       │   └── TestCaseList
│       │       └── TestCard (expandable, shows user story, steps, status)
│       │           ├── StatusBadge
│       │           ├── TesterPicker (assign/reassign)
│       │           └── QuickStatusButtons (pass/fail/blocked/skipped)
│       │
│       ├── TestDetail (/test/:id)
│       │   ├── TestHeader (title, category, persona, status)
│       │   ├── UserStorySection
│       │   ├── TestStepsChecklist (numbered steps)
│       │   ├── PrerequisitesList
│       │   ├── CrmNotesSection (Salesforce-specific callouts)
│       │   ├── ResultForm (status selector + notes editor)
│       │   ├── TesterPicker
│       │   └── AuditTrail (full history for this test)
│       │
│       ├── Testers (/testers)
│       │   ├── TesterForm (add/edit)
│       │   └── TesterList (name, role, assigned count, completion stats)
│       │
│       └── AuditLog (/audit)
│           ├── FilterBar (date range, tester, status, category)
│           └── AuditTable (timestamp, tester, test, old→new status, notes)
```

---

## SEED DATA STRATEGY

The seed script will contain all ~75 Salesforce-applicable test cases extracted from the PDF. The data will be structured as TypeScript objects in separate files for maintainability.

**Structure:**
- `prisma/seed-data/categories.ts` — 5 category objects with colors
- `prisma/seed-data/test-cases.ts` — Array of all test cases with full content
- `prisma/seed.ts` — Main seed script using upsert pattern (idempotent)

**Categories with colors:**
1. Productivity — `#3B82F6` (blue)
2. Interactions — `#06B6D4` (cyan)
3. Flow of Work — `#F59E0B` (amber)
4. Administration — `#EF4444` (red)
5. Monitoring — `#8B5CF6` (purple)

**Test cases will include:**
- Full user story text from the PDF
- Persona (e.g., "Yuri - Email-Burdened Seller")
- Step-by-step test instructions as JSON arrays
- Prerequisites as JSON arrays
- CRM notes flagging Salesforce-specific behavior or differences
- Page reference for traceability back to PDF

**Idempotent seed:** Uses `upsert` on unique `id` fields so the seed can be re-run without duplicating data.

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation (Project Setup)

**Tasks:**
- Initialize Node.js project with TypeScript
- Set up Vite + React + Tailwind CSS frontend
- Configure Prisma with SQLite
- Set up Express backend with basic structure
- Configure Vite proxy to Express
- Set up concurrent dev server (frontend + backend)

### Phase 2: Database & API

**Tasks:**
- Define Prisma schema and run initial migration
- Build the seed data files with all ~75 test cases
- Implement all Express API routes
- Add error handling middleware
- Run seed and verify data

### Phase 3: Frontend Core

**Tasks:**
- Build Layout with sidebar navigation
- Implement Dashboard page with progress stats
- Build CategoryView with expandable test cards
- Build TestDetail page with full execution view
- Implement status logging (pass/fail/blocked/skipped)
- Add notes editor for test results

### Phase 4: Assignment & Tester Management

**Tasks:**
- Build Testers page (add/edit/list)
- Implement TesterPicker component
- Add assignment/reassignment functionality
- Build bulk assignment UI

### Phase 5: Audit Trail & Export

**Tasks:**
- Build AuditLog page with filtering
- Implement AuditTrail component for per-test history
- Add CSV export endpoint and button
- Add filter/search across all views

### Phase 6: Polish & Verification

**Tasks:**
- Responsive design pass
- Status color consistency
- Error states and loading states
- End-to-end verification

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### Task 1: CREATE project scaffolding

- **IMPLEMENT**: Initialize package.json with all dependencies, tsconfig.json, .gitignore, .env
- **Dependencies (backend)**: express, cors, @prisma/client, zod, fast-csv, tsx, concurrently
- **Dependencies (frontend)**: react, react-dom, react-router-dom, @tanstack/react-query, tailwindcss, postcss, autoprefixer, lucide-react
- **Dev dependencies**: typescript, @types/node, @types/express, @types/cors, prisma, vite, @vitejs/plugin-react, @types/react, @types/react-dom, nodemon
- **VALIDATE**: `npm install` completes without errors

### Task 2: CREATE Vite + React + Tailwind configuration

- **IMPLEMENT**: vite.config.ts with API proxy to localhost:3001, tailwind.config.js with category colors, postcss.config.js, index.html, src/main.tsx, src/App.tsx (placeholder)
- **VALIDATE**: `npx vite --help` runs (Vite installed correctly)

### Task 3: CREATE Prisma schema and run migration

- **IMPLEMENT**: prisma/schema.prisma with all models (Category, Tester, TestCase, TestAssignment, TestResult)
- **VALIDATE**: `npx prisma migrate dev --name init` creates the SQLite database and tables

### Task 4: CREATE seed data files

- **IMPLEMENT**: prisma/seed-data/categories.ts with 5 categories, prisma/seed-data/test-cases.ts with all ~75 Salesforce-applicable test cases extracted from the PDF
- **CRITICAL**: Each test case must include: title, userStory, persona, testSteps (JSON array), prerequisites (JSON array), crmNotes (Salesforce callouts), pageRef
- **CRITICAL**: Exclude D365-only features. For features that work on both CRMs but differ, include crmNotes explaining the Salesforce behavior
- **VALIDATE**: TypeScript compiles without errors

### Task 5: CREATE seed script and run it

- **IMPLEMENT**: prisma/seed.ts using upsert pattern for idempotency
- **VALIDATE**: `npx tsx prisma/seed.ts` populates the database; `npx prisma studio` shows all records

### Task 6: CREATE Express server with Prisma client

- **IMPLEMENT**: server/index.ts (Express app with CORS, JSON parsing, route mounting), server/lib/prisma.ts (singleton client), server/middleware/errorHandler.ts
- **VALIDATE**: `npx tsx server/index.ts` starts server on port 3001, `curl http://localhost:3001/api/health` returns OK

### Task 7: CREATE API routes — categories + test cases

- **IMPLEMENT**: server/routes/categories.ts (GET list with stats, GET by id), server/routes/testCases.ts (GET list with filters, GET by id, PUT update)
- **VALIDATE**: `curl http://localhost:3001/api/categories` returns 5 categories with test counts

### Task 8: CREATE API routes — testers + assignments

- **IMPLEMENT**: server/routes/testers.ts (CRUD), server/routes/assignments.ts (assign, reassign, unassign, bulk assign)
- **VALIDATE**: `curl -X POST http://localhost:3001/api/testers -d '{"name":"Test User"}' -H 'Content-Type: application/json'` creates a tester

### Task 9: CREATE API routes — test results + dashboard + export

- **IMPLEMENT**: server/routes/testResults.ts (POST log result, GET history), server/routes/dashboard.ts (summary, by-category, by-tester, recent), server/routes/export.ts (CSV download)
- **VALIDATE**: Full API test — log a result, check dashboard stats reflect it, download CSV

### Task 10: CREATE shared TypeScript types

- **IMPLEMENT**: src/types/index.ts with interfaces for all API responses (Category, TestCase, Tester, TestResult, TestAssignment, DashboardSummary, etc.)
- **VALIDATE**: Types compile

### Task 11: CREATE API client helper

- **IMPLEMENT**: src/api/client.ts with typed fetch wrapper functions for all endpoints
- **VALIDATE**: Types compile, functions match API endpoints

### Task 12: CREATE Layout + Sidebar + routing

- **IMPLEMENT**: src/components/Layout.tsx (app shell with sidebar + main area), src/components/Sidebar.tsx (nav links: Dashboard, 5 category links, Testers, Audit Log), src/App.tsx (React Router with all routes)
- **Category nav items** colored with their category colors
- **VALIDATE**: `npm run dev` shows the app shell with sidebar navigation

### Task 13: CREATE Dashboard page

- **IMPLEMENT**: src/pages/Dashboard.tsx with:
  - SummaryCards row (total tests, pass rate %, failed count, blocked count, untested count)
  - CategoryProgressList (5 progress bars with category colors, showing X/Y tested)
  - TesterProgressList (per-tester stats)
  - RecentActivity list (last 20 status changes with timestamps)
- **Uses**: TanStack Query to fetch /api/dashboard/* endpoints
- **VALIDATE**: Dashboard renders with real seed data stats (all tests show as not-started initially)

### Task 14: CREATE StatusBadge + ProgressBar + TestCard components

- **IMPLEMENT**:
  - StatusBadge: colored badge (green=pass, red=fail, amber=blocked, gray=skipped, slate=not-started)
  - ProgressBar: horizontal bar with fill percentage + label
  - TestCard: expandable card showing title, persona, status badge, assigned tester; expands to show user story, test steps, prerequisites, CRM notes
- **VALIDATE**: Components render correctly in CategoryView

### Task 15: CREATE CategoryView page

- **IMPLEMENT**: src/pages/CategoryView.tsx showing:
  - Category header with name, description, color accent, progress stats
  - FilterBar (filter by status dropdown, tester dropdown, search input)
  - List of TestCard components for each test in the category
  - Each TestCard has quick-action buttons to set status inline
- **VALIDATE**: Navigate to /category/productivity, see all Productivity test cases with expandable details

### Task 16: CREATE TestDetail page

- **IMPLEMENT**: src/pages/TestDetail.tsx showing:
  - TestHeader (title, category breadcrumb, persona, current status badge)
  - UserStorySection (full user story text in a styled callout)
  - TestStepsChecklist (numbered list with optional individual step checkboxes)
  - PrerequisitesList (bullet list)
  - CrmNotesSection (amber callout box if crmNotes exists, flagging Salesforce differences)
  - ResultForm: status selector (5 buttons: pass/fail/blocked/skipped/not-started) + notes textarea + submit
  - TesterPicker dropdown (assign/reassign)
  - AuditTrail component showing full history of status changes for this test
- **VALIDATE**: Navigate to a test case, see all details, log a result, see it appear in audit trail

### Task 17: CREATE Testers page

- **IMPLEMENT**: src/pages/Testers.tsx with:
  - Add tester form (name, email optional, role dropdown)
  - Tester list showing: name, role, assigned test count, completion stats (pass/fail/etc)
  - Edit/deactivate actions per tester
- **VALIDATE**: Create a tester, see them in the list, assign them to tests

### Task 18: CREATE TesterPicker component

- **IMPLEMENT**: src/components/TesterPicker.tsx — dropdown showing active testers, selected tester highlighted, onChange triggers assignment API call
- **VALIDATE**: Can assign and reassign testers from both CategoryView and TestDetail

### Task 19: CREATE AuditLog page

- **IMPLEMENT**: src/pages/AuditLog.tsx with:
  - FilterBar (date range, tester, status, category)
  - Scrollable table: timestamp, tester name, test case title, category, status, notes (truncated)
  - Click row to navigate to test detail
  - Pagination (20 per page)
- **VALIDATE**: Log several results across tests, see them all in audit log with correct timestamps

### Task 20: CREATE ExportButton + CSV export

- **IMPLEMENT**: src/components/ExportButton.tsx — button that triggers CSV download from /api/export/csv with current filters as query params
- **VALIDATE**: Click export, CSV downloads with correct data

### Task 21: CREATE bulk assignment UI

- **IMPLEMENT**: On CategoryView, add "Select All" checkbox + bulk assign dropdown. When tests are selected, show "Assign selected to:" tester picker that calls /api/assignments/bulk
- **VALIDATE**: Select multiple tests, bulk assign to a tester, see assignments update

### Task 22: POLISH — responsive design, loading states, error states

- **IMPLEMENT**: Loading skeletons for data fetching, error boundary for API failures, responsive sidebar (collapsible on mobile), consistent spacing and typography
- **VALIDATE**: App works on both desktop and tablet-width screens, loading states visible during data fetch

---

## TESTING STRATEGY

### Manual Validation (Primary)

Since this is a local tool, the primary testing approach is manual validation:

1. **Seed data verification**: Run `npx prisma studio` to verify all 75 test cases are seeded correctly across 5 categories
2. **API verification**: Use curl or the browser to hit each API endpoint
3. **UI walkthrough**: Navigate through every page, test every interaction
4. **Audit trail verification**: Log multiple results for the same test, verify full history is preserved
5. **Export verification**: Download CSV and verify data matches UI

### Edge Cases to Verify

- Reassigning a test that already has results (results should persist, assignment changes)
- Logging a result without selecting a tester (should show error)
- Deleting a tester who has assignments (should prevent or reassign)
- Empty states (no results yet, no testers yet, no assignments)
- Very long notes text
- Special characters in notes
- Concurrent seed runs (upsert should handle idempotently)

---

## VALIDATION COMMANDS

### Level 1: Project Setup
```bash
npm install                              # all dependencies install
npx prisma migrate dev --name init       # database created
npx tsx prisma/seed.ts                   # seed data loaded
```

### Level 2: Backend
```bash
npx tsx server/index.ts                  # server starts on port 3001
curl http://localhost:3001/api/categories # returns 5 categories
curl http://localhost:3001/api/test-cases # returns all test cases
curl http://localhost:3001/api/dashboard/summary # returns stats
```

### Level 3: Frontend
```bash
npm run dev                              # both servers start (Vite + Express)
# Open http://localhost:5173
# Dashboard loads with progress bars
# Navigate to each category
# Create a tester
# Assign and log results
```

### Level 4: Full Workflow
```bash
# 1. Create tester via UI
# 2. Navigate to Productivity category
# 3. Assign a test to the tester
# 4. Open test detail, log a "pass" result with notes
# 5. Log a "fail" result for the same test (audit trail should show both)
# 6. Check dashboard — stats should reflect the results
# 7. Check audit log — both status changes visible
# 8. Export CSV — verify data
```

---

## ACCEPTANCE CRITERIA

- [ ] All ~75 Salesforce-applicable test cases seeded and visible in the UI
- [ ] 5 categories displayed with correct colors and groupings
- [ ] Test cases show full details: user story, persona, test steps, prerequisites, CRM notes
- [ ] Testers can be created and selected via name-based picker
- [ ] Tests can be assigned to testers and reassigned
- [ ] Results can be logged with status (pass/fail/blocked/skipped) and notes
- [ ] Full audit trail preserved — every status change recorded with timestamp and tester
- [ ] Dashboard shows accurate progress stats by category and overall
- [ ] CSV export works with current data
- [ ] Filter and search work across test cases
- [ ] App runs locally with `npm run dev`
- [ ] No D365-only features included; Salesforce differences noted in CRM notes
- [ ] SQLite database used locally with clear migration path to Azure SQL (Prisma provider swap)

---

## COMPLETION CHECKLIST

- [ ] All 22 tasks completed in order
- [ ] Database seeded with full test case data from PDF
- [ ] All API endpoints functional
- [ ] All UI pages render correctly with real data
- [ ] Audit trail captures every status change
- [ ] CSV export produces valid file
- [ ] App runs with single `npm run dev` command
- [ ] Responsive on desktop and tablet

---

## NOTES

### Architecture Decisions
- **Single package (not monorepo)**: For simplicity. The backend and frontend live in the same npm project. Vite serves the frontend, Express serves the API. In production, Vite builds to `dist/` and Express serves it statically.
- **SQLite + String enums**: SQLite doesn't support native enums. We use String fields with application-level validation via Zod. This makes Azure SQL migration seamless — just change the Prisma provider.
- **JSON as String**: Test steps and prerequisites are stored as JSON-stringified arrays in String columns. Parsed in the API layer. This works identically in SQLite and SQL Server.
- **Upsert seed pattern**: Seed script uses upsert on stable IDs so it can be re-run without duplicating data. This is critical for updating test case content later.
- **TanStack Query**: Handles all server state (caching, refetching, loading states) with minimal code. No need for Redux or Zustand.

### Azure Migration Path
1. Create Azure SQL Database
2. Update `.env`: change `DATABASE_URL` to Azure SQL connection string
3. Change Prisma provider from `"sqlite"` to `"sqlserver"` in schema.prisma
4. Run `npx prisma migrate deploy`
5. Deploy to Azure App Service with `az webapp up` or GitHub Actions
6. Seed the production database

### CRM Filtering Strategy
Test cases from the PDF were filtered as follows:
- **Included**: All features that work with Salesforce (even if they also work with D365)
- **Included with crmNotes**: Features where behavior differs between D365 and Salesforce (e.g., record filter behavior, duplicate detection rules)
- **Excluded**: Features explicitly stated as D365-only with no Salesforce equivalent
- **Excluded**: D365-specific appendix features (pages 132-146) unless a Salesforce equivalent exists in the main content
