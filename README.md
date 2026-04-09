# ValidateAI — AI-Powered Startup Idea Validator

> "most startups fail. validate early."

A full-stack MVP that lets users submit startup ideas and receive a structured, AI-generated validation report — built with Next.js, Neon (PostgreSQL), and Google Gemini.

---

## Live Demo

> [https://your-deployment-url.vercel.app](https://your-deployment-url.vercel.app)

---

## Features

### Core
- Submit a startup idea (title + description) and receive a full AI validation report
- Dashboard to view all previously validated ideas
- Detail page for each report with clean structured formatting
- Delete ideas from dashboard with an inline confirmation toast (no browser alerts)
- Download any report as a PDF in light theme regardless of current UI theme

### AI Report Fields
Each report contains:
- **Problem** — specific pain being solved, not a generic observation
- **Target Customer** — 3 bullet points: who they are, their core pain, where to find them
- **Market Overview** — 3 bullet points: market size with source reference, growth trend, key insight
- **Competitors** — exactly 3 competitors with name and one-line differentiation
- **Suggested Tech Stack** — 4–6 technologies, each with a reason e.g. `Next.js (frontend)`
- **Risk Level** — Low / Medium / High
- **Profitability Score** — 0–100 integer
- **Justification** — 2–3 sentences explicitly referencing market data and competitor landscape

### UX Details
- Dark/light theme toggle via a hanging pendulum knob in the navbar
- Character counter on description input (warns at 900/1000)
- Inline error messaging for vague ideas, rate limits, and empty fields
- Loading state with a rotating startup quote while AI analyzes
- `resize: none` on textarea to keep layout clean

---

## Easter Eggs

| Location | Easter Egg |
|---|---|
| Hover the **ValidateAI** logo in navbar | Tooltip: *"most startups fail. validate early."* |
| While idea is being analyzed | Quote: *"the graveyard is full of ideas that never shipped."* |
| Empty dashboard | Quote: *"an idea not validated is just a wish."* |
| Footer | *"built with existential dread · 2025"* |
| Navbar knob | Pendulum physics on click — swings and settles |
| Text selection | Highlighted in `#f5c518` (yellow accent) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend + Backend | Next.js 16 (App Router) |
| Database | Neon (serverless PostgreSQL) |
| AI | Google Gemini (via `@google/generative-ai`) |
| Styling | Tailwind CSS + raw inline styles |
| Animation | Framer Motion (pendulum spring physics) |
| PDF Export | html2pdf.js |
| Icons | Lucide React |
| Deployment | Vercel + Neon |

---

## Architecture

This is a **monorepo** — frontend and backend live in the same Next.js project. There is no separate `/client` or `/server` folder by design.

```
/app
  /page.tsx                  → idea submission form
  /dashboard/page.tsx        → list of all ideas (server component)
  /ideas/[id]/page.tsx       → report detail page (server component)
  /api/ideas/route.ts        → POST (create) + GET (list)
  /api/ideas/[id]/route.ts   → GET (single) + DELETE
/lib
  /db.ts                     → Neon serverless client
  /ai.ts                     → Gemini API call + model fallback chain
/components
  /Navbar.tsx                → client component (handles hover + bulb)
  /BulbToggle.tsx            → pendulum knob, theme toggle, localStorage
  /DeleteButton.tsx          → client component, toast confirmation
  /DownloadReport.tsx        → html2pdf export, forces light theme for PDF
```

### Key Architecture Decisions

- **Server Components by default** — dashboard and report pages fetch directly from Neon without an API round-trip, reducing latency
- **Client Components only where needed** — `Navbar`, `BulbToggle`, `DeleteButton`, `DownloadReport` are the only client components, isolated to interactivity
- **JSONB storage** — the full AI report object is stored as `jsonb` in Neon, making it schema-flexible and queryable without migrations when the report structure evolves
- **No ORM** — raw SQL via Neon's tagged template literals keeps the codebase lean and readable

---

## Prompt Engineering

The AI prompt was designed with the following principles:

### 1. Persona + Tone Anchor
```
"You are an expert startup consultant with deep market research experience."
"Be critical and realistic, not optimistic."
```
Without the tone anchor, LLMs tend to be overly positive on every idea — which makes reports look fake and unhelpful.

### 2. Structured Output Enforcement
The prompt specifies exact field names, types, and formats for every field. Key examples:
- `'customer'` must be an array of exactly 3 strings — not a paragraph
- `'market'` must be an array of exactly 3 strings — with a source reference
- `'competitor'` must contain exactly 3 objects with `name` and `differentiation`
- `'profitability_score'` must be an integer between 0–100
- `'justification'` must explicitly reference the market data and competitors

### 3. Vagueness Detection
A `is_valid` boolean and `rejection_reason` field are requested before any analysis:
```
"If the idea is too vague, set 'is_valid' to false and 'rejection_reason' to 
a short message explaining what's missing."
```
This prevents the AI from hallucinating analysis for non-ideas like "app for everything".

### 4. Strict JSON Output
```
"Return ONLY raw JSON. No markdown, no backticks, no explanation."
```
Combined with `responseMimeType: "application/json"` in the Gemini SDK config and a regex extraction fallback (`text.match(/\{[\s\S]*\}/)`).

### 5. Model Fallback Chain
Gemini models occasionally return 503s under high demand. A fallback chain tries 5 models in priority order:
```typescript
const MODELS = [
  "gemini-flash-latest",
  "gemini-pro-latest",
  "gemini-2.5-flash-lite",
  "gemini-3-flash-preview",
  "gemini-3-pro-preview",
];
```
If one fails, the next is tried automatically — the user never sees a model error.

---

## Security

### Prompt Injection Prevention
User input is sanitized before being interpolated into the AI prompt. The `sanitize()` function strips known injection patterns:
```typescript
function sanitize(input: string): string {
  return input
    .replace(/```[\s\S]*?```/g, "")
    .replace(/ignore\s+(previous|above|all)\s+instructions?/gi, "")
    .replace(/system\s*prompt/gi, "")
    .replace(/you\s+are\s+now/gi, "")
    .trim();
}
```

### Rate Limiting
An in-memory rate limiter on the POST `/api/ideas` route restricts each IP to **5 requests per minute**:
```typescript
const rateLimit = new Map<string, { count: number; ts: number }>();
```
Returns HTTP 429 with a user-facing message if exceeded.

### Input Length Validation
Hard limits enforced before any AI call:
- Title: max 100 characters
- Description: max 1000 characters

### SQL Injection
Not applicable — Neon's tagged template literals are parameterized by default. No raw string interpolation in SQL queries.

### XSS
Not applicable — React escapes all rendered output by default. No `dangerouslySetInnerHTML` is used anywhere.

> **Note on auth:** Authentication was intentionally excluded from MVP scope. In a production build, NextAuth with session-scoped idea ownership would be the next step.

---

## Database Schema

```sql
CREATE TABLE ideas (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  report      JSONB,
  created_at  TIMESTAMP DEFAULT NOW()
);
```

---

## API Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/ideas` | Returns all ideas ordered by date |
| `POST` | `/api/ideas` | Accepts title + description, triggers AI, saves report |
| `GET` | `/api/ideas/:id` | Returns a single idea with full report |
| `DELETE` | `/api/ideas/:id` | Deletes an idea by ID |

---

## Environment Variables

Create a `.env.local` file in the root:

```env
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
GEMINI_API_KEY=your_gemini_api_key
```

Get your Gemini API key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) — free tier available.

---

## Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/Sejpal-Raghav/startup-validator.git
cd startup-validator

# 2. Install dependencies
npm install

# 3. Add environment variables
cp .env.local.example .env.local
# fill in DATABASE_URL and GEMINI_API_KEY

# 4. Create the database table
# Run this in your Neon SQL editor:
# CREATE TABLE ideas (
#   id SERIAL PRIMARY KEY,
#   title TEXT NOT NULL,
#   description TEXT NOT NULL,
#   report JSONB,
#   created_at TIMESTAMP DEFAULT NOW()
# );

# 5. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add `DATABASE_URL` and `GEMINI_API_KEY` in Vercel environment variables
4. Deploy — Vercel auto-detects Next.js

---

## Sample Test Case

**Title:** `HabitStack — AI-powered habit coach for remote workers`

**Description:**
```
Remote workers struggle with maintaining consistent daily routines without office 
structure. HabitStack uses AI to analyze a user's work schedule, energy patterns, 
and past habit data to suggest personalized micro-habits and sends smart nudges at 
optimal times. It integrates with calendar apps and tracks streaks, giving weekly 
AI-generated reports on productivity patterns.
```

---

## License

MIT