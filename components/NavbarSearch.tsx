"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Command } from "lucide-react";

export default function NavbarSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null); // 1. Ref untuk akses ke input

  // 2. Logic Shortcut Keyboard (Ctrl + K atau Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cek jika Ctrl (Windows) atau Meta/Command (Mac) + K ditekan
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault(); // Mencegah browser membuka search bar bawaan
        inputRef.current?.focus(); // Fokuskan kursor ke input kita
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="hidden md:flex flex-1 max-w-lg relative group transition-all duration-300"
    >
      {/* Icon Search di Kiri */}
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-indigo-400 transition" />

      {/* Input Field */}
      <input
        ref={inputRef} // Hubungkan Ref
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search title, author..."
        className="w-full bg-[#0f172a]/60 border border-slate-700/50 rounded-full py-2.5 pl-12 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-[#0f172a] focus:border-indigo-500/50 transition-all duration-300 text-slate-200 placeholder-slate-500 shadow-sm"
      />

      {/* Badge Ctrl K di Kanan */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
        <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-slate-700 bg-slate-800 px-2 font-mono text-[10px] font-medium text-slate-400 opacity-70 group-hover:opacity-100 transition">
          <span className="text-xs">Ctrl</span> K
        </kbd>
      </div>
    </form>
  );
}
