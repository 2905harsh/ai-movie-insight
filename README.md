# CineInsight — AI Movie Insight Builder

A full-stack Next.js application that takes an IMDb movie ID and returns rich movie details combined with AI-generated audience sentiment analysis powered by Claude.

---

## Features

- **Movie Details** — Fetches title, poster, cast, release year, rating, runtime, genres, and plot from OMDB API
- **AI Sentiment Analysis** — Uses Claude AI to generate an audience sentiment summary, overall classification (positive/mixed/negative), key themes, and audience score
- **Beautiful UI** — Cinematic dark theme with smooth animations, responsive on all devices
- **Input Validation** — Full client and server-side IMDb ID validation with clear error messages
- **Loading States** — Progressive loading with skeleton screens per stage (movie fetch → sentiment analysis)

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14 (App Router) | Server-side API routes + React frontend in one project; eliminates separate Node.js server; Vercel deployment is trivially simple |
| Language | TypeScript | Type safety across API boundaries reduces runtime bugs; better IDE support during development |
| Styling | Tailwind CSS | Utility-first approach speeds up iteration; no CSS file switching; responsive design is declarative |
| Movie Data | OMDB API | Free tier available; reliable REST API for IMDb data; returns structured JSON with poster, cast, ratings |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) | Reliable structured JSON output; nuanced understanding of film reception context |
| Deployment | Vercel | Native Next.js support; free tier; environment variables handled securely; zero-config CI/CD from GitHub |

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- OMDB API key (free at [omdbapi.com](https://omdbapi.com))
- Anthropic API key (free tier at [console.anthropic.com](https://console.anthropic.com))

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-movie-insight.git
cd ai-movie-insight
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your API keys:

```env
OMDB_API_KEY=your_omdb_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Run tests

```bash
npm test
```

---

## Deployment to Vercel

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import your repository
3. In **Environment Variables**, add:
   - `OMDB_API_KEY` = your OMDB key
   - `ANTHROPIC_API_KEY` = your Anthropic key
4. Click **Deploy** — done!

---

## API Routes

### `GET /api/movie?id={imdbId}`

Fetches movie details from OMDB.

**Example:** `GET /api/movie?id=tt0133093`

**Response:**
```json
{
  "Title": "The Matrix",
  "Year": "1999",
  "imdbRating": "8.7",
  "Actors": "Keanu Reeves, Laurence Fishburne, ...",
  "Plot": "...",
  "Poster": "https://...",
  ...
}
```

### `POST /api/sentiment`

Analyzes audience sentiment using Claude AI.

**Body:** Movie data object (from `/api/movie`)

**Response:**
```json
{
  "summary": "Audiences have praised The Matrix for...",
  "classification": "positive",
  "keyThemes": ["Visual effects", "Philosophical depth", "Action choreography"],
  "audienceScore": 87
}
```

---

## Assumptions

1. **Reviews source**: IMDb does not provide a public API for user reviews. Rather than scraping (fragile, against ToS), I use Claude to generate a sentiment analysis based on publicly available aggregate ratings (IMDb score, Rotten Tomatoes, Metacritic) and the movie's metadata. This is more reliable and production-safe.

2. **IMDb ID format**: IDs must start with `tt` followed by 7-8 digits. Both 7-digit (`tt0133093`) and 8-digit (`tt12345678`) IDs are supported.

3. **Poster images**: Served from `m.media-amazon.com` via Next.js Image optimization. Movies without a poster show a placeholder.

4. **API rate limits**: OMDB free tier allows 1,000 requests/day. Movie data is cached for 1 hour via Next.js `revalidate`. Claude API calls are not cached (each analysis is unique).

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── movie/route.ts       # OMDB movie fetcher
│   │   └── sentiment/route.ts   # Claude sentiment analyzer
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # Main UI
├── components/
│   ├── SearchBar.tsx
│   ├── MovieCard.tsx
│   ├── SentimentCard.tsx
│   └── LoadingSkeleton.tsx
├── lib/
│   ├── omdb.ts                  # OMDB API client
│   ├── sentiment.ts             # Claude AI client
│   ├── types.ts                 # TypeScript interfaces
│   └── utils.ts                 # Validation helpers
└── __tests__/
    └── utils.test.ts            # Unit tests
```
