# Task 1 — Leaderboard: Approach Report

## Overview

This report describes how I built the leaderboard application using AI-assisted development inside Cursor IDE.

---

## Tools and Technologies Used

| Tool / Library | Purpose |
|---|---|
| **Cursor IDE + Claude** | Primary development environment; all code was generated through AI prompting — no code was written manually |
| **Vite + React + TypeScript** | Application framework — fast static build, strong typing |
| **Tailwind CSS v4** | Utility-first styling to match the original layout precisely |
| **Lucide React** | Icon library (Star, Monitor, Search, ChevronDown icons) |

---

## Prompting Approach

The workflow was fully screenshot-driven:

1. **UI analysis** — Provided the original leaderboard screenshot to the AI along with specific color tokens (`#ebebed` body, `#0f172a` primary text, `#64748b` secondary text). The AI identified every UI element: header, filter bar, podium section with three winner cards, and an expandable ranked list.

2. **Iterative component planning** — Before writing any code, I asked the AI to produce a structured plan breaking the work into discrete steps (scaffold → types/data → filters → podium → list → layout → report). The plan was confirmed before execution began.

3. **Component-by-component generation** — Each component (`Filters`, `Podium`, `LeaderboardItem`, `LeaderboardList`, `Avatar`) was generated in a single prompt with full context from the screenshot and the agreed design spec. The AI resolved TypeScript strict-mode issues (e.g. `import type` requirements) autonomously between build cycles.

4. **Build verification** — `npm run build` was used after each batch of changes to catch and fix compilation errors immediately.

---

## Data Replacement Strategy

The original leaderboard contains real employee names, job titles, department codes, and scores. To comply with responsible AI usage policy:

- **No real employee data was ever provided to the AI.** The screenshot shared with the AI only revealed the UI structure (layout, field labels marked as "NDA NAME" / "NDA POSITION"), not any actual personal data.

- **Replacement data:** All employee entries were replaced with characters from the *Naruto* anime franchise (e.g. Naruto Uzumaki, Sasuke Uchiha, Sakura Haruno). These are fictional characters with no connection to real individuals.

- **Synthetic scores and metadata:** Scores, presentation counts, years, quarters, and department codes (LEAF, HAWK, SAND, DARK, YOUTH, MIST) were invented to reflect the structure of a typical company leaderboard while bearing no resemblance to actual company data. Department codes correspond to ninja villages from the anime.

- **Categories:** Replaced with Naruto skill categories (Ninjutsu, Taijutsu, Genjutsu, Medical) — functionally equivalent to the original filter categories without exposing any real taxonomy.

---

## Application Features

- **Podium section** — Top 3 performers displayed on a gold/silver/bronze podium with avatar rings, rank badges, and score chips.
- **Ranked list** — Filtered performers shown in the list with expandable activity details; rank numbers remain stable and always reflect the canonical leaderboard order for the active Year/Quarter/Category filters (search does not renumber ranks).
- **Filters** — Year, Quarter, and Category dropdowns plus a search box; search activates only when at least 2 characters are entered.
- **Fully static** — No backend, no SSO integration; all data is hardcoded in `src/data/employees.ts`.

---

## Functional Behavior Updates (Post-UI Pass)

- **Search-aware podium visibility**  
  - Podium winners are computed from non-search filters (Year/Quarter/Category) to prevent non-winners from being promoted by search.
  - When search is active, podium shows only winners that are present in current search results.
  - If search results contain no winners, the podium is hidden.

- **Winner rank integrity during search**  
  - Winner cards keep their original rank labels (`1`, `2`, `3`) even when only a subset of winners matches search.
  - Example: if only the original #2 winner matches search, only one podium card is shown and it remains rank `2`.

- **Adaptive podium layout**  
  - Podium content is centered when only one or two winner cards are visible.
  - Existing three-winner layout is preserved when all winner cards are shown.
