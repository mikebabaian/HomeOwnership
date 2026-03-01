# Feature: Identity Auth (ASP.NET Core Identity + EF Core) with React Registration/Login

## Goal
Implement a working authentication backend using ASP.NET Core Identity + EF Core and wire the existing React **Registration** and **Login** pages to it.

- Registration page UI exists but must call the API.
- Login page UI must add **username** + **password** fields and call the API.
- Provide a simple, reliable SPA auth flow using **JWT access tokens**.
- Keep changes incremental and easy to verify locally.

## Assumptions
- Backend is ASP.NET Core (.NET 8 preferred).
- EF Core is used and a DB connection exists (SQL Server/Postgres/SQLite).
- React app already has routes/pages for Register and Login.

If any of these assumptions are wrong, adjust the implementation but keep the same deliverables.

---

## Deliverables
1. Add Identity + EF Core persistence to the API.
2. Create auth endpoints:
   - `POST /api/auth/register`
   - `POST /api/auth/login`
   - `GET /api/auth/me`
3. Configure JWT authentication in the API.
4. Update React:
   - Registration page calls `/api/auth/register`
   - Login page has username + password inputs and calls `/api/auth/login`
   - Store JWT and attach it to subsequent API calls
   - Add a small auth helper (api client + token handling)
5. Add minimal tests (optional if time permits):
   - Integration test for register/login happy path.

---

## Backend Implementation Steps

### 1) Add packages
Install these packages in the API project:

- `Microsoft.AspNetCore.Identity.EntityFrameworkCore`
- `Microsoft.EntityFrameworkCore`
- `Microsoft.EntityFrameworkCore.Design`
- DB provider package:
  - SQL Server: `Microsoft.EntityFrameworkCore.SqlServer`
  - Postgres: `Npgsql.EntityFrameworkCore.PostgreSQL`
  - SQLite: `Microsoft.EntityFrameworkCore.Sqlite`
- JWT:
  - `Microsoft.AspNetCore.Authentication.JwtBearer`
  - `System.IdentityModel.Tokens.Jwt`

### 2) Create Identity DbContext
Create `ApplicationUser` and `AppDbContext`.

**Files**
- `Domain/Auth/ApplicationUser.cs`
- `Infrastructure/Data/AppDbContext.cs`

**ApplicationUser**
- Inherit from `IdentityUser`
- No custom fields required yet (keep it minimal)

**AppDbContext**
- Inherit from `IdentityDbContext<ApplicationUser>`
- Use existing DB connection string
- Ensure migrations can run

### 3) Configure Identity + EF Core in Program.cs
Update DI and middleware.

**Program.cs**
- Configure DbContext:
  - `builder.Services.AddDbContext<AppDbContext>(...)`
- Configure Identity:
  - `builder.Services.AddIdentityCore<ApplicationUser>(options => { ... })`
  - Add roles only if needed. Keep minimal.
  - Add EF stores:
    - `.AddEntityFrameworkStores<AppDbContext>()`
    - `.AddSignInManager()`
- Configure password policy (reasonable defaults):
  - min length 8
  - require digit + uppercase is ok, but do not make it too strict for MVP

### 4) Add JWT config
Add config values to `appsettings.json`:

```json
{
  "Jwt": {
    "Issuer": "OwnWell",
    "Audience": "OwnWell",
    "Key": "REPLACE_WITH_LONG_RANDOM_SECRET_AT_LEAST_32_CHARS",
    "ExpiresMinutes": 60
  }
}