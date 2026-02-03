# Home Owner Steward — Technical Specs (v0.1)
*React PWA starter (static) with a clear path to a future .NET backend.*

---

## Goals (Phase 0 / Barebones)
- Create a **React.js** web app that runs as a **PWA** (installable, offline-capable shell).
- Keep it **static-only** for now (no backend dependency).
- Establish a clean foundation for future integration with a **.NET backend API**.
- Provide a minimal UI with basic styling so we can quickly iterate.

---

## Non-Goals (Phase 0)
- Authentication / user accounts
- Data persistence (beyond local storage if needed later)
- Payments / subscriptions
- Contractor marketplace implementation
- Real estate agent matching logic
- Complex state management

---

## Tech Stack (Phase 0)
- **Frontend:** React (TypeScript preferred)
- **Build tooling:** Vite (recommended) or Create React App (acceptable)
- **PWA:** `vite-plugin-pwa` (recommended) or Workbox (if CRA)
- **Styling:** CSS Modules or plain CSS (keep simple); optionally Tailwind later
- **Routing:** React Router (optional in Phase 0; recommended to scaffold routes)
- **Testing:** optional (Vitest + React Testing Library later)

---

## App Identity
- **App name:** Home Owner Steward
- **Short name:** Steward
- **Theme color:** TBD (set a placeholder)
- **Background color:** TBD (set a placeholder)
- **Icons:** placeholder icons acceptable for v0.1
- **Display mode:** standalone (PWA install behavior)

---

## PWA Requirements (Phase 0)
1. **Web App Manifest**
   - name: "Home Owner Steward"
   - short_name: "Steward"
   - start_url: "/"
   - display: "standalone"
   - orientation: "portrait" (optional)
   - icons: at least 192x192 and 512x512
2. **Service Worker**
   - Cache the app shell for offline access:
     - `index.html`
     - JS/CSS bundles
     - icons/manifest
   - Basi
