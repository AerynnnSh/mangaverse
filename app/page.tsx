import { getPopularManga } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import NavbarSearch from "@/components/NavbarSearch";
import {
  Bell,
  Sparkles,
  Flame,
  Clock,
  ArrowRight,
  Hash,
  MessageCircle,
} from "lucide-react";
import MangaGrid from "@/components/MangaGrid";

export default async function Home() {
  const popularManga = await getPopularManga();

  // Safety Check: Pastikan array tidak kosong sebelum akses index [0]
  const featuredManga = popularManga.length > 0 ? popularManga[0] : null;
  const trendingManga = popularManga.slice(1, 4);
  const initialGridData = popularManga.slice(4);

  // Mapping ID Genre (UUID dari MangaDex)
  const genres = [
    { name: "Action", id: "391b0423-d847-456f-aff0-8b0cfc03066b" },
    { name: "Adventure", id: "87cc87cd-a395-47af-b27a-93258283bbc6" },
    { name: "Isekai", id: "ace04997-f6bd-436e-b261-779182193d3d" },
    { name: "Romance", id: "423e2eae-a7a2-4a8b-ac03-a8351462d71d" },
    { name: "Fantasy", id: "cdc58593-87dd-415e-bbc0-2ec27bf404cc" },
    { name: "Comedy", id: "4d32cc48-9f00-4cca-9b5a-a839f0764984" },
    { name: "Horror", id: "cdad7e6d-8760-41e3-a675-654e52f09242" },
    { name: "Sci-Fi", id: "256c8bd9-4904-4360-bf4f-508a76d67183" },
    { name: "Drama", id: "b9af3a63-f058-46de-a9a0-e0c13906197a" },
    { name: "School Life", id: "caaa44eb-cd40-4177-b930-79d3ef2afe87" },
    { name: "Mystery", id: "ee968100-4191-4968-93d3-f82d72be7e46" },
    { name: "Slice of Life", id: "e5301a23-ebd9-49dd-a0cb-2add944c7fe9" },
  ];

  return (
    <div className="min-h-screen selection:bg-indigo-500/30">
      {/* --- NAVBAR --- */}
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

          <div className="flex items-center gap-5">
            <button className="text-gray-300 hover:text-white transition drop-shadow-md">
              <Bell className="w-6 h-6" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gray-700 border border-gray-500"></div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      {featuredManga ? (
        <div className="relative min-h-[700px] flex items-center pt-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 bg-slate-900">
            <Image
              src={featuredManga.cover}
              alt="Hero Background"
              fill
              className="object-cover opacity-70 blur-md scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 via-40% to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/90 via-[#09090b]/40 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#09090b_120%)]" />
          </div>

          <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-8 items-center mt-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold backdrop-blur-md shadow-lg">
                <Sparkles className="w-3 h-3 text-yellow-400" /> #1 Most Popular
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight drop-shadow-2xl line-clamp-3">
                {featuredManga.title}
              </h1>
              <p className="text-gray-200 text-lg line-clamp-3 leading-relaxed max-w-xl drop-shadow-md font-medium">
                Experience the epic journey that has captivated millions. Dive
                into a world of adventure, mystery, and action right now.
              </p>
              <div className="flex gap-4 pt-4">
                <Link
                  href={`/manga/${featuredManga.id}`}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/40 flex items-center gap-2 transform hover:scale-105 duration-200"
                >
                  Start Reading <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition backdrop-blur-md">
                  + Add to List
                </button>
              </div>
            </div>

            <div className="hidden md:flex justify-end perspective-1000 pr-6">
              <div className="relative w-[320px] aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/20 rotate-y-6 hover:rotate-0 transition duration-700 ease-out group bg-slate-800">
                <Image
                  src={featuredManga.cover}
                  alt="Cover"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Fallback kalau data belum siap / kosong
        <div className="min-h-[700px] flex items-center justify-center bg-[#09090b]">
          <div className="text-slate-500 animate-pulse">
            Loading manga data...
          </div>
        </div>
      )}

      {/* --- CONTENT SECTION --- */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <Clock className="w-7 h-7 text-indigo-500" /> Latest Updates
                </h2>
                <p className="text-gray-400">
                  Fresh chapters hot off the press.
                </p>
              </div>
            </div>
            <MangaGrid initialData={initialGridData} />
          </div>

          <div className="w-full lg:w-[350px] flex-shrink-0 space-y-10">
            {/* Top Charts */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" /> Top Charts
              </h3>
              <div className="flex flex-col gap-4">
                {trendingManga.map((manga: any, index: number) => (
                  <Link
                    href={`/manga/${manga.id}`}
                    key={manga.id}
                    className="flex gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition group items-center"
                  >
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <span
                        className={`absolute -top-2 -left-2 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border-2 border-[#09090b] z-10 ${
                          index === 0
                            ? "bg-yellow-400 text-black"
                            : index === 1
                              ? "bg-gray-300 text-black"
                              : "bg-orange-700 text-white"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div className="w-full h-full rounded-lg overflow-hidden relative bg-slate-800">
                        <Image
                          src={manga.cover}
                          alt={manga.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-200 font-bold text-sm truncate group-hover:text-white transition">
                        {manga.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span className="text-indigo-400">Popular</span>
                        <span>•</span>
                        <span className="capitalize">{manga.status}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Genres */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Hash className="w-5 h-5 text-indigo-500" /> Discover Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Link
                    key={genre.id}
                    // Mengirim ID genre dan Nama genre ke halaman search
                    href={`/search?genre=${genre.id}&genreName=${encodeURIComponent(genre.name)}`}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white text-gray-400 text-sm font-medium transition duration-300 cursor-pointer block"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Community */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/20 relative overflow-hidden group cursor-pointer">
              <div className="relative z-10">
                <h4 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" /> Join Community
                </h4>
                <p className="text-indigo-200 text-xs mb-4">
                  Discuss theories and get recommendations.
                </p>
                <span className="text-xs font-bold text-white bg-white/20 px-3 py-1.5 rounded-lg group-hover:bg-white group-hover:text-indigo-900 transition">
                  Join Discord
                </span>
              </div>
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500 blur-[60px] opacity-40 group-hover:opacity-60 transition" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
