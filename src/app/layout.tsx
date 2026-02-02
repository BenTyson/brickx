import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { JsonLd } from "@/components/json-ld";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BrickX — LEGO Investment Platform",
  description:
    "Track LEGO set values, build your portfolio, and make smarter investment decisions with real-time pricing data across 26,000+ sets.",
  keywords: [
    "LEGO",
    "investment",
    "portfolio tracker",
    "price guide",
    "LEGO sets",
    "collectibles",
  ],
  openGraph: {
    title: "BrickX — LEGO Investment Platform",
    description:
      "Track LEGO set values, build your portfolio, and make smarter investment decisions.",
    type: "website",
    siteName: "BrickX",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrickX — LEGO Investment Platform",
    description:
      "Track LEGO set values, build your portfolio, and make smarter investment decisions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "BrickX",
            url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://brickx.io",
            description:
              "Track LEGO set values, build your portfolio, and make smarter investment decisions.",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://brickx.io"}/sets?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
