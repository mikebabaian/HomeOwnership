# Feature: Community Message Board (Threads + Replies, cross-user) with Profile Username Gate

## Goal
Build a simple **message board** on the **Community** page where:
- Messages/threads are **visible across all users**
- Authenticated users can:
  - Start a new thread
  - Reply to any existing thread
  - Reply within their own thread as well
- Posting is **blocked** unless the user has configured **MessageBoardUserName** in `UserProfile`
  - If not configured, show a friendly notice: “Set your Message Board username in Profile to post.”

Keep this MVP clean and minimal: thread list + thread detail + reply box.

---

## Assumptions
- Auth is JWT + Identity.
- `UserProfile` exists and includes `MessageBoardUserName` (immutable once set).
- Frontend has protected routes; `/community` is protected (logged-in only).
- EF Core + SQL database configured.

If Community should be readable without login, implement read-only public access but keep posting gated behind auth + username.

---

## Deliverables

### Backend
1. Add tables:
   - `MessageThread`
   - `MessagePost` (replies; includes original thread starter post too or separate “first post” model)
2. Add endpoints:
   - Read:
     - `GET /api/community/threads` (paged)
     - `GET /api/community/threads/{threadId}` (thread + posts)
   - Write (requires auth + profile username):
     - `POST /api/community/threads` (create thread)
     - `POST /api/community/threads/{threadId}/posts` (reply)
3. Enforce:
   - Posts require authenticated user
   - Posts require `UserProfile.MessageBoardUserName` to be set (non-empty)
   - Thread + posts visible to all users

### Frontend
1. Community page UI:
   - Thread list
   - “Start a thread” form (disabled/hidden with notification if username not set)
   - Thread detail view with posts + reply box (reply disabled/hidden with same notification)
2. Show author name as the user’s `MessageBoardUserName` stored at time of posting.

---

## Data Model (EF Core)

### Table: MessageThread
Represents a discussion thread.

Fields:
- `Id` (int identity or GUID)
- `Title` (string, required, max 200)
- `CreatedUtc` (DateTime)
- `UpdatedUtc` (DateTime)
- `CreatedByUserId` (string, required)
- `CreatedByDisplayName` (string, required)  // snapshot from UserProfile.MessageBoardUserName

Indexes:
- Index on `UpdatedUtc` (for ordering)
- Index on `CreatedByUserId` (optional)

### Table: MessagePost
Represents a post within a thread (including replies).

Fields:
- `Id` (int identity or GUID)
- `ThreadId` (FK to MessageThread.Id, required)
- `Body` (string, required, max 4000)
- `CreatedUtc` (DateTime)
- `CreatedByUserId` (string, required)
- `CreatedByDisplayName` (string, required) // snapshot at time of posting

Indexes:
- Index on `ThreadId`, `CreatedUtc`

Notes:
- Store `CreatedByDisplayName` as a snapshot so if display name is immutable later, it’s still consistent.
- Do NOT join to UserProfile at read time for author name; use snapshot.

### DbContext
Add:
- `DbSet<MessageThread> MessageThreads`
- `DbSet<MessagePost> MessagePosts`

Migration:
- `AddCommunityMessageBoard`

---

## Backend API Contracts

### Thread summary
`ThreadSummaryDto`
```json
{
  "id": 1,
  "title": "How are you budgeting for repairs?",
  "createdUtc": "2026-03-02T00:00:00Z",
  "updatedUtc": "2026-03-02T00:00:00Z",
  "createdByDisplayName": "MikeB",
  "replyCount": 3,
  "lastPostUtc": "2026-03-02T00:00:00Z"
}