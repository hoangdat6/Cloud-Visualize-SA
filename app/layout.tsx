import type { Metadata } from "next";
import { IBM_Plex_Mono, Klee_One, Pangolin } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";

const pangolin = Pangolin({
  variable: "--font-pangolin",
  subsets: ["latin"],
  weight: "400",
});

const kleeOne = Klee_One({
  variable: "--font-klee-one",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name} — Cloud architecture simulations`,
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE.name,
    description: SITE.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${pangolin.variable} ${kleeOne.variable} ${plexMono.variable} h-full bg-[var(--bg-paper)] text-[var(--text-main)] antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--bg-paper)] font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
