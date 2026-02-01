import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
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
