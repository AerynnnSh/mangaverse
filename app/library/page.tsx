"use client";

import { useLibrary } from "@/context/LibraryContext";
import Link from "next/link";
import Image from "next/image";
import { BookMarked, Trash2, ArrowLeft } from "lucide-react";

export default function LibraryPage() {
  const { library, toggleLibrary } = useLibrary();

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-200 pb-20">
      {/* Mini Header */}
      <nav className="h-20 flex items-center border-b border-white/5 mb-10">
        <div className="container mx-auto px-6 flex items-center gap-4">
          <Link
            href="/"
            className="p-2 hover:bg-white/5 rounded-full transition"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BookMarked className="text-indigo-500" size={20} />
            My Library
          </h1>
        </div>
      </nav>

      <div className="container mx-auto px-6">
        {library.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {library.map((manga) => (
              <div key={manga.id} className="group relative">
                <Link
                  href={`/manga/${manga.id}`}
                  className="block relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 bg-slate-900"
                >
                  <Image
                    src={manga.cover}
                    alt={manga.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                {/* Tombol Hapus Cepat */}
                <button
                  onClick={() => toggleLibrary(manga)}
                  className="absolute top-2 right-2 p-2 bg-red-500/90 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 backdrop-blur-sm"
                >
                  <Trash2 size={16} />
                </button>

                <div className="mt-3">
                  <h3 className="font-bold text-sm line-clamp-1 group-hover:text-indigo-400 transition">
                    {manga.title}
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    {manga.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <BookMarked size={40} className="text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Your library is empty
            </h2>
            <p className="text-slate-500 mb-8">
              Start exploring and save your favorite manga here.
            </p>
            <Link
              href="/"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
            >
              Browse Manga
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
