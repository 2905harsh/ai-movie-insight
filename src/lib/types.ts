// Movie data returned from OMDB API
export interface MovieData {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Poster: string;
  Ratings: Rating[];
  imdbRating: string;
  imdbVotes: string;
  Type: string;
  totalSeasons?: string;
  Response: string;
  Error?: string;
}

export interface Rating {
  Source: string;
  Value: string;
}

// AI sentiment analysis result
export interface SentimentResult {
  summary: string;
  classification: "positive" | "mixed" | "negative";
  keyThemes: string[];
  audienceScore: number; // 0-100
}

// Full response combining movie + sentiment
export interface MovieInsight {
  movie: MovieData;
  sentiment: SentimentResult;
}

// API error shape
export interface ApiError {
  error: string;
  details?: string;
}
