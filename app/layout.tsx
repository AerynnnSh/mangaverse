import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { LibraryProvider } from "@/context/LibraryContext";
import { AuthProvider } from "@/context/AuthContext";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MangaVerse - Premium Reader",
  description: "Read your favorite manga with style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased bg-[#09090b]`}>
        {/* AuthProvider HARUS di paling luar agar Navbar bisa akses datanya */}
        <AuthProvider>
          <LibraryProvider>{children}</LibraryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
