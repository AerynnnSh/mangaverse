import { searchManga } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import NavbarSearch from "@/components/NavbarSearch";
import { ArrowLeft, BookOpen } from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; genre?: string; genreName?: string }>;
}) {
  const { q, genre, genreName } = await searchParams;

  const results = await searchManga(q || "", genre);

  const pageTitle = q
    ? `Search Results for: "${q}"`
    : genreName
      ? `Genre: ${genreName}`
      : "Search Manga";

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200">
      {/* Navbar Simple */}
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
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
          {q && <span className="text-slate-400 font-normal">Search:</span>}
          <span className="text-indigo-400">
            {pageTitle.replace("Search Results for:", "").replace("Genre:", "")}
          </span>
        </h1>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
            {results.map((manga: any) => (
              <Link
                href={`/manga/${manga.id}`}
                key={manga.id}
                className="group flex flex-col gap-3"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-800 shadow-lg border border-white/5 group-hover:border-indigo-500/50 transition duration-300">
                  <Image
                    src={manga.cover}
                    alt={manga.title}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-500"
                    sizes="(max-width: 768px) 100vw, 200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

                  {/* Tombol Read Now saat Hover (Opsional, pemanis) */}
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition delay-100 translate-y-2 group-hover:translate-y-0">
                    <span className="flex items-center gap-1 px-3 py-1.5 bg-white text-black text-[10px] font-bold rounded-full uppercase tracking-wider">
                      <BookOpen size={10} /> Read
                    </span>
                  </div>
                </div>

                {/* Info Text */}
                <div>
                  <h3 className="text-white font-bold leading-tight group-hover:text-indigo-400 transition line-clamp-1 text-sm">
                    {manga.title}
                  </h3>

                  {/* 👇 BAGIAN STATUS & CHAPTER */}
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                      Ch. {manga.lastChapter}
                    </span>

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
                  {/* ------------------------- */}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500 bg-slate-800/20 rounded-xl border border-slate-800">
            No manga found.
          </div>
        )}
      </div>
    </div>
  );
}
