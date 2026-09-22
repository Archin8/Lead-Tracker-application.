# Lead Tracker

A modern, responsive full-stack lead management web application — create leads, search & filter them in real-time, list them in an interactive table, and update lead statuses inline. Built as a job assignment for Stylework.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, TypeScript, Vite, Material UI (MUI), Emotion, Inter Font (Google Fonts) |
| **Backend** | Node.js, TypeScript, Express, Zod, `pg` (node-postgres) |
| **Database** | PostgreSQL (Render Managed Postgres) |
| **Rate Limiter**| Custom In-Memory Rate Limiting Middleware |
| **Validation** | Zod (centralized schemas for create, update, and search) |

---

## Project Structure & Architecture

```
Stylework work/
├── Backend/
│   ├── src/
│   │   ├── app.ts                  # Express app factory (used by server & tests)
│   │   ├── index.ts                # Server entry point
│   │   ├── db/
│   │   │   └── pool.ts             # Postgres pool configuration with SSL & dotenv support
│   │   ├── models/
│   │   │   └── lead.ts             # Lead interface & Zod validation schemas
│   │   ├── controllers/
│   │   │   └── leadsController.ts  # Request handlers & parameterized SQL queries
│   │   ├── routes/
│   │   │   └── leads.ts            # REST endpoint mappings
│   │   ├── middlewares/
│   │   │   ├── error.ts            # Centralized error handling
│   │   │   └── rateLimiter.ts      # Variable-based in-memory rate limiter
│   │   └── utils/
│   │       └── errorHandler.ts    # Custom error classes
│   ├── package.json
│   └── tsconfig.json
└── Frontend/
    └── src/
        ├── theme.ts                # Material UI theme (palette, typography, shape)
        ├── api/
        │   └── leadsApi.ts         # Single API client module for all fetch() calls
        ├── types/
        │   └── lead.ts             # Frontend Lead types matching backend
        ├── components/
        │   ├── StatusChip.tsx      # Color-coded MUI Chip for lead status
        │   ├── LeadForm.tsx        # Responsive form with error alert feedback
        │   ├── SearchBar.tsx       # Debounced free-text search & status filter
        │   └── LeadList.tsx        # MUI Table view with inline status update
        ├── App.tsx                 # Main layout & state wiring
        └── main.tsx                # React entry point wrapped in ThemeProvider & CssBaseline
```

### Key Architectural Decisions

- **Express Factory (`createApp`)**: The Express instance is instantiated via a factory function inside `app.ts` rather than listening immediately in `index.ts`. This decoupling allows Supertest to exercise the API without starting a network server.
- **Unified List & Search Endpoint**: `GET /api/leads?q=&status=` handles both listing and search. Search parameters dynamically generate SQL `WHERE` clauses using parameterized queries (`$1`, `$2`), avoiding code duplication.
- **Single API Client Layer**: `Frontend/src/api/leadsApi.ts` is the only file that executes `fetch()`. Components consume typed API functions (`fetchLeads`, `createLead`, `updateLeadStatus`), keeping UI components completely decoupled from networking logic.
- **Custom In-Memory Rate Limiting**: `rateLimiter.ts` uses an in-memory `Map` variable to track request frequency per client IP with automated periodic garbage collection to prevent memory leaks.
- **Centralized Material UI Theme**: Primary brand accent (`#03b7d3`), background colors (`#fafcfc` default, `#ffffff` paper surface), font weights, and rounded corners are configured centrally in `src/theme.ts`.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Server health check |
| `GET` | `/api/leads` | List leads (supports optional `?q=` search and `?status=` filter) |
| `POST` | `/api/leads` | Create a new lead |
| `GET` | `/api/leads/:id` | Get details for a single lead |
| `PATCH` | `/api/leads/:id/status` | Update a lead's status (`New`, `Contacted`, `Qualified`, `Converted`, `Lost`) |

---

## Local Setup Instructions

### Prerequisites
- Node.js 20+
- PostgreSQL database (or Render PostgreSQL URL)

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/Archin8/Lead-Tracker-application.git
cd Lead-Tracker-application

# Install Backend dependencies
cd Backend
npm install

# Install Frontend dependencies
cd ../Frontend
npm install
```

### 2. Configure Environment Variables

**Backend (`Backend/.env`)**:
```env
PORT=4000
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
CORS_ORIGIN=http://localhost:5173
```

**Frontend (`Frontend/.env`)**:
```env
VITE_API_URL=http://localhost:4000
```

### 3. Run Development Servers

```bash
# Terminal 1: Start Backend API (runs on http://localhost:4000)
cd Backend
npm run dev

# Terminal 2: Start Frontend App (runs on http://localhost:5173)
cd Frontend
npm run dev
```

---

## Production Build & Deployment (Render)

### Backend Service
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `Backend`

### Frontend Static Site
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Root Directory**: `Frontend`
- **SPA Rewrite Rule**: Source `/*` -> Destination `/index.html`

---

## Trade-offs & Considerations

- **Authentication**: Left out per assignment scope; API endpoints are public. In a production environment, JWT/Session authentication and role-based access control (RBAC) would be implemented.
- **Pagination**: Fetches the full result set. For scaling to tens of thousands of leads, cursor-based pagination (`LIMIT` / `OFFSET`) would be added.
- **Shared Types**: Frontend and Backend maintain separate type definition files rather than a monorepo shared package to avoid unnecessary build configuration complexity.