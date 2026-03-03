import { NextRequest, NextResponse } from "next/server";
import { fetchMovieById } from "@/lib/omdb";
import { validateImdbId, sanitizeImdbId } from "@/lib/utils";

/**
 * GET /api/movie?id=tt0133093
 * Fetches movie details from OMDB for a given IMDb ID.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawId = searchParams.get("id");

  // Validate input
  if (!rawId) {
    return NextResponse.json(
      { error: "IMDb ID is required. Example: ?id=tt0133093" },
      { status: 400 }
    );
  }

  const imdbId = sanitizeImdbId(rawId);

  if (!validateImdbId(imdbId)) {
    return NextResponse.json(
      {
        error: "Invalid IMDb ID format.",
        details: "IMDb IDs must start with 'tt' followed by 7-8 digits (e.g., tt0133093).",
      },
      { status: 400 }
    );
  }

  try {
    const movie = await fetchMovieById(imdbId);
    return NextResponse.json(movie);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch movie data.";
    const status = message.includes("not found") ? 404 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
