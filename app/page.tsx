import { getPopularManga } from "@/lib/api";
import { Flame, Clock, Hash, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import MangaGrid from "@/components/MangaGrid";
import HeroSlider from "@/components/HeroSlider";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const popularManga = await getPopularManga();
  const featuredSlides = popularManga.slice(0, 5);
  const trendingManga = popularManga.slice(5, 8);
  const initialGridData = popularManga.slice(8);

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
      {/* Navbar sekarang mengelola state profile sendiri via AuthContext */}
      <Navbar />

      {featuredSlides.length > 0 ? (
        <HeroSlider slides={featuredSlides} />
      ) : (
        <div className="min-h-[600px] flex items-center justify-center bg-[#09090b]">
          <div className="text-slate-500 animate-pulse text-xs font-bold uppercase tracking-widest text-center">
            Fetching Mangaverse...
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3 lowercase tracking-tighter">
                  <Clock className="w-7 h-7 text-indigo-500" /> latest updates
                </h2>
                <p className="text-gray-400 text-sm">
                  Fresh chapters hot off the press.
                </p>
              </div>
            </div>
            <MangaGrid initialData={initialGridData} />
          </div>

          <div className="w-full lg:w-[350px] flex-shrink-0 space-y-10">
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 lowercase tracking-tighter">
                <Flame className="w-5 h-5 text-orange-500" /> top charts
              </h3>
              <div className="flex flex-col gap-4">
                {trendingManga.map((manga: any, index: number) => (
                  <Link
                    href={`/manga/${manga.id}`}
                    key={manga.id}
                    className="flex gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition group items-center"
                  >
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <span
                        className={`absolute -top-2 -left-2 w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-black border-2 border-[#09090b] z-10 ${index === 0 ? "bg-slate-400 text-black" : "bg-slate-700 text-white"}`}
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
                      <h4 className="text-gray-200 font-bold text-sm truncate group-hover:text-white transition lowercase">
                        {manga.title}
                      </h4>
                      <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-1">
                        Trending • {manga.status}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 lowercase tracking-tighter">
                <Hash className="w-5 h-5 text-indigo-500" /> genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Link
                    key={genre.id}
                    href={`/search?genre=${genre.id}`}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 hover:bg-indigo-600 hover:text-white text-gray-400 text-xs font-bold transition lowercase"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
