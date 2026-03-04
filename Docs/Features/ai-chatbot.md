# Feature: “Home Owner Concierge” Chat Panel on Dashboard (React + .NET API + LLM)

## Goal
Add a chat experience to the **Dashboard** called **Home Owner Concierge** that:
- Fits nicely alongside the existing **Monthly Snapshot** dashboard content
- Greets the user and asks what they’re trying to do today related to home ownership:
  - savings, budget, home upkeep, general questions
- Lets the user ask questions and receive answers from an LLM (start with OpenAI Chat Completions as the default)
- Feels like a helpful home-ownership assistant (practical, friendly, action-oriented)

This is an MVP: single chat thread per user, saved history, basic safety/guardrails, clean UI.

---

## High-Level UX
Dashboard layout:
- Left (or top): Monthly Snapshot + rates cards (existing)
- Right (or below): Concierge chat card/panel

Chat panel requirements:
- Title: **Home Owner Concierge**
- Intro message (assistant) on first load:
  - “What are you trying to do today with your home: save more, manage your budget, plan upkeep, or ask a question?”
- Message list with user + assistant bubbles
- Input bar fixed to bottom of the card:
  - textbox + send button
  - Enter sends
  - Shows “thinking…” while waiting
- Max height with scroll, looks modern and tidy

---

## Backend Requirements (.NET)

### 1) Secrets / Configuration
Add settings (Azure App Service configuration):
- `OpenAI__ApiKey` (secret)
- `OpenAI__Model` (default: `gpt-4o-mini` or equivalent available in your environment)
- Optional:
  - `OpenAI__BaseUrl` (only if needed)
  - `OpenAI__Organization` (only if needed)

DO NOT expose the API key to the frontend.

### 2) Data Storage (Chat History)
Create a new table to store messages per user.

#### Table: ConciergeMessage
Fields:
- `Id` (int identity or GUID)
- `UserId` (string, required)  // Identity user id
- `Role` (string, required)     // "system" | "user" | "assistant"
- `Content` (string, required)  // message text
- `CreatedUtc` (DateTime, required)

Indexes:
- Index on `UserId`, `CreatedUtc`

Migration:
- `AddConciergeMessages`

Notes:
- For MVP, store a single ongoing conversation per user (no separate “thread id”).
- Keep message content plain text.

### 3) API Endpoints
All endpoints require `[Authorize]`.

#### GET /api/concierge/history
Returns recent messages for the authenticated user (most recent last).
- Query params:
  - `limit` (default 30, max 100)

Response:
```json
{
  "messages": [
    { "role": "assistant", "content": "Welcome...", "createdUtc": "..." },
    { "role": "user", "content": "How do I budget for a roof?", "createdUtc": "..." }
  ]
}