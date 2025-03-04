import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cebu-rent",
  description: "Cebu-rent",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-black`}>
      <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
        {children}
        </Suspense>
      </body>
    </html>
  );
}
