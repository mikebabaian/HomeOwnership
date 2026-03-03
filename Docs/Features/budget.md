# Feature: Budget Page – Monthly Expense Line Items (CRUD) + Totals (React + .NET + EF Core)

## Goal
Implement a **Budget** page that lets an authenticated user manage a list of **monthly expense line items** (electric, mortgage, water, etc.) with full CRUD:

- Add / Update / Delete monthly budget items
- Display **Total Monthly Expenses** at the top (sum of all items)
- Display **Monthly Take Home (Income)** from the user’s **Profile** *if configured*; if not configured, do not show it
- Persist budget items in the database per user

This feature should be small, incremental, and easy to validate locally and in Azure.

---

## Assumptions
- Auth is JWT with ASP.NET Core Identity and `[Authorize]`.
- `UserProfile` table exists and includes `MonthlyTakeHome` (nullable).
- There is already a `/budget` route and it is protected (only accessible when logged in).
- EF Core + SQL Server configured.
- Frontend has an API client wrapper that includes `Authorization: Bearer <token>`.

If any assumption differs, adapt while keeping deliverables.

---

## Deliverables

### Backend
1. Add EF Core entity + migration for `BudgetItem` table (per-user)
2. Add API endpoints for CRUD:
   - `GET    /api/budget/items`
   - `POST   /api/budget/items`
   - `PUT    /api/budget/items/{id}`
   - `DELETE /api/budget/items/{id}`
3. Add an endpoint (or reuse profile) to fetch monthly income for the header:
   - Option A: call existing `GET /api/profile` and read `monthlyTakeHome`
   - Option B: add `GET /api/budget/summary` returning `{ monthlyTakeHome, totalMonthlyExpenses }`
   - Prefer **Option A** if `GET /api/profile` already exists and is stable.

### Frontend
1. Budget page UI with:
   - Header summary: Total Monthly Expenses (always), Monthly Take Home (only if non-null)
   - List/table of expense items
   - Add new item form
   - Inline edit/update
   - Delete action with simple confirm
2. Everything reloads/updates totals after changes.

---

## Data Model

### Table: BudgetItem
A budget line item is **monthly** and belongs to a user.

**Fields**
- `Id` (int identity or GUID)
- `UserId` (string, required) FK to AspNetUsers.Id
- `Category` (string, required) e.g., "Utilities", "Housing", "Debt", "Insurance", "Other"
- `Name` (string, required) e.g., "Electric", "Mortgage", "Water"
- `Amount` (decimal, required) monthly amount in dollars
- `Notes` (string, optional)
- `SortOrder` (int, optional; default 0)
- `CreatedUtc` (DateTime)
- `UpdatedUtc` (DateTime)

**Constraints / Validation**
- `Amount >= 0`
- `Name` max length ~100
- Index on `UserId`

**Files**
- `Data/Entities/BudgetItem.cs`
- `Data/AppDbContext.cs`:
  - `DbSet<BudgetItem> BudgetItems`
  - model builder: index on UserId, required fields, decimal precision (e.g., 18,2)

**Migration**
- `AddBudgetItems`

---

## Backend API Contracts

### DTOs
- `BudgetItemDto`
- `CreateBudgetItemRequest`
- `UpdateBudgetItemRequest`

**BudgetItemDto**
```json
{
  "id": 1,
  "category": "Utilities",
  "name": "Electric",
  "amount": 150.00,
  "notes": "",
  "sortOrder": 0
}