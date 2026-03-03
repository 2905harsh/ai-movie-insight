import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineInsight — AI Movie Analysis",
  description: "Enter any IMDb movie ID to get AI-powered audience sentiment analysis and movie insights.",
  openGraph: {
    title: "CineInsight — AI Movie Analysis",
    description: "AI-powered audience sentiment analysis for any movie.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
