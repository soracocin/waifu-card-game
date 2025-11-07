### Frontend Architecture Overview

This summarizes the current React/Vite frontend so contributors can navigate the codebase quickly.

#### Key Concepts
- **AuthContext (`src/contexts/AuthContext.tsx`)**  
  Centralizes authentication state, login/logout persistence, and exposes helper methods via the `useAuth` hook.
- **Protected Routes (`src/components/ProtectedRoute.tsx`)**  
  Wraps private routes to prevent unauthenticated access while displaying a consistent loading state.
- **Layouts**  
  - `AppLayout` renders the global header and pulls the active user from context.  
  - `AuthLayout` contains public/auth pages such as login or errors.
- **Pages vs. Components**  
  - Pages (`src/pages`) are route-level containers that pull data via hooks/context and compose multiple UI components.  
  - Components (`src/components`) house reusable UI such as `CardCollection`, `GachaSystem`, and admin tooling (`CardManager`).

#### Routing Flow
```
main.tsx -> <AuthProvider> -> <App>
App.tsx  -> BrowserRouter + Routes (public /login + protected routes wrapped with <ProtectedRoute>)
ProtectedRoute -> guards + loading fallback -> renders page -> page renders <AppLayout>
```

#### State Management Rules
1. Only the auth context interacts with `localStorage`.
2. Pages read from `useAuth()` and may call `updateUser` after refreshing backend data.
3. Child components accept explicit props only if they truly need data beyond the auth context (for example, `CardCollection` needs the user id for API requests).

#### Testing / Builds
- Run `npm run dev` for local development.
- Run `npm run build` for type-checking + production bundle (requires the dev dependency `terser` which is now included).

#### Extending the UI
1. Add new pages under `src/pages` and wrap them with `AppLayout` if they require the authenticated shell.
2. Register routes in `src/App.tsx` and wrap them with `<ProtectedRoute>` when the page requires auth.
3. Use `useAuth()` instead of prop drilling user data through multiple component levels.

This structure keeps auth logic, routing, and feature-specific code well isolated so future features (new dashboards, settings pages, etc.) can be dropped in with minimal wiring.
