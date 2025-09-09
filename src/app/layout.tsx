import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MSME Directory - Find Micro, Small & Medium Enterprises in India",
  description: "Comprehensive directory of MSME enterprises across India. Search thousands of registered micro, small and medium enterprises by name, location, and industry. Official MSME registration data.",
  keywords: [
    "MSME directory",
    "micro small medium enterprises",
    "MSME registration",
    "business directory India",
    "enterprise search",
    "MSME database",
    "udyam registration",
    "small business directory"
  ],
  authors: [{ name: "MSME Directory" }],
  creator: "MSME Directory",
  publisher: "MSME Directory",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "MSME Directory",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://msme-directory.vercel.app",
              "description": "Comprehensive directory of MSME enterprises across India",
              "potentialAction": {
                "@type": "SearchAction",
                "target": (process.env.NEXT_PUBLIC_SITE_URL || "https://msme-directory.vercel.app") + "/?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
