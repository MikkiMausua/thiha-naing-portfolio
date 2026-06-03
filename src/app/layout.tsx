import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Thiha Naing — Growth Marketer & Digital Strategist",
    template: "%s | Thiha Naing",
  },
  description:
    "A data-driven digital marketer with a strong mix of technical expertise and creative strategy. Experienced in Meta ad campaigns, SEO strategies, and marketing automations.",
  keywords: [
    "Growth Marketing",
    "Digital Strategy",
    "Meta Ads",
    "SEO",
    "Marketing Automation",
    "ManyChat",
    "Make.com",
    "Content Strategy",
    "Thiha Naing",
  ],
  authors: [{ name: "Thiha Naing" }],
  creator: "Thiha Naing",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Thiha Naing — Growth Marketer & Digital Strategist",
    description:
      "A data-driven digital marketer specializing in Meta ad campaigns, SEO strategies, and marketing automations.",
    siteName: "Thiha Naing Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thiha Naing — Growth Marketer & Digital Strategist",
    description:
      "A data-driven digital marketer specializing in Meta ad campaigns, SEO strategies, and marketing automations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
