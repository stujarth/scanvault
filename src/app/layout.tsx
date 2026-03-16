import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/providers/auth-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScanVault — Vehicle Body Condition Scanning",
  description: "AI-powered vehicle body condition scanning that builds a complete damage history. Trusted by garages, hire companies, insurers, and dealerships.",
  keywords: ["vehicle inspection", "body condition", "damage scanning", "MOT", "hire car", "insurance", "vehicle history"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
