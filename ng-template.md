# Assignment: Meme Sharing App (Angular)

Build an internal text meme posting forum for employees. **No images/GIFs—**only text (one-liners, ASCII, "POV:" memes). Keep it fun, but production-grade.

## Guidelines:

- **No external API/network calls** (no HTTP, no assets fetch). Seed initial data in code on first run, then use `localStorage` only.
- **No routing** (no Angular Router). Use **modals/drawers** for all "navigation" (detail view, create/edit, confirmations).
- **CRUD must be through localStorage** (posts, likes, bookmarks, flags, preferences, drafts).
- Use any UI library (Material) but:
  - Page-level components must **NOT** directly use UI library components
  - Create **shared wrapper components** (e.g., `UiCard`, `UiButton`, `UiInput`, `UiTag`) and use only those in pages.

## Core screens (single-page app + modals)

### 1) Feed (main screen)

- Display posts with: **author, team, tags, mood, timestamp (relative time), optional title, body preview**
- Search: **case-insensitive, filters by title + body**
- Filters: **team, mood, tags (multi-select), saved-only**
- Sorting: **newest first, oldest first**
- Selecting a post opens **Post Detail modal/drawer**

### 2) Post Detail (modal/drawer)

- Show full post content + metadata
- Spoilers: `||spoiler text||`
  - collapsed by default
  - per-spoiler expand/collapse
  - expand all / collapse all
- Actions: **Like, Bookmark, Edit, Delete, Report/Flag**
- Sorting: **newest first, oldest first**
- "Copy link / share" action:
  - copies the post URL/token to clipboard (no Router required)

### 3) Post Composer (modal) — CRUD

- Create + Edit post
- Fields: **title (optional), body (required), tags (0..n), mood (you decide)**
- Validation: body must be trimmed non-empty
- Draft autosave + restore using `localStorage` (per user)

## 🗄️ Data & persistence (localStorage "DB")

Store and manage at minimum:

- **Current user**
- **Posts**
- **Likes** (per user per post)
- **Bookmarks/saved posts**
- **Flags** (reason/status)
- **Preferences** (sort, filters, saved-only)
- **Drafts** (new post + edit post)

Draft keys must survive reload and must not conflict:

- New post draft: `draft:<userId>:new`
- Edit post draft: `draft:<userId>:post:<postId>`

## Good to Have:

### Like feature

- Like must be **toggle-based** (no duplicate likes per user per post)
- Feed supports filtering to "liked by me" (optional)
