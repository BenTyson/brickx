# BrickX — Tech Stack & Conventions

## Tech Stack

| Layer     | Technology                                 |
| --------- | ------------------------------------------ |
| Framework | Next.js 15 (App Router)                    |
| Language  | TypeScript (strict)                        |
| Styling   | Tailwind CSS v4                            |
| Database  | Supabase (PostgreSQL)                      |
| Auth      | Supabase Auth (Google/GitHub OAuth)        |
| Dev Port  | 5699                                       |
| Scripts   | tsx (for standalone scripts in `scripts/`) |

## Directory Structure

```
brickx/
├── docs/                    # Project documentation (agent-optimized)
│   ├── session-start.md     # Agent entry point
│   ├── sessions.md          # Session tracker
│   ├── schema.md            # Database schema reference
│   ├── architecture.md      # This file
│   ├── api-integrations.md  # External API details
│   └── project/overview.md  # Business context
├── scripts/                 # Standalone TypeScript scripts (run with tsx)
│   └── migrate.ts           # Database migration runner
├── supabase/
│   └── migrations/          # SQL migration files (001-012)
├── data/                    # Downloaded data files (gitignored)
├── src/
│   ├── app/                 # Next.js App Router pages and routes
│   │   ├── api/             # API route handlers
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   └── lib/
│       ├── supabase/        # Supabase client modules
│       │   ├── client.ts    # Browser client (NEXT_PUBLIC_ vars)
│       │   ├── server.ts    # Server client (cookie-based)
│       │   └── admin.ts     # Admin client (service role, bypasses RLS)
│       ├── services/        # API clients and business logic
│       ├── types/           # TypeScript type definitions
│       │   └── database.ts  # Supabase Database type
│       ├── utils/           # Shared utilities
│       └── env.ts           # Zod environment validation
└── .env.example             # Environment variable template
```

## Naming Conventions

- **Files:** kebab-case (`rate-limiter.ts`, `base-api-client.ts`)
- **Components:** PascalCase files and exports (`SetCard.tsx`)
- **Types:** PascalCase (`SetRow`, `PriceInsert`)
- **Constants:** UPPER_SNAKE_CASE
- **Database tables:** snake_case plural (`set_prices`, `collection_items`)
- **Database columns:** snake_case (`num_parts`, `fetched_at`)

## Supabase Client Usage

| Client      | Import                               | Use When                            |
| ----------- | ------------------------------------ | ----------------------------------- |
| `client.ts` | Browser/client components            | Client-side data fetching           |
| `server.ts` | Server components, route handlers    | SSR, API routes (respects RLS)      |
| `admin.ts`  | Scripts, cron jobs, admin operations | Bypasses RLS, uses service role key |

**Rules:**

- Never import `admin.ts` in client-side code
- Server components should use `server.ts` for user-scoped queries
- Scripts in `scripts/` use `admin.ts` for bulk operations

## Environment Variables

- `NEXT_PUBLIC_` prefix: Exposed to browser (Supabase URL, anon key)
- No prefix: Server-only (service role key, API keys, DATABASE_URL)
- Validated at startup via `src/lib/env.ts` using Zod
- Template in `.env.example`, actual values in `.env.local` (gitignored)

## Script Execution

All standalone scripts use `tsx` and are run from project root:

```bash
tsx scripts/migrate.ts        # Run database migrations
tsx scripts/seed.ts           # Seed all data (future)
```
