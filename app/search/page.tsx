import { searchManga, getPopularManga } from "@/lib/api"; // Tambah getPopularManga
import Link from "next/link";
import Image from "next/image";
import NavbarSearch from "@/components/NavbarSearch";
import SearchFilter from "@/components/SearchFilter";
import EmptyState from "@/components/EmptyState"; // Import komponen baru
import { ArrowLeft, BookOpen, Star } from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    genre?: string;
    genreName?: string;
    sort?: string;
  }>;
}) {
  const { q, genre, genreName, sort } = await searchParams;

  // Ambil data search dan data populer secara paralel
  const [results, popularManga] = await Promise.all([
    searchManga(q || "", genre, sort),
    getPopularManga(0, 10), // Ambil 10 buat cadangan rekomendasi
  ]);

  const pageTitle = q
    ? `Search: "${q}"`
    : genreName
      ? `Genre: ${genreName}`
      : "Discover Manga";

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200">
      <nav className="sticky top-0 z-50 bg-[#0B1120]/90 backdrop-blur border-b border-slate-800 h-20 flex items-center px-6 gap-4">
        <Link
          href="/"
          className="p-2 hover:bg-slate-800 rounded-full transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="flex-1 max-w-lg">
          <NavbarSearch />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-10">
        {/* Render Result atau Empty State */}
        {results.length > 0 ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-indigo-400">{pageTitle}</span>
                <span className="text-slate-500 text-base font-normal">
                  ({results.length})
                </span>
              </h1>
              <SearchFilter />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
              {results.map((manga: any) => (
                <Link
                  href={`/manga/${manga.id}`}
                  key={manga.id}
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
                    {manga.rating && (
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 border border-white/10">
                        <Star
                          size={10}
                          className="text-yellow-400 fill-yellow-400"
                        />
                        <span className="text-[10px] font-bold text-white">
                          {manga.rating}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition delay-100 translate-y-2 group-hover:translate-y-0">
                      <span className="flex items-center gap-1 px-3 py-1.5 bg-white text-black text-[10px] font-bold rounded-full uppercase">
                        <BookOpen size={10} /> Read
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-bold leading-tight group-hover:text-indigo-400 transition line-clamp-1 text-sm">
                      {manga.title}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">
                        Ch. {manga.lastChapter}
                      </span>
                      <span
                        className={`text-[10px] border px-1.5 py-0.5 rounded uppercase font-bold tracking-wide ${
                          manga.status === "completed"
                            ? "text-blue-300 border-blue-500/30 bg-blue-500/10"
                            : "text-emerald-300 border-emerald-500/30 bg-emerald-500/10"
                        }`}
                      >
                        {manga.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          /* Empty State yang interaktif */
          <EmptyState
            query={q || genreName || "Selection"}
            recommendations={popularManga}
          />
        )}
      </div>
    </div>
  );
}
