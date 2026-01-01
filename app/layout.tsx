import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3776AB" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: "PyDSA - Master Python Data Structures & Algorithms with AI",
    template: "%s | PyDSA",
  },
  description:
    "The ultimate platform to master Data Structures & Algorithms with Python. Interactive visualizations, AI-powered tutoring, and the scientific learning method. Learn sorting, searching, trees, graphs, and ace your coding interviews.",
  keywords: [
    "Python DSA",
    "Data Structures",
    "Algorithms",
    "AI Tutor",
    "Coding Interview Prep",
    "LeetCode",
    "Algorithm Visualization",
    "Python Programming",
    "Computer Science",
    "Binary Search",
    "Sorting Algorithms",
    "Quick Sort",
    "Merge Sort",
    "Binary Tree",
    "Graph Algorithms",
    "Dynamic Programming",
    "Technical Interview",
    "FAANG Interview",
    "Software Engineering",
    "Learn to Code",
  ],
  authors: [{ name: "PyDSA Team" }],
  creator: "PyDSA",
  publisher: "PyDSA",
  metadataBase: new URL("https://pydsa.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pydsa.dev",
    siteName: "PyDSA",
    title: "PyDSA - Master Python Data Structures & Algorithms with AI",
    description:
      "The ultimate platform to master DSA with Python. Interactive visualizations, AI tutoring, and scientific learning. Ace your coding interviews!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PyDSA - Master Algorithms with Python",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PyDSA - Master Python DSA with AI",
    description:
      "Interactive algorithm visualizations, AI tutoring, and scientific learning. The best way to master Data Structures & Algorithms.",
    images: ["/og-image.png"],
    creator: "@pydsa",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#3776AB" },
    ],
  },
  manifest: "/site.webmanifest",
  category: "education",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PyDSA",
  description:
    "Free, open-source platform to master Data Structures & Algorithms with Python through interactive visualizations and AI tutoring.",
  url: "https://pydsa.dev",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Algorithm Visualizations",
    "Data Structure Visualizations",
    "AI-Powered Tutoring",
    "Python Code Examples",
    "Interview Preparation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
