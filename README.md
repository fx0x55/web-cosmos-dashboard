# CosmosDash

A modern Cosmos blockchain data dashboard built with Next.js, providing real-time insights into account balances, delegations, unbondings, and validator information across Cosmos SDK chains.

## Features

- **Chain Statistics** — Total supply, bonded/unbonded tokens, and community pool data fetched directly from Cosmos LCD REST endpoints
- **Account Explorer** — Paginated list of accounts with balances; click-through to detailed views showing staking, rewards, and unbonding info
- **Delegation Rankings** — Top delegators ranked by staked amount with delegation counts
- **Unbonding Tracker** — All active unbonding delegations with completion time estimates
- **Validator Details** — Per-validator delegation/unbonding breakdowns with delegator counts
- **Multi-Chain Support** — URL-driven chain switching via `?chain=` query parameter (extensible chain config)
- **Dark / Light / System Theme** — Powered by `next-themes` with smooth transitions
- **Glassmorphism UI** — Consistent frosted-glass aesthetic with custom CSS utility classes

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org) 16 (App Router) |
| Language | TypeScript 5 |
| UI Library | React 19 |
| Styling | [Tailwind CSS](https://tailwindcss.com) v4 |
| Components | [shadcn/ui](https://ui.shadcn.com) (New York style) + [Radix UI](https://www.radix-ui.com) primitives |
| Icons | [Lucide React](https://lucide.dev) |
| Compiler | React Compiler (`babel-plugin-react-compiler`) |
| Linting | ESLint 9 + Prettier |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout (nav, theme, suspense boundaries)
│   ├── page.tsx                   # Home — stats cards + tabbed lists
│   ├── globals.css                # Design tokens, theme variables, glass utilities
│   ├── address/[address]/page.tsx # Account detail (SSR)
│   └── validator/[address]/page.tsx # Validator detail (SSR)
├── components/
│   ├── main-nav.tsx               # Top navigation bar
│   ├── chain-switcher.tsx         # Chain selector dropdown
│   ├── search-form.tsx            # Address search with validation
│   ├── dashboard-stats.tsx        # Chain-level statistics cards
│   ├── data-table.tsx             # Generic paginated table
│   ├── copy-button.tsx            # Clipboard copy with feedback
│   ├── mode-toggle.tsx            # Theme switcher
│   ├── theme-provider.tsx         # next-themes wrapper
│   ├── lists/
│   │   ├── balance-list.tsx       # Account balances table
│   │   ├── delegation-list.tsx    # Top delegators table
│   │   ├── unbonding-list.tsx     # Unbonding delegations table
│   │   ├── validator-delegation-list.tsx
│   │   └── validator-unbonding-list.tsx
│   └── ui/                        # shadcn/ui primitives
└── lib/
    ├── api.ts                     # API client (isomorphic URL resolution)
    ├── types.ts                   # TypeScript type definitions
    └── utils.ts                   # Helpers (cn, formatAmount, truncateAddress, etc.)
```

## Architecture

- **Server components** (`layout.tsx`, address page, validator page) perform initial data fetching with `async/await` for fast SSR
- **Client components** (home page, list components, stats) handle interactive features and client-side pagination via `useEffect` + `useState`
- **API proxy** — Next.js rewrites proxy `/api/*` requests to the backend, enabling isomorphic data fetching (absolute URL on server, relative path on client)
- **Generic `DataTable<T>`** — A single reusable typed table component powers all five paginated list views

## Getting Started

### Prerequisites

- Node.js 20+
- npm (or yarn / pnpm / bun)
- A running backend API server (see [Environment Variables](#environment-variables))

### Installation

```bash
git clone https://github.com/fx0x55/web-cosmos-dashboard.git
cd web-cosmos-dashboard
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8081
```

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8081` |

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Production

```bash
npm run build
npm start
```

### Linting & Formatting

```bash
npm run lint        # Run ESLint
npm run lint:fix    # Auto-fix ESLint issues
npm run format      # Format with Prettier
```

## Backend API Endpoints

The dashboard expects the following REST API endpoints from the backend:

| Endpoint | Description |
|---|---|
| `GET /api/accounts?page=&page_size=` | Paginated account list with balances |
| `GET /api/accounts/:address` | Account detail (balances, delegations, unbondings, rewards) |
| `GET /api/delegators?page=&page_size=` | Top delegators ranked by staked amount |
| `GET /api/unbondings?page=&page_size=` | Active unbonding delegations |
| `GET /api/validators/:address` | Validator summary (total delegated, delegator count, etc.) |
| `GET /api/validators/:address/delegations?page=&page_size=` | Delegations to a specific validator |
| `GET /api/validators/:address/unbondings?page=&page_size=` | Unbondings from a specific validator |

Chain statistics are fetched directly from Cosmos LCD REST endpoints (`/cosmos/bank/v1beta1/supply/by_denom`, `/cosmos/staking/v1beta1/pool`, `/cosmos/distribution/v1beta1/community_pool`).

## Adding a New Chain

Edit the `CHAINS` array in `src/lib/api.ts`:

```typescript
{
  id: "your-chain",
  name: "Your Chain",
  icon: "🔗",
  denom: "TOKEN",
  decimals: 18,
  explorer_base_url: "https://explorer.yourchain.io",
  rest_url: "https://lcd.yourchain.io",
  adenom: "atoken",
}
```

## License

MIT
