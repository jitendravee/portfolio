import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import SiteHeader from "@/components/portfolio/SiteHeader";
import SiteFooter from "@/components/portfolio/SiteFooter";
import FloatingCV from "@/components/portfolio/FloatingCV";
import { ProjectNavigationProvider } from "@/components/portfolio/ProjectNavigation";

const portfolioSans = localFont({
  variable: "--font-portfolio-sans",
  display: "swap",
  src: [
    { path: "../../public/fonts/jost-300.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/jost-400.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/jost-500.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/jost-600.ttf", weight: "600", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: {
    default: "Jitendra Choudhary — Design & Engineering",
    template: "%s — Jitendra Choudhary",
  },
  description:
    "Product designer, software engineer, and builder. Graphics, products, systems, stories, and selected work by Jitendra Choudhary.",
  icons: {
    icon: "/logo.png",
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
        <link
          rel="preload"
          href="/fonts/caveat-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${portfolioSans.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ProjectNavigationProvider>
            <a className="skip-link" href="#main">
              Skip to content
            </a>
            <SiteHeader />
            <main id="main" className="site-main">
              {children}
            </main>
            <SiteFooter />
            <FloatingCV />
          </ProjectNavigationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
