# DevDNA

> Decode any developer's GitHub DNA — analytics, visualizations, and AI-powered insights from public GitHub activity.

DevDNA turns a GitHub username into a living developer profile: a weighted developer score, language breakdowns, repository growth timelines, project categories, and AI-generated insights.

## Features

- **GitHub profile analysis** — profile, repositories, stars, forks, languages, and activity.
- **Analytics engine** — totals, language percentages, most active repos, growth & tech-evolution timelines, project categorization, and a 0–100 developer score.
- **AI insights** — narrative summary, highlights, and recommendations powered by Google Gemini, with a deterministic rule-based fallback.
- **Modern dashboard** — profile overview, animated score gauge, language & category charts, growth timeline, repo cards, and an insights panel.
- **Caching** — results are stored in the database with a configurable TTL to avoid repeated GitHub API calls; manual refresh is supported.

## Tech Stack

**Frontend:** React + Vite, React Router, Material UI, Recharts, Framer Motion, native `fetch`
**Backend:** Node.js, Express, Sequelize ORM, MySQL/MariaDB, GitHub REST + GraphQL APIs, Google Gemini

## Architecture

Clean, layered separation — thin controllers, all logic in services, GitHub access isolated behind a single service.

```
client/                     server/
├── src/                    ├── src/
│   ├── pages/              │   ├── config/       env + Sequelize
│   ├── components/         │   ├── controllers/  thin request handlers
│   ├── services/  fetch    │   ├── routes/
│   ├── hooks/              │   ├── services/     github, analytics, insights, cache, orchestrator
│   └── utils/              │   ├── models/       UserProfile, Repository, Analysis
│                           │   ├── middleware/   errors, rate limit
│                           │   └── utils/
```

## Getting Started

### Prerequisites

- Node.js >= 18
- MySQL or MariaDB running locally
- A Google Gemini API key (optional — falls back to rule-based insights)
- A GitHub personal access token (optional — raises rate limits and enables precise language stats)

### 1. Database

```bash
mysql -h 127.0.0.1 -u root -p -e "CREATE DATABASE devdna;"
```

### 2. Backend

```bash
cd server
cp .env.example .env   # fill in DB creds, GEMINI_API_KEY, GITHUB_TOKEN
npm install
npm run dev            # http://localhost:4000
```

### 3. Frontend

```bash
cd client
npm install
npm run dev            # http://localhost:5173
```

Or from the repo root: `npm run install:all` then `npm run dev` (runs both).

## Environment Variables (`server/.env`)

| Variable | Description |
| --- | --- |
| `PORT` | API port (default `4000`) |
| `CLIENT_ORIGIN` | Allowed CORS origin (default `http://localhost:5173`) |
| `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USER` / `DB_PASSWORD` / `DB_DIALECT` | Database connection |
| `GITHUB_TOKEN` | GitHub PAT (optional) |
| `GEMINI_API_KEY` / `GEMINI_MODEL` | Google Gemini config (optional) |
| `CACHE_TTL_MINUTES` | How long an analysis stays fresh (default `360`) |

## API

### `POST /api/analyze`

```json
{ "username": "torvalds", "refresh": false }
```

Returns `{ cached, profile, repositories, analytics }`, where `analytics` includes `score`, `metrics`, `languageStats`, and `insights`.

### `GET /api/health`

Simple readiness check.

## Production

```bash
npm run build                 # builds client into client/dist
NODE_ENV=production npm start  # server serves the API and the built client
```

## License

MIT
