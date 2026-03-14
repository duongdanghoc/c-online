# Project Context: c-online (CPC1HN Shop)

> [!IMPORTANT]
> You are working on the `c-online` project, an e-commerce platform for **Công ty Cổ phần Dược phẩm CPC1 Hà Nội** (CPC1HN). This application serves customers purchasing pharmaceutical products online.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (`@tailwindcss/oxide`), Shadcn/UI, Radix UI, Framer Motion
- **State Management:** Zustand, React Query (`@tanstack/react-query`)
- **Forms:** React Hook Form, Zod
- **Icons:** Lucide React, React Icons
- **Date Handling:** `dayjs`
- **Analytics:** Google Tag Manager, TikTok Pixel, Google Analytics

## Project Structure

- `src/app`: Application routes (Next.js App Router).
- `src/components`: Reusable UI components.
  - `src/components/ui`: Shadcn/UI components.
- `src/lib`: Utility libraries and configurations.
- `src/store`: Global state management stores (Zustand).
  - `cart.ts`: Shopping cart state.
  - `login-store.ts`: Authentication state.
- `src/hooks`: Custom React hooks.
- `src/types`: TypeScript type definitions.
- `src/utils`: Utility functions.
- `src/middleware.ts`: Handles URL redirects via API.

## Coding Guidelines

### 1. General Rules

- **Naming:** Use `kebab-case` for file and directory names. Use `PascalCase` for component names.
- **Components:** Use functional components with TypeScript.
- **Styling:** Use Tailwind CSS for all styling. Avoid CSS modules or styled-components unless absolutely necessary.
- **Imports:** Use absolute imports (e.g., `@/components/ui/button`) configured in `tsconfig.json`.

### 2. Performance (Vercel React Best Practices)

Follow the guidelines from Vercel Engineering to ensure optimal performance.

#### **Critical: Eliminate Waterfalls**

- `async-defer-await`: Move `await` into branches where the data is actually needed.
- `async-parallel`: Use `Promise.all()` for independent asynchronous operations.
- `async-dependencies`: Use `better-all` or similar patterns when dependencies are partial.

#### **Critical: Bundle Size Optimization**

- `bundle-barrel-imports`: Import directly from the source file, avoid large barrel files (index.ts) that re-export everything.
- `bundle-dynamic-imports`: Use `next/dynamic` for heavy components that are not critical for the initial render.
- `bundle-defer-third-party`: Load analytics and third-party scripts after hydration or lazily.

#### **High: Server-Side Performance**

- `server-cache-react`: Use `React.cache()` for per-request deduplication of data fetching.
- `server-serialization`: Minimize the data passed from Server Components to Client Components.
- `server-parallel-fetching`: Parallelize data fetching in Server Components where possible.

#### **Medium: Re-render Optimization**

- `rerender-memo`: Use `React.memo`, `useMemo`, and `useCallback` appropriately to prevent unnecessary re-renders.
- `rerender-derived-state`: Derive state during render instead of using `useEffect` to sync state.
- `client-swr-dedup`: Use React Query (or SWR) for automatic request deduplication and caching on the client.

### 3. State Management

- Use **React Query** for server state (fetching, caching, synchronizing data).
- Use **Zustand** for client-only global state (e.g., UI state, cart, session).
- Keep component state local (`useState`) whenever possible.

## Development Workflow

- **Start Dev Server:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Format:** `npm run format`

## Key Implementation Details

- **Redirects:** Managed in `src/middleware.ts` by querying the backend API.
- **Analytics:** Integrated in `src/app/layout.tsx`. Ensure `NEXT_PUBLIC_TIKTOK_PIXEL_ID` and other env vars are set.
