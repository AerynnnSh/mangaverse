"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { loadMoreManga } from "@/app/actions";
import { Loader2, BookOpen } from "lucide-react";

export default function MangaGrid({ initialData }: { initialData: any[] }) {
  const [mangaList, setMangaList] = useState(initialData);
  const [offset, setOffset] = useState(20);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      const newManga = await loadMoreManga(offset);

      if (newManga.length === 0) {
        setHasMore(false);
      } else {
        setMangaList([...mangaList, ...newManga]);
        setOffset(offset + 20);
      }
    } catch (error) {
      console.error("Error loading more:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* GRID MANGA */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-10">
        {mangaList.map((manga: any) => (
          <Link
            href={`/manga/${manga.id}`}
            key={`${manga.id}-${offset}`}
            className="group flex flex-col gap-3"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-800 shadow-lg border border-white/5 group-hover:border-indigo-500/50 transition duration-300">
              <Image
                src={manga.cover}
                alt={manga.title}
                fill
                className="object-cover group-hover:scale-110 transition duration-500"
                sizes="(max-width: 768px) 100vw, 200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

              {/* Tombol Read Now saat Hover */}
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition delay-100 translate-y-2 group-hover:translate-y-0">
                <span className="flex items-center gap-1 px-3 py-1.5 bg-white text-black text-[10px] font-bold rounded-full uppercase tracking-wider">
                  <BookOpen size={10} /> Read Ch. {manga.lastChapter}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold leading-tight group-hover:text-indigo-400 transition line-clamp-1">
                {manga.title}
              </h3>
              <div className="flex justify-between items-center mt-2">
                {/* 👇 MENAMPILKAN CHAPTER TERAKHIR DINAMIS */}
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                  Ch. {manga.lastChapter}
                </span>

                {/* Badge Status */}
                <span
                  className={`text-[10px] border px-1.5 py-0.5 rounded uppercase font-bold tracking-wide ${
                    manga.status === "completed"
                      ? "text-blue-300 border-blue-500/30 bg-blue-500/10"
                      : manga.status === "ongoing"
                        ? "text-emerald-300 border-emerald-500/30 bg-emerald-500/10"
                        : "text-gray-400 border-gray-600 bg-gray-700/30"
                  }`}
                >
                  {manga.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* TOMBOL LOAD MORE */}
      <div className="mt-12 flex justify-center">
        {hasMore ? (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Loading...
              </>
            ) : (
              "Load More Updates"
            )}
          </button>
        ) : (
          <p className="text-gray-500 text-sm">You have reached the end.</p>
        )}
      </div>
    </>
  );
}
