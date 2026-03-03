"use client";

import { useState, FormEvent } from "react";

interface SearchBarProps {
  onSearch: (imdbId: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();

    // Client-side validation
    if (!trimmed) {
      setError("Please enter an IMDb ID.");
      return;
    }

    if (!/^tt\d{7,8}$/i.test(trimmed)) {
      setError("Invalid format. Use tt followed by 7-8 digits (e.g., tt0133093).");
      return;
    }

    setError("");
    onSearch(trimmed.toLowerCase());
  }

  const exampleIds = [
    { id: "tt0133093", label: "The Matrix" },
    { id: "tt0468569", label: "The Dark Knight" },
    { id: "tt1375666", label: "Inception" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} noValidate>
        <div className="relative group">
          {/* Search input */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              {/* Film strip icon */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cinema-muted">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
                  <line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/>
                  <line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/>
                  <line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/>
                  <line x1="17" y1="7" x2="22" y2="7"/>
                </svg>
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter IMDb ID — e.g. tt0133093"
                className={`w-full bg-cinema-card border ${
                  error ? "border-red-500/60" : "border-cinema-border"
                } rounded-xl pl-12 pr-4 py-4 text-cinema-text placeholder:text-cinema-muted
                focus:outline-none focus:border-cinema-gold/50 focus:ring-1 focus:ring-cinema-gold/20
                transition-all duration-300 font-body text-[15px]`}
                disabled={isLoading}
                autoComplete="off"
                spellCheck={false}
                aria-label="IMDb movie ID"
                aria-describedby={error ? "search-error" : undefined}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-4 rounded-xl font-medium text-[15px] transition-all duration-300
                bg-cinema-gold text-cinema-black hover:bg-cinema-gold-light
                disabled:opacity-50 disabled:cursor-not-allowed
                active:scale-95 whitespace-nowrap shadow-lg shadow-cinema-gold/20"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Analyzing
                </span>
              ) : (
                "Analyze"
              )}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <p id="search-error" className="mt-2 text-red-400 text-sm pl-1 animate-fade-in">
              {error}
            </p>
          )}
        </div>
      </form>

      {/* Quick example IDs */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="text-cinema-muted text-xs">Try:</span>
        {exampleIds.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => {
              setInput(id);
              setError("");
            }}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-full border border-cinema-border
              text-cinema-muted hover:text-cinema-gold hover:border-cinema-gold/40
              transition-all duration-200 disabled:opacity-40"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
