import type { Metadata } from "next";
import { Nunito, Fredoka } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Happy Kids - Douceurs Artisanales | Cookies & Pâtisseries Tunisiennes",
  description:
    "Happy Kids - Fabrique artisanale de cookies et pâtisseries tunisiennes. Des douceurs faites maison pour les petits et les grands. Commandez vos cookies, baklawa, makroudh et plus encore.",
  keywords: [
    "Happy Kids",
    "cookies",
    "pâtisseries tunisiennes",
    "baklawa",
    "makroudh",
    "douceurs artisanales",
    "Tunisie",
  ],
  icons: {
    icon: [
      { url: "/images/logo.jpg" },
     // { url: "/images/logo.png" },
    ],
  },
  openGraph: {
    title: "Happy Kids - Douceurs Artisanales",
    description:
      "Des douceurs artisanales pour les petits et les grands. Cookies, pâtisseries tunisiennes et coffrets cadeaux.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${fredoka.variable} antialiased`}
        style={{ fontFamily: "var(--font-nunito)" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
