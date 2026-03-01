Goal:
Add a .NET backend to my existing static React app with minimal disruption, clean structure, and a working local/dev + deployment story.

Current state:
- Frontend: [CRA/Vite/Next static export], located at [path]
- Hosting: [Azure Static Web Apps / other]
- Current workflows: [GitHub Actions/Azure DevOps] at [path]
- API usage today: [none / fetch/axios], files: [list]
- First backend features needed: 
  1) [feature #1]
  2) [feature #2]

Decisions:
- Backend: .NET 10
- API style: [Minimal APIs or Controllers]
- Database: [none for now / SQLite local + Azure SQL later]
- Auth: [none now / email-pass / Azure AD / etc.]
- No mandatory Docker. Keep local setup simple.

Constraints:
- Do not refactor the whole frontend.
- Keep changes incremental and PR-friendly.
- Provide a short README with exact steps.
- Add tests (xUnit + at least one integration test).
- Avoid “big framework” choices unless necessary.

Deliverables:
1) Create backend project at [src/api/YourApp.Api]
2) Implement /api/health and /api/version
3) Configure CORS for local dev
4) Add frontend api client wrapper and wire it to call /api/version
5) Update deployment config for [SWA or single host], including routes/proxy
6) Add tests and ensure they run in CI
7) Provide a checklist of what changed and why

Repo context:
- Include these files: package.json, [vite config], src/, workflows yaml, README
- Ignore: node_modules, build artifacts, any large unrelated folders