import { MovieData } from "./types";

const OMDB_BASE_URL = "https://www.omdbapi.com";

/**
 * Fetches movie details from the OMDB API using an IMDb ID.
 * Throws an error if the movie is not found or the API call fails.
 */
export async function fetchMovieById(imdbId: string): Promise<MovieData> {
  const apiKey = process.env.OMDB_API_KEY;

  if (!apiKey) {
    throw new Error("OMDB API key is not configured. Set OMDB_API_KEY in your environment.");
  }

  const url = `${OMDB_BASE_URL}/?i=${encodeURIComponent(imdbId)}&apikey=${apiKey}&plot=full`;

  const response = await fetch(url, {
    // Cache movie data for 1 hour to reduce API calls
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`OMDB API request failed with status ${response.status}`);
  }

  const data: MovieData = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error || "Movie not found. Please check the IMDb ID.");
  }

  return data;
}
