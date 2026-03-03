# Feature: Authenticated Profile + UserProfile Table (ASP.NET Core + EF Core + React)

## Goal
Create a **Profile** page that is only accessible when logged in, and persist the profile data in a new EF Core table named **UserProfile**.

Profile fields:
- **Message Board User Name** (required once set, cannot be changed or cleared after first save)
- Current Mortgage Rate
- Current Home Owner's Insurance cost
- Monthly Take Home
- Current mortgage balance

The Profile page should:
- Load the current user’s profile (if it exists)
- Allow create/update of editable fields
- Enforce Message Board User Name immutability after it has been set the first time
- Save to the API, backed by the new `UserProfile` table

---

## Assumptions
- Backend uses ASP.NET Core Identity with JWT auth already working.
- Backend uses EF Core with a SQL database configured.
- Frontend uses React Router and already has authenticated-only routes (Dashboard/Community/Budget pattern).
- Token is stored in localStorage (or equivalent) and added as `Authorization: Bearer <token>`.

If any assumption differs, adapt but keep deliverables/behavior.

---

## Deliverables
### Backend
1. Add EF Core entity + migration for `UserProfile`
2. Add API endpoints:
   - `GET  /api/profile`
   - `PUT  /api/profile` (upsert)
3. Enforce:
   - Profile belongs to the authenticated user
   - `MessageBoardUserName` cannot be changed once set

### Frontend
1. Add protected route + nav link:
   - `/profile`
2. Create Profile page with form fields and Save action
3. Implement load-on-mount and save via API
4. Message Board User Name:
   - Editable when empty
   - Read-only/disabled once saved (with UI hint)

---

## Data Model (EF Core)

### Table: UserProfile
Create a new entity `UserProfile` with a 1:1 relationship to Identity user.

**Entity fields**
- `Id` (PK, int or GUID)
- `UserId` (string, required, unique)  // FK to AspNetUsers.Id
- `MessageBoardUserName` (string, nullable initially; once set becomes immutable)
- `CurrentMortgageRate` (decimal?, store as percent value like 6.75)
- `HomeOwnersInsuranceMonthly` (decimal?)  // choose monthly to avoid ambiguity
- `MonthlyTakeHome` (decimal?)
- `CurrentMortgageBalance` (decimal?)
- `CreatedUtc` (DateTime)
- `UpdatedUtc` (DateTime)

**Constraints**
- Unique index on `UserId` (enforces 1:1)
- Optional: MaxLength(50) for MessageBoardUserName

**Files**
- `Data/Entities/UserProfile.cs`
- `Data/AppDbContext.cs` updates:
  - `DbSet<UserProfile> UserProfiles`
  - model builder config for unique index + FK relationship

**Migration**
- Add migration: `AddUserProfile`
- Apply to DB

---

## Backend API

### Auth requirement
All endpoints require `[Authorize]` (or equivalent in minimal endpoints).

Get authenticated user id from claims:
- `User.FindFirstValue(ClaimTypes.NameIdentifier)` (or `sub` depending on token claims)
Use the same method consistently across the API.

### Contracts (DTOs)
Create DTOs (location consistent with your project structure):
- `ProfileResponse`
- `UpsertProfileRequest`

**ProfileResponse**
```json
{
  "messageBoardUserName": "someName",
  "currentMortgageRate": 6.75,
  "homeOwnersInsuranceMonthly": 210.50,
  "monthlyTakeHome": 5200.00,
  "currentMortgageBalance": 248000.00
}