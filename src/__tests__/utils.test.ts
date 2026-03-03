import { validateImdbId, sanitizeImdbId, ratingToScore } from "@/lib/utils";

describe("validateImdbId", () => {
  it("accepts valid 7-digit IMDb IDs", () => {
    expect(validateImdbId("tt0133093")).toBe(true);
    expect(validateImdbId("tt0468569")).toBe(true);
  });

  it("accepts valid 8-digit IMDb IDs", () => {
    expect(validateImdbId("tt12345678")).toBe(true);
  });

  it("rejects IDs without tt prefix", () => {
    expect(validateImdbId("0133093")).toBe(false);
    expect(validateImdbId("ab0133093")).toBe(false);
  });

  it("rejects IDs that are too short", () => {
    expect(validateImdbId("tt01330")).toBe(false); // only 5 digits
  });

  it("rejects IDs that are too long", () => {
    expect(validateImdbId("tt012345678")).toBe(false); // 9 digits
  });

  it("rejects empty or null input", () => {
    expect(validateImdbId("")).toBe(false);
    expect(validateImdbId(null as unknown as string)).toBe(false);
  });

  it("rejects IDs with spaces", () => {
    expect(validateImdbId("tt 0133093")).toBe(false);
  });
});

describe("sanitizeImdbId", () => {
  it("trims whitespace", () => {
    expect(sanitizeImdbId("  tt0133093  ")).toBe("tt0133093");
  });

  it("lowercases the input", () => {
    expect(sanitizeImdbId("TT0133093")).toBe("tt0133093");
  });
});

describe("ratingToScore", () => {
  it("converts 10/10 to 100", () => {
    expect(ratingToScore("10")).toBe(100);
  });

  it("converts 8.5 to 85", () => {
    expect(ratingToScore("8.5")).toBe(85);
  });

  it("converts 0 to 0", () => {
    expect(ratingToScore("0")).toBe(0);
  });

  it("returns 0 for non-numeric input", () => {
    expect(ratingToScore("N/A")).toBe(0);
    expect(ratingToScore("")).toBe(0);
  });
});
