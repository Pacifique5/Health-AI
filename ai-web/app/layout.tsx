import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const mono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SymptomAI",
  description: "Smart health assistant for symptom insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${mono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
