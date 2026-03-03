# Feature: Authenticated Navigation + Dashboard Redirect (React)

## Goal
Add a frontend feature that changes navigation + routing behavior based on whether the user is authenticated.

When authenticated:
- Add a **Dashboard** menu item.
- Redirect to **Dashboard** after successful login.
- **Dashboard replaces Home** as the primary nav item (i.e., Home should not show in the main nav for authenticated users).
- Add nav links for:
  - **Community**
  - **Budget**
- Dashboard/Community/Budget pages can be blank placeholders for now.

When not authenticated:
- Keep existing public navigation behavior (Home is still the primary nav item).
- Login/Register remain available as they are today.

This feature is frontend-only (assumes the API login works and returns a JWT token).

---

## Assumptions / Existing Context
- There is already a Login page and it calls the API endpoint (or will shortly).
- API returns an `accessToken` (JWT) on successful login.
- Token is stored in `localStorage` (or equivalent) under a single known key.

If the current project uses a different pattern (cookies, session, etc.), adapt accordingly but keep the same UI/behavior requirements.

---

## Requirements

### Authentication State
Implement a simple auth state that answers:
- `isAuthenticated: boolean`
- `getToken(): string | null`
- `setToken(token: string): void`
- `clearToken(): void`

Source of truth can be `localStorage` for now.

#### Token Storage
- Storage key: `ownwell_access_token`
- Read token at app start and whenever navigation renders.

---

## Routing
### Routes to add (placeholders)
Add these routes/pages if they do not exist:
- `/dashboard` → `DashboardPage` (blank placeholder)
- `/community` → `CommunityPage` (blank placeholder)
- `/budget` → `BudgetPage` (blank placeholder)

### Protected routes
- `/dashboard`, `/community`, `/budget` should be protected:
  - If not authenticated, redirect to `/login`
  - Preserve the intended destination in state/query if the app already does that (optional)

---

## Navigation Behavior
### Public (not authenticated)
Nav should show the existing items, including:
- Home (primary)
- About (if you have it)
- Register
- Sign In

### Authenticated
Nav should show:
- Dashboard (primary)
- Community
- Budget
- (Optional but recommended) Sign Out

**Home should not appear in the main nav** while authenticated.

---

## Login Flow Changes
On successful login:
1. Store the returned JWT into `localStorage` using `ownwell_access_token`
2. Update any in-memory auth state (if used)
3. Redirect the user to `/dashboard`

If login fails:
- Do not redirect
- Show a simple error message

---

## Implementation Tasks

### 1) Add placeholder pages
Create components/pages:
- `src/pages/DashboardPage.tsx`
- `src/pages/CommunityPage.tsx`
- `src/pages/BudgetPage.tsx`

Each page can render:
- Page title (H1)
- A short “Coming soon” line

No other functionality required.

### 2) Add auth utility
Create:
- `src/auth/auth.ts`

Functions:
- `getToken()`
- `isAuthenticated()` (true if token exists)
- `setToken(token)`
- `clearToken()`

Also export `TOKEN_KEY = "ownwell_access_token"`.

### 3) Add a ProtectedRoute wrapper
If using React Router v6:
- `src/routes/ProtectedRoute.tsx`

Behavior:
- If authenticated: render children (or an `<Outlet />`)
- If not authenticated: `<Navigate to="/login" replace />`

### 4) Wire routes
Update router configuration to include:
- Public routes (existing)
- Protected routes: `/dashboard`, `/community`, `/budget`

Example behavior:
- If app currently uses `/` as Home, keep it.
- Do not remove Home route; just hide it from authenticated nav.

### 5) Update Navigation component
Update the header/nav component to render links based on auth state:

- If `isAuthenticated()`:
  - Dashboard
  - Community
  - Budget
  - Sign Out (optional but recommended)
- Else:
  - Home
  - About Us (if present)
  - Register
  - Sign In

Ensure:
- The selected state/highlight works for Dashboard in place of Home when authenticated.

### 6) Add Sign Out (recommended)
Add a Sign Out menu item when authenticated:
- On click:
  - `clearToken()`
  - redirect to `/` (Home) or `/login` (pick one; default `/`)

### 7) Update Login page behavior
Modify Login page so that on success:
- `setToken(accessToken)`
- navigate to `/dashboard`

Do not do any additional refactors.

---

## Acceptance Criteria
- [ ] Unauthenticated user sees Home in the nav, not Dashboard
- [ ] Authenticated user sees Dashboard/Community/Budget in the nav, not Home
- [ ] Navigating to `/dashboard` unauthenticated redirects to `/login`
- [ ] Successful login stores token and redirects to `/dashboard`
- [ ] Dashboard/Community/Budget pages render without errors (placeholders OK)
- [ ] Optional: Sign Out clears token and returns user to public nav

---

## Guardrails
- Keep this change small and PR-friendly.
- No new UI frameworks required.
- Do not redesign the header; just adjust links and routing logic.
- Do not implement refresh tokens or advanced auth flows in this pass.