import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FiberNet | Compare home fiber internet packages",
  description:
    "Explore home fiber internet packages from Salam, stc and Zain with FiberNet Saudi Arabia. Compare plans and ask about coverage in English or Arabic.",
  icons: { icon: "/favicon.svg?v=2" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/fonts/fonts.css" />
        <link
          rel="preload"
          href="/fonts/font-2.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      {/* Browser extensions may add body attributes before React hydrates. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
