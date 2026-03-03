import Image from "next/image";
import { MovieData } from "@/lib/types";

interface MovieCardProps {
  movie: MovieData;
}

function RatingBadge({ source, value }: { source: string; value: string }) {
  return (
    <div className="flex items-center gap-2 bg-cinema-deep border border-cinema-border rounded-lg px-3 py-2">
      <span className="text-cinema-muted text-xs">{source}</span>
      <span className="text-cinema-gold font-medium text-sm">{value}</span>
    </div>
  );
}

export default function MovieCard({ movie }: MovieCardProps) {
  const castList = movie.Actors?.split(", ").filter(Boolean) ?? [];
  const genreList = movie.Genre?.split(", ").filter(Boolean) ?? [];
  const hasPoster = movie.Poster && movie.Poster !== "N/A";

  return (
    <div className="w-full animate-fade-up">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        {/* Poster */}
        <div className="lg:col-span-1 flex justify-center lg:justify-start">
          <div className="relative w-full max-w-[260px] lg:max-w-full">
            {hasPoster ? (
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-cinema-border shadow-2xl shadow-black/60">
                <Image
                  src={movie.Poster}
                  alt={`${movie.Title} poster`}
                  fill
                  sizes="(max-width: 1024px) 260px, 33vw"
                  className="object-cover"
                  priority
                />
                {/* Subtle gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            ) : (
              <div className="aspect-[2/3] rounded-2xl border border-cinema-border bg-cinema-card
                flex items-center justify-center text-cinema-muted">
                <div className="text-center space-y-2">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto opacity-40">
                    <rect x="2" y="2" width="20" height="20" rx="2"/>
                    <path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5"/>
                  </svg>
                  <p className="text-xs">No poster available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title & Year */}
          <div>
            <h1 className="font-display text-3xl lg:text-4xl text-cinema-text leading-tight">
              {movie.Title}
            </h1>
            <div className="mt-2 flex items-center gap-3 text-cinema-muted text-sm flex-wrap">
              <span>{movie.Year}</span>
              {movie.Runtime && movie.Runtime !== "N/A" && (
                <>
                  <span className="text-cinema-border">·</span>
                  <span>{movie.Runtime}</span>
                </>
              )}
              {movie.Rated && movie.Rated !== "N/A" && (
                <>
                  <span className="text-cinema-border">·</span>
                  <span className="px-2 py-0.5 border border-cinema-border rounded text-xs">
                    {movie.Rated}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Genres */}
          {genreList.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genreList.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 rounded-full text-xs border border-cinema-gold/30
                    text-cinema-gold bg-cinema-gold/5"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Ratings */}
          {movie.Ratings && movie.Ratings.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {movie.imdbRating && movie.imdbRating !== "N/A" && (
                <RatingBadge source="IMDb" value={`${movie.imdbRating}/10`} />
              )}
              {movie.Ratings.filter((r) => r.Source !== "Internet Movie Database").map((r) => (
                <RatingBadge key={r.Source} source={r.Source.replace("Rotten Tomatoes", "RT")} value={r.Value} />
              ))}
            </div>
          )}

          {/* Plot */}
          {movie.Plot && movie.Plot !== "N/A" && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-medium text-cinema-muted uppercase tracking-widest">Plot</h3>
              <p className="text-cinema-text/85 leading-relaxed text-[15px]">{movie.Plot}</p>
            </div>
          )}

          {/* Director */}
          {movie.Director && movie.Director !== "N/A" && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-cinema-muted">Directed by</span>
              <span className="text-cinema-text font-medium">{movie.Director}</span>
            </div>
          )}

          {/* Cast */}
          {castList.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-cinema-muted uppercase tracking-widest">Cast</h3>
              <div className="flex flex-wrap gap-2">
                {castList.map((actor) => (
                  <span
                    key={actor}
                    className="px-3 py-1.5 rounded-full text-sm bg-cinema-card border border-cinema-border
                      text-cinema-text/80 hover:border-cinema-gold/30 hover:text-cinema-gold
                      transition-all duration-200"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
