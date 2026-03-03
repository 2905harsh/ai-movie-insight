import { MovieData, SentimentResult } from "./types";


/**
 * Generates simulated audience review snippets based on IMDb rating and genre.
 * In a production app, these would be scraped from IMDb/Rotten Tomatoes.
 * We simulate them here to avoid scraping restrictions.
 */
function generateReviewContext(movie: MovieData): string {
  const rating = parseFloat(movie.imdbRating) || 5;
  const votes = movie.imdbVotes || "N/A";
  const genre = movie.Genre || "";
  const rtRating = movie.Ratings?.find((r) => r.Source === "Rotten Tomatoes")?.Value;
  const metascore = movie.Ratings?.find((r) => r.Source === "Metacritic")?.Value;

  return `
Movie: "${movie.Title}" (${movie.Year})
Genre: ${genre}
IMDb Rating: ${movie.imdbRating}/10 (based on ${votes} votes)
${rtRating ? `Rotten Tomatoes: ${rtRating}` : ""}
${metascore ? `Metacritic: ${metascore}` : ""}
Director: ${movie.Director}
Cast: ${movie.Actors}
Plot: ${movie.Plot}

Based on this data, analyze the likely audience reception and sentiment for this movie.
`.trim();
}

/**
 * Uses Claude AI to analyze movie data and generate a sentiment summary.
 * Returns a structured SentimentResult with summary, classification, themes, and score.
 */
export async function analyzeSentiment(movie: MovieData): Promise<SentimentResult> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("Groq API key is not configured. Set GROQ_API_KEY in your environment.");
  }

  const reviewContext = generateReviewContext(movie);

  const prompt = `You are a film critic analyst. Based on the following movie data, provide a concise audience sentiment analysis.

${reviewContext}

Respond with a JSON object (no markdown, no code fences) with exactly this structure:
{
  "summary": "2-3 sentence summary of overall audience reception and what viewers tend to praise or criticize",
  "classification": "positive" | "mixed" | "negative",
  "keyThemes": ["theme1", "theme2", "theme3"],
  "audienceScore": <number between 0-100>
}

Guidelines:
- classification should be "positive" if IMDb > 7.0, "negative" if < 5.5, otherwise "mixed"
- audienceScore should correlate with IMDb rating (e.g., 8.5 IMDb → ~85 score)
- keyThemes should reflect what audiences actually discuss about this specific film
- summary must be specific to THIS movie, not generic`;

  // Call Groq API directly via REST (OpenAI-compatible format)
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || "Groq API request failed.");
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("Empty response from Gemini API.");
  }

  try {
    // Strip any accidental markdown code fences before parsing
    const cleaned = text.replace(/```json|```/g, "").trim();
    const result: SentimentResult = JSON.parse(cleaned);

    // Validate the required fields exist
    if (!result.summary || !result.classification || !result.keyThemes || result.audienceScore === undefined) {
      throw new Error("Incomplete sentiment data in Groq response");
    }

    return result;
  } catch {
    throw new Error("Failed to parse sentiment analysis from Groq. Please try again.");
  }
}
