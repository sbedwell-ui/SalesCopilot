# Feature: Tester Management (Add/Remove/Reactivate)

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Replace hardcoded seed testers with a dynamic tester management system. Testers can be added, soft-deleted (with option to clear or keep test results), and reactivated by name. Inactive testers appear grayed out on the Testers page with a one-click "Re-add" button.

## User Story

As a QA lead managing the Copilot for Sales testing checklist,
I want to add and remove testers dynamically with control over their test result history,
So that I can manage my testing team without losing audit trail data unless I choose to.

## Problem Statement

The current app seeds 3 hardcoded testers ("Tester 1/2/3") that can't be removed. The existing active/inactive toggle doesn't address what happens to test results when a tester is removed, and there's no way to reconnect a returning tester to their prior work.

## Solution Statement

- Remove hardcoded testers from seed (keep only "Unassigned" system tester)
- Enhance POST /api/testers to reactivate inactive testers by name match (upsert pattern)
- Add DELETE /api/testers/:id endpoint for soft-delete with `clearResults` option
- Rework Testers page: show inactive testers grayed out, add removal confirmation dialog with clear/keep choice, add "Re-add" button for inactive testers
- Split query keys so TesterPicker only sees active testers while Testers page shows all

## Feature Metadata

**Feature Type**: Enhancement
**Estimated Complexity**: Medium
**Primary Systems Affected**: Tester management (API + UI), seed script
**Dependencies**: No new libraries needed

---

## CONTEXT REFERENCES

### Relevant Codebase Files — READ BEFORE IMPLEMENTING

- `server/routes/testers.ts` — Current GET/POST/PATCH endpoints. Modify all three, add DELETE.
- `src/pages/Testers.tsx` — Current Testers page UI. Major rework: add remove dialog, inactive section, re-add button.
- `src/components/TesterPicker.tsx` — Tester dropdown used in TestDetail and CategoryView. Needs no changes (already filters system testers, will continue using active-only API).
- `src/lib/api.ts` — API client. Add `getAllTesters()` and `deleteTester()` functions.
- `src/lib/types.ts` — Shared types. No changes needed (Tester type already has `isActive`).
- `prisma/seed.ts` (lines 74-88) — Remove "Tester 1/2/3", keep "Unassigned" only.
- `prisma/schema.prisma` — Reference only. No schema changes needed.

### New Files to Create

None — all changes are to existing files.

### Patterns to Follow

**API pattern** (from `server/routes/testers.ts`):
- Router with inline try/catch
- Prisma queries with `include: { _count: { select: {...} } }`
- Return appropriate HTTP status codes (201 for create, 409 for conflict)

**Mutation pattern** (from `src/pages/Testers.tsx`):
- `useMutation` with `onSuccess` that invalidates query keys
- Inline error display with `mutation.isError`

**Query key convention**: `['testers']` for active-only, `['testers', 'all']` for all testers

---

## IMPLEMENTATION PLAN

### Phase 1: Seed Cleanup

Remove hardcoded "Tester 1/2/3" from seed script. Keep "Unassigned" system tester only.

### Phase 2: Backend API Changes

1. Add `?includeInactive=true` query param to GET /api/testers
2. Modify POST /api/testers to detect inactive tester with same name and reactivate
3. Add DELETE /api/testers/:id for soft-delete with `clearResults` body param

### Phase 3: Frontend API Client

Add `getAllTesters()` and `deleteTester()` to the API client.

### Phase 4: Testers Page Rework

Split view into active and inactive sections. Add remove button with confirmation dialog. Add re-add button for inactive testers.

---

## STEP-BY-STEP TASKS

### Task 1: UPDATE `prisma/seed.ts` — Remove hardcoded testers

- **IMPLEMENT**: Remove "Tester 1", "Tester 2", "Tester 3" from the `defaultTesters` array. Keep only `{ name: 'Unassigned', role: 'system', isActive: true }`.
- **VALIDATE**: `npx tsx prisma/seed.ts` completes without error. The 3 testers won't be deleted from existing DB (upsert just won't touch them if they exist), but new DBs won't get them.

### Task 2: UPDATE `server/routes/testers.ts` — Add `includeInactive` query param to GET

- **IMPLEMENT**: Modify the GET `/` handler. Check for query param `includeInactive`. If truthy, remove the `where: { isActive: true }` filter. Default behavior (no param) stays active-only.
- **PATTERN**: Existing handler at lines 7-23
- **VALIDATE**: `curl http://localhost:3001/api/testers` returns only active testers. `curl http://localhost:3001/api/testers?includeInactive=true` returns all testers including inactive.

### Task 3: UPDATE `server/routes/testers.ts` — POST reactivates inactive tester by name

- **IMPLEMENT**: Before creating, check if an inactive tester exists with the same name (`where: { name, isActive: false }`). If found, reactivate: update `isActive` to true, update email if provided, and return the reactivated tester with status 200 (not 201). If not found, create as before (201).
- **PATTERN**: Existing POST handler at lines 25-43
- **GOTCHA**: The existing P2002 (unique constraint) catch handles the case where an *active* tester with same name exists. That should still return 409. The new check only applies to *inactive* testers.
- **VALIDATE**: Create a tester, deactivate them, then POST with same name — should reactivate. POST with active tester's name — should return 409.

### Task 4: ADD `server/routes/testers.ts` — DELETE endpoint for soft-delete

- **IMPLEMENT**: Add `DELETE /:id` handler. Accepts JSON body `{ clearResults?: boolean }`.
  1. Verify tester exists and is not a system role (`role !== 'system'`). Return 403 if system.
  2. If `clearResults` is true: delete all TestResult records where `testerId` matches.
  3. Set `isActive = false` on the tester.
  4. Return the updated tester.
- **IMPORTS**: `prisma` already imported from `../index.js`
- **GOTCHA**: Assignments are intentionally NOT deleted — they persist so re-adding reconnects.
- **VALIDATE**: Create tester, log a result, DELETE with `clearResults: false` — tester inactive, result still exists. DELETE with `clearResults: true` — results deleted.

### Task 5: UPDATE `src/lib/api.ts` — Add `getAllTesters` and `deleteTester`

- **IMPLEMENT**: Add two new functions to the `api` object:
  - `getAllTesters: () => request<Tester[]>('/testers?includeInactive=true')`
  - `deleteTester: (id: string, clearResults: boolean) => request<Tester>(`/testers/${id}`, { method: 'DELETE', body: JSON.stringify({ clearResults }) })`
- **PATTERN**: Follow existing api functions in `src/lib/api.ts`
- **VALIDATE**: TypeScript compiles without errors.

### Task 6: UPDATE `src/pages/Testers.tsx` — Rework page with remove dialog and inactive section

- **IMPLEMENT**: Major rework of the Testers page:

  **Data fetching changes:**
  - Change query to use `api.getAllTesters` with query key `['testers', 'all']`
  - Split testers into `activeTesters` and `inactiveTesters` arrays (filter by `isActive`)
  - Update `createMutation` and `toggleMutation` onSuccess to invalidate both `['testers']` and `['testers', 'all']`

  **Add delete mutation:**
  - `deleteMutation` calls `api.deleteTester(id, clearResults)`
  - On success, invalidate `['testers']`, `['testers', 'all']`, `['dashboard']`, `['categories']`

  **Add reactivate mutation:**
  - `reactivateMutation` calls `api.updateTester(id, { isActive: true })`
  - On success, invalidate same keys as delete

  **Remove confirmation dialog state:**
  - `removingTester: Tester | null` — which tester is being removed (null = dialog closed)
  - Dialog shows tester name, two buttons: "Remove & Keep Results" and "Remove & Clear Results", plus Cancel
  - "Remove & Keep Results" calls `deleteMutation.mutate({ id, clearResults: false })`
  - "Remove & Clear Results" calls `deleteMutation.mutate({ id, clearResults: true })`

  **Active testers section:**
  - Each tester row shows: name, email, role, assignment count, result count
  - "Remove" button (red, with Trash2 icon) — opens confirmation dialog
  - Hide Remove button for system role testers

  **Inactive testers section (below active):**
  - Header: "Inactive Testers" with count
  - Only show section if `inactiveTesters.length > 0`
  - Each row grayed out (`opacity-60` or `text-gray-400`)
  - Shows name, assignment count, result count
  - "Re-add" button (green, with UserPlus icon) — calls `reactivateMutation`

  **Remove the old active/inactive toggle button** — replaced by Remove + Re-add flow

- **IMPORTS**: Add `Trash2, UserPlus, AlertTriangle` from lucide-react (keep existing `Plus, UserCheck, UserX`)
- **VALIDATE**: `npm run dev`, navigate to /testers. Active testers show with Remove button. Clicking Remove opens dialog. After removing, tester appears in inactive section grayed out. Clicking Re-add moves them back to active.

---

## TESTING STRATEGY

### Manual Validation (Primary — no test framework configured)

**Happy path:**
1. Seed fresh DB — only "Unassigned" tester exists
2. Add "Alice" via form — appears in active list
3. Assign Alice to a test case, record a result
4. Remove Alice with "Keep Results" — appears grayed in inactive section, results still visible in audit log
5. Re-add Alice via "Re-add" button — moves to active, assignments intact, old results visible
6. Remove Alice with "Clear Results" — results deleted from audit log, assignments still present
7. Re-add Alice again — active, assignments intact, no results

**Edge cases:**
1. Add tester with name that matches an inactive tester (via the Add form, not Re-add button) — should reactivate
2. Try to remove "Unassigned" system tester — should not be possible (no Remove button shown)
3. Remove a tester with no results — dialog still shows, "Clear Results" is a no-op
4. TesterPicker only shows active testers after removal

---

## VALIDATION COMMANDS

### Level 1: Build Check
```bash
npx tsc --noEmit
```

### Level 2: Seed
```bash
npx tsx prisma/seed.ts
```

### Level 3: API Manual Tests
```bash
# Create tester
curl -X POST http://localhost:3001/api/testers -H "Content-Type: application/json" -d '{"name":"Alice"}'

# List active only (default)
curl http://localhost:3001/api/testers

# List all including inactive
curl http://localhost:3001/api/testers?includeInactive=true

# Soft-delete (keep results)
curl -X DELETE http://localhost:3001/api/testers/<id> -H "Content-Type: application/json" -d '{"clearResults":false}'

# Soft-delete (clear results)
curl -X DELETE http://localhost:3001/api/testers/<id> -H "Content-Type: application/json" -d '{"clearResults":true}'

# Re-add by name (reactivates)
curl -X POST http://localhost:3001/api/testers -H "Content-Type: application/json" -d '{"name":"Alice"}'
```

### Level 4: UI Manual Validation
```
1. npm run dev
2. Navigate to /testers
3. Add tester → assign to test → record result → remove (keep) → verify grayed out → re-add → verify reconnected
4. Verify TesterPicker on /test/:id only shows active testers
5. Verify dashboard stats still accurate after remove/re-add
```

---

## ACCEPTANCE CRITERIA

- [ ] Seed script only creates "Unassigned" system tester (no hardcoded Tester 1/2/3)
- [ ] Testers can be added via the existing form
- [ ] Adding a name that matches an inactive tester reactivates them
- [ ] Active testers show "Remove" button (not for system role)
- [ ] Remove opens confirmation dialog with "Keep Results" / "Clear Results" options
- [ ] "Keep Results" soft-deletes tester, preserves all results and assignments
- [ ] "Clear Results" soft-deletes tester, deletes their TestResult records, preserves assignments
- [ ] Inactive testers appear in a grayed-out section below active testers
- [ ] Inactive testers have a "Re-add" button that reactivates them
- [ ] TesterPicker only shows active testers (no change needed — uses active-only API)
- [ ] Query invalidation keeps all views in sync

---

## COMPLETION CHECKLIST

- [ ] All 6 tasks completed in order
- [ ] Seed updated
- [ ] GET/POST/DELETE endpoints working
- [ ] API client updated
- [ ] Testers page reworked with dialog, inactive section, re-add
- [ ] TesterPicker unaffected (still active-only)
- [ ] Manual testing confirms full add→assign→remove→re-add flow

---

## NOTES

### Design Decisions

- **Soft delete over hard delete**: Preserves FK integrity. TestResult and TestAssignment reference testerId — hard deleting would require cascade or orphan handling. Soft delete is simpler and reversible.
- **Assignments always kept**: Even when "Clear Results" is chosen, assignments persist. This means re-adding a tester reconnects them to their assigned test cases automatically. Results are the audit trail that may contain sensitive/outdated info — assignments are just work allocation.
- **Split query keys**: `['testers']` (active only, used by TesterPicker everywhere) vs `['testers', 'all']` (used only by Testers page). This avoids TesterPicker showing inactive testers in dropdowns while Testers page shows the full list.
- **POST upsert on name**: When POST receives a name matching an inactive tester, it reactivates rather than returning 409. This handles both the "Re-add" button flow (which calls updateTester) and the form flow (which calls createTester with a name).
