import { NextRequest, NextResponse } from "next/server";
import { analyzeSentiment } from "@/lib/sentiment";
import { MovieData } from "@/lib/types";

/**
 * POST /api/sentiment
 * Accepts movie data in the request body and returns AI-generated sentiment analysis.
 */
export async function POST(request: NextRequest) {
  let movie: MovieData;

  try {
    movie = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body. Expected JSON movie data." },
      { status: 400 }
    );
  }

  // Basic validation - ensure we have a movie title at minimum
  if (!movie?.Title || !movie?.imdbID) {
    return NextResponse.json(
      { error: "Movie data is incomplete. Title and IMDb ID are required." },
      { status: 400 }
    );
  }

  try {
    const sentiment = await analyzeSentiment(movie);
    return NextResponse.json(sentiment);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sentiment analysis failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
