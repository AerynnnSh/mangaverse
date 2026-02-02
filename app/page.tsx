import { getPopularManga } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import NavbarSearch from "@/components/NavbarSearch";
import NotificationDropdown from "@/components/NotificationDropdown"; // Import komponen baru
import { Flame, Clock, Hash, MessageCircle, BookMarked } from "lucide-react";
import MangaGrid from "@/components/MangaGrid";
import HeroSlider from "@/components/HeroSlider";

export default async function Home() {
  const popularManga = await getPopularManga();

  // Data for Hero Slider (Rank #1 - #5)
  const featuredSlides = popularManga.slice(0, 5);

  // Data for Top Charts (Rank #6 - #8)
  const trendingManga = popularManga.slice(5, 8);

  // Data for Latest Updates Grid (Starting from rank #9)
  const initialGridData = popularManga.slice(8);

  // Mapping ID Genre (UUIDs from MangaDex)
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
    <div className="min-h-screen selection:bg-indigo-500/30 bg-[#09090b]">
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

          <div className="flex items-center gap-6">
            {/* LIBRARY LINK */}
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

            {/* NOTIFICATION DROPDOWN (MAL & System Updates) */}
            <NotificationDropdown />

            {/* USER PROFILE */}
            <div className="w-9 h-9 rounded-full bg-gray-700 border border-gray-500 overflow-hidden">
              <div className="w-full h-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                USER
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION (SLIDER 1-5) --- */}
      {featuredSlides.length > 0 ? (
        <HeroSlider slides={featuredSlides} />
      ) : (
        <div className="min-h-[600px] flex items-center justify-center bg-[#09090b]">
          <div className="text-slate-500 animate-pulse">
            Loading popular manga...
          </div>
        </div>
      )}

      {/* --- CONTENT SECTION --- */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Content: Latest Updates */}
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

          {/* Sidebar Section */}
          <div className="w-full lg:w-[350px] flex-shrink-0 space-y-10">
            {/* Top Charts (#6 - #8) */}
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
                            ? "bg-slate-400 text-black"
                            : index === 1
                              ? "bg-slate-500 text-white"
                              : "bg-slate-700 text-white"
                        }`}
                      >
                        {index + 6}
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
                        <span className="text-indigo-400">Trending</span>
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
                    href={`/search?genre=${genre.id}&genreName=${encodeURIComponent(genre.name)}`}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white text-gray-400 text-sm font-medium transition duration-300 cursor-pointer block"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Community Banner */}
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
