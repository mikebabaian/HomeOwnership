# Feature: Dashboard Welcome Header + “Top 3 Lowest Mortgage Rates” Card

## Goal
Enhance the Dashboard with:
1) A **Welcome** header that greets the user by name and summarizes their month (remaining vs in the red).
2) A **Top 3 Lowest Mortgage Rates** card populated from a backend endpoint that pulls rates from an external provider (or a provider stub with a clean interface so we can swap APIs later).

This should fit visually with the existing Dashboard layout (Monthly Snapshot + Concierge).

---

## Part 1: Welcome Header (Frontend)

### Requirements
Add a header section above the Dashboard content.

**Left side**
- Title: `Welcome back, {DisplayName}`
- Subtitle: 1-line monthly summary:
  - If income exists and remaining >= 0:
    - `You have {Remaining} left after expenses this month.`
  - If income exists and remaining < 0:
    - `You're {Overage} over budget this month.`
  - If income is not set:
    - `Set Monthly Take Home in Profile to see your monthly snapshot.`

**Right side (Quick Actions)**
- Button: `Update Profile` → `/profile`
- Button: `Add Budget Item` → `/budget` (scroll to add section if applicable)

### DisplayName rules
Use in this order:
1) `UserProfile.MessageBoardUserName` if set
2) else Identity username (or email prefix) returned from an API call (see Backend section)

### Styling guidance
- Keep it clean and modern:
  - Card-like header or full-width section with subtle background
  - Clear typography hierarchy (title + muted subtitle)
  - Optional small icon next to title
- Include a small green badge when positive (✓ On track) and red badge when negative (⚠ In the red).

---

## Part 2: Top 3 Lowest Mortgage Rates (Backend + Frontend)

## Key decision (MVP-friendly)
Mortgage-rate APIs are often paid or inconsistent. Implement a provider abstraction and ship with:
- A **configurable external provider** (HTTP client) if an endpoint is available
- A **fallback stub provider** (mock data) when no API key/provider is configured

This keeps progress moving without blocking on picking a vendor.

---

## Backend

### New endpoint
Create an authenticated endpoint:

`GET /api/market/mortgage-rates/top?termYears=30&rateType=fixed&count=3`

Response:
```json
{
  "asOfUtc": "2026-03-03T00:00:00Z",
  "termYears": 30,
  "rateType": "fixed",
  "items": [
    {
      "lender": "Example Credit Union",
      "apr": 6.25,
      "rate": 6.125,
      "points": 0.0,
      "notes": "Estimated. See lender for final pricing.",
      "source": "ProviderName",
      "url": "https://..."
    }
  ]
}