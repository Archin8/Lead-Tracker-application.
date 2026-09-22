# AGENT.md

This document describes how AI tools were used to build the **Lead Tracker** application, fulfilling the assignment's transparency and workflow evaluation requirements.

---

## AI Tools & Workflow

| Tool | Role |
|---|---|
| **Claude** (Anthropic, chat) | Architecture planning, designing the Material UI theme, structuring backend Express routes/controllers, and creating step-by-step phased instructions. |
| **Google Antigravity** (Agentic AI Assistant) | Executing file creation/edits, running local builds (`npx tsc`, `npm run build`), running development servers (`npm run dev`), executing database setup/migrations, and verifying zero build errors. |

**Why this workflow:** Work was executed in distinct, reviewable phases. Every change was previewed, inspected, and verified before being applied to the codebase. This approach maintained a clear, logical step-by-step progression and prevented monolithic code dumps.

---

## Phased Implementation Trail

### Backend Implementation Phases:
1. **Phase 1: Project Setup** — Configured `package.json`, `tsconfig.json`, and environment variables.
2. **Phase 2: Database Layer** — Configured PostgreSQL connection pool (`pool.ts`) with SSL support for Render PostgreSQL.
3. **Phase 3: Models & Schemas** — Defined `Lead` interface and Zod validation schemas (`createLeadSchema`, `updateStatusSchema`, `searchQuerySchema`).
4. **Phase 4: API Controllers & Routes** — Implemented `listLeads`, `createLead`, `updateLeadStatus`, and `getLead` with parameterized SQL queries, plus centralized error handling.
5. **Phase 5: Rate Limiting Middleware** — Added variable-based in-memory rate limiter middleware (`rateLimiter.ts`).

### Frontend Implementation Phases:
1. **Phase 1: Project Setup** — Configured Vite + React + TypeScript, installed Material UI (`@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`), and added Google Fonts Inter link tags.
2. **Phase 2: Theme & Types** — Created MUI `theme.ts` with custom brand palette (`#03b7d3`, `#fafcfc`, `#ffffff`) and defined `Lead` type definitions.
3. **Phase 3: API Client** — Built `leadsApi.ts` as the single point of network `fetch()` calls with Zod error handling.
4. **Phase 4: UI Components** — Developed `StatusChip.tsx`, `LeadForm.tsx` (card surface & alert feedback), `SearchBar.tsx` (300ms debounced search & status filter), and `LeadList.tsx` (MUI table with inline status updates, loading & empty states).
5. **Phase 5: App Wiring & Layout** — Rewrote `App.tsx` to connect top-level state management with MUI `<AppBar>` and `<Container>` responsive layout chrome.

---

## AI-Generated Sections

Written by AI under explicit prompt guidance, reviewed, and applied:

- **Backend**:  `Backend/src/controllers/leadsController.ts`, `Backend/src/routes/leads.ts` ,  `Backend/src/app.ts`, `Backend/src/index.ts`.
- **Frontend**:  `Frontend/src/types/lead.ts`,`Frontend/src/components/StatusChip.tsx`, `Frontend/src/components/LeadForm.tsx`
- 

---

## Manually Decided, Written, and Debugged Sections

1. **Design System & Aesthetics**:
   - Specified color tokens (`#fafcfc` default background, `#ffffff` paper card background, `#03b7d3` primary accent, `#171a26` dark text) and font choices (Inter 400/500/600/700).
   - Ensured MUI components use theme variables instead of hardcoded hex values.

2. **Strict TypeScript & Build Error Resolution**:
   - **`verbatimModuleSyntax` Compliance**: Resolved TypeScript errors when building with Vite 8 / TS 6 by updating all type imports to explicit type-only syntax (`import type { ... }`) across all frontend component and API files.
   - **Render Deployment Build Fix**: Fixed `Backend/tsconfig.json` by adding `"./node_modules/@types"` to `typeRoots` so TypeScript could resolve `@types/node` and `@types/express`.
   - **Dependencies Reorganization**: Moved `@types/*` packages and `typescript` to `dependencies` in `Backend/package.json` so Render builds running in `NODE_ENV=production` wouldn't prune type definitions during `npm install`.

3. **Database & Environment Troubleshooting**:
   - Fixed `.env` parsing issue by removing spaces around `=`.
   - Configured `ssl: { rejectUnauthorized: false }` inside `Backend/src/db/pool.ts` to allow local and production connection to Render PostgreSQL.
   - Executed database migrations to create the `leads` table with UUID primary keys, status check constraints, and seed data.

4. **Rate Limiting Security Feature**:
   - Implemented variable-based in-memory rate limiting (`rateLimiter.ts`) using a `Map` data structure with automated garbage collection to protect backend API endpoints against high request frequency.

---

## Key Engineering Decisions

- **Decoupled Express App (`createApp()`)**: Express app instantiation is isolated in `app.ts` as a factory function separate from `index.ts`. This allows Supertest integration tests to exercise the app without opening network ports.
- **Single Endpoint for List & Search (`GET /api/leads?q=&status=`)**: Avoids duplicate query logic by constructing dynamic, parameterized SQL `WHERE` clauses.
- **Single Source of Truth for Network Calls (`leadsApi.ts`)**: No UI component invokes `fetch()` directly; all network interactions and Zod error parsing are encapsulated in `leadsApi.ts`.
- **Centralized Validation Schemas (`models/lead.ts`)**: Zod schemas validate all incoming request bodies and query parameters before reaching controllers, guaranteeing strict input safety.
- **Parameterized SQL Queries**: Every database query uses parameter placeholders (`$1`, `$2`) to prevent SQL injection vulnerabilities.