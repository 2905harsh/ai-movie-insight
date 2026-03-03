"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import SentimentCard from "@/components/SentimentCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { MovieData, SentimentResult } from "@/lib/types";

type LoadingStage = "idle" | "movie" | "sentiment" | "done" | "error";

export default function Home() {
  const [stage, setStage] = useState<LoadingStage>("idle");
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
  const [error, setError] = useState<string>("");

  /**
   * Main search handler:
   * 1. Fetch movie from OMDB
   * 2. Feed movie data to Claude for sentiment analysis
   */
  async function handleSearch(imdbId: string) {
    // Reset state
    setStage("movie");
    setMovie(null);
    setSentiment(null);
    setError("");

    try {
      // Step 1: Fetch movie details
      const movieRes = await fetch(`/api/movie?id=${encodeURIComponent(imdbId)}`);
      const movieData = await movieRes.json();

      if (!movieRes.ok) {
        throw new Error(movieData.error || "Failed to fetch movie details.");
      }

      setMovie(movieData);
      setStage("sentiment");

      // Step 2: AI sentiment analysis
      const sentimentRes = await fetch("/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieData),
      });

      const sentimentData = await sentimentRes.json();

      if (!sentimentRes.ok) {
        throw new Error(sentimentData.error || "Sentiment analysis failed.");
      }

      setSentiment(sentimentData);
      setStage("done");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
      setStage("error");
    }
  }

  const isLoading = stage === "movie" || stage === "sentiment";

  return (
    <main className="min-h-screen bg-cinema-black">
      {/* Background ambient effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px]
          bg-cinema-gold/3 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px]
          bg-cinema-accent/3 rounded-full blur-[80px] translate-y-1/4" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        {/* Hero Header */}
        <header className="pt-16 pb-12 text-center space-y-4">
          {/* Logo mark */}
          <div className="inline-flex items-center gap-2 mb-2 animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-cinema-gold/10 border border-cinema-gold/30
              flex items-center justify-center animate-float">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <span className="text-cinema-gold/70 text-sm tracking-widest uppercase font-medium">
              CineInsight
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-cinema-text leading-tight animate-fade-up"
            style={{ animationDelay: "0.1s", opacity: 0 }}>
            AI Movie{" "}
            <span className="text-gold-gradient">Insight</span>{" "}
            Builder
          </h1>

          <p className="text-cinema-muted text-base sm:text-lg max-w-lg mx-auto animate-fade-up"
            style={{ animationDelay: "0.2s", opacity: 0 }}>
            Enter any IMDb movie ID to unlock AI-powered audience sentiment analysis
            and deep cinematic insights.
          </p>
        </header>

        {/* Search */}
        <div className="animate-fade-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Loading stage indicator */}
        {isLoading && (
          <div className="mt-8 flex items-center justify-center gap-3 text-sm text-cinema-muted animate-fade-in">
            <svg className="animate-spin text-cinema-gold" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <span>
              {stage === "movie" ? "Fetching movie details…" : "Analyzing audience sentiment with AI…"}
            </span>
          </div>
        )}

        {/* Error state */}
        {stage === "error" && error && (
          <div className="mt-10 max-w-2xl mx-auto bg-red-950/30 border border-red-800/40 rounded-2xl p-6 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="text-red-400 mt-0.5 shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div>
                <h3 className="text-red-400 font-medium mb-1">Something went wrong</h3>
                <p className="text-red-300/70 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Skeleton while loading */}
        {isLoading && !movie && <LoadingSkeleton />}

        {/* Results */}
        {movie && (
          <div className="mt-12 space-y-10">
            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-cinema-border" />
              <span className="text-cinema-muted/50 text-xs uppercase tracking-widest">Results</span>
              <div className="flex-1 h-px bg-cinema-border" />
            </div>

            {/* Movie Details */}
            <MovieCard movie={movie} />

            {/* Sentiment — show when ready or loading */}
            {stage === "sentiment" && !sentiment && (
              <div className="bg-cinema-card border border-cinema-border rounded-2xl p-6 animate-pulse">
                <div className="flex items-center gap-3 text-cinema-muted text-sm">
                  <svg className="animate-spin text-cinema-gold" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Claude is analyzing audience sentiment…
                </div>
              </div>
            )}

            {sentiment && <SentimentCard sentiment={sentiment} />}
          </div>
        )}

        {/* Empty state */}
        {stage === "idle" && (
          <div className="mt-16 text-center animate-fade-in">
            <div className="inline-flex flex-col items-center gap-4 text-cinema-muted/40">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75">
                <rect x="2" y="2" width="20" height="20" rx="2"/>
                <path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5"/>
              </svg>
              <p className="text-sm">Enter an IMDb ID above to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-3 text-center
        text-cinema-muted/30 text-xs border-t border-cinema-border/30 bg-cinema-black/80 backdrop-blur-sm">
        CineInsight · Built with Next.js, OMDB API & Claude AI
      </footer>
    </main>
  );
}
