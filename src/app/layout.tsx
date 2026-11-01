import type { Metadata } from "next";
import { Space_Grotesk, Inter, Geist_Mono } from "next/font/google";
import { MotionProvider } from "@/providers/motion-provider";
import { loaderSkipScript } from "@/lib/site-loader";
import "./globals.css";

// Headings & buttons: Space Grotesk 600–700. Body & navigation: Inter 400–500.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Muhammad Rifki Ramadhani — Portfolio",
  description:
    "Portfolio pribadi Muhammad Rifki Ramadhani, Fullstack Developer & Software Engineer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      // The inline script below may add a class before hydration.
      suppressHydrationWarning
      className={`dark ${spaceGrotesk.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: loaderSkipScript }} />
        <noscript>
          <style>{"#site-loader{display:none!important}"}</style>
        </noscript>
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full bg-background text-foreground font-sans"
      >
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
