"use client";

import Link from "next/link";
import { BookMarked } from "lucide-react";
import NavbarSearch from "./NavbarSearch";
import NotificationDropdown from "./NotificationDropdown";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { malUser } = useAuth();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-20 flex items-center transition-all duration-300 bg-gradient-to-b from-black/80 to-transparent">
      <div className="container mx-auto px-6 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition">
            M
          </div>
          <span className="text-2xl font-bold text-white drop-shadow-md">
            MangaVerse
          </span>
        </Link>

        <NavbarSearch />

        <div className="flex items-center gap-6">
          <Link
            href="/library"
            className="hidden md:flex items-center gap-2 text-gray-300 hover:text-white transition group"
          >
            <div className="relative">
              <BookMarked
                size={22}
                className="group-hover:scale-110 transition"
              />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full border border-[#09090b]"></span>
            </div>
            <span className="text-sm font-bold tracking-wide uppercase">
              Library
            </span>
          </Link>

          <NotificationDropdown />

          {/* USER PROFILE DYNAMIS */}
          <div className="w-9 h-9 rounded-full bg-gray-700 border border-white/10 overflow-hidden shadow-lg shadow-indigo-500/10">
            {malUser ? (
              <img
                src={malUser.main_picture?.medium}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                USER
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
