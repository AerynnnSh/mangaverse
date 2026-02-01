import { getMangaDetail, getMangaChapters } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
// 👇 Import Component Actions
import MangaActions from "@/components/MangaActions";

import {
  Star,
  BookOpen,
  List,
  Search,
  ArrowDownUp,
  Edit3,
  ArrowRight,
} from "lucide-react";

export default async function MangaDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [manga, chapters] = await Promise.all([
    getMangaDetail(id),
    getMangaChapters(id),
  ]);

  if (!manga)
    return <div className="text-white text-center p-20">Manga Not Found</div>;

  const firstChapterId =
    chapters.length > 0 ? chapters[chapters.length - 1].id : null;

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: enUS,
      }).replace("about ", "");
    } catch (e) {
      return "Unknown date";
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 pb-20 font-sans">
      {/* ... Banner & Sidebar (Kode sama persis) ... */}
      <div className="relative h-[350px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={manga.cover}
            alt="Banner"
            fill
            className="object-cover opacity-30 blur-xl scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/60 to-transparent" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 -mt-40">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* SIDEBAR */}
          <div className="w-full lg:w-[280px] flex-shrink-0 space-y-6">
            {/* ... Cover, Tracking Widget, Info ... */}
            <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-2xl border-4 border-[#1e293b] group">
              <Image
                src={manga.cover}
                alt={manga.title}
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-2 left-2">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded uppercase tracking-wider ${manga.status === "ongoing" ? "bg-emerald-500 text-white" : "bg-blue-500 text-white"}`}
                >
                  {manga.status}
                </span>
              </div>
            </div>
            {/* ... (Tracking & Info Code from previous step) ... */}
            {/* Saya skip biar tidak kepanjangan, pakai kode tracking widget sebelumnya */}
            <div className="bg-[#1e293b] rounded-xl p-5 border border-slate-700 shadow-lg">
              {/* ... Isi Tracking Widget ... */}
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <h3 className="font-bold text-white">My Tracking</h3>
                <span className="bg-[#2e51a2] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  MAL
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">
                    Status
                  </label>
                  <div className="w-full bg-[#0B1120] text-slate-300 text-sm px-3 py-2 rounded border border-slate-600 flex justify-between items-center cursor-pointer hover:border-slate-500">
                    <span>Reading</span>
                    <ArrowDownUp size={14} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">
                      Chapters
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="0"
                        className="w-full bg-[#0B1120] border border-slate-600 rounded py-1.5 px-2 text-center text-white text-sm focus:border-blue-500 focus:outline-none"
                      />
                      <span className="text-slate-500 text-sm">
                        / {manga.totalChapters}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">
                      Score
                    </label>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <input
                        type="text"
                        placeholder="-"
                        className="w-full bg-[#0B1120] border border-slate-600 rounded py-1.5 px-2 text-center text-white text-sm focus:border-yellow-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <button className="w-full bg-[#2e51a2] hover:bg-[#3b60b5] text-white py-2 rounded font-bold text-sm transition flex items-center justify-center gap-2">
                  <Edit3 size={14} /> Update Entry
                </button>
              </div>
            </div>
            <div className="bg-[#1e293b]/50 rounded-xl p-4 border border-slate-700/50 text-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Format</span>
                <span className="text-white">Manga</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Author</span>
                <span className="text-white truncate max-w-[120px]">
                  {manga.author}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Released</span>
                <span className="text-white">{manga.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Views</span>
                <span className="text-white">1.2M</span>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0 pt-2 lg:pt-10">
            {/* ... Judul & Deskripsi (Kode sama) ... */}
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-2">
                {manga.title}
              </h1>
              {manga.altTitle && (
                <p className="text-lg text-slate-400 italic mb-4">
                  {manga.altTitle}
                </p>
              )}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-2xl font-bold text-white">
                    {manga.rating}
                  </span>
                  <span className="text-slate-500 ml-1">
                    ({manga.votes} users)
                  </span>
                </div>
                <div className="h-4 w-px bg-slate-700"></div>
                <div className="flex items-center gap-2 text-slate-300">
                  <List className="w-4 h-4" />
                  <span>Rank {manga.rank}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {manga.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded bg-[#1e293b] border border-slate-700 text-blue-300 text-xs font-bold uppercase tracking-wide hover:bg-slate-700 transition cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mb-8">
              <p className="text-slate-300 leading-relaxed text-base">
                {manga.description}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-4 mb-12">
              {firstChapterId ? (
                <Link
                  href={`/read/${firstChapterId}`}
                  className="flex-1 sm:flex-none px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-black rounded-lg font-bold text-base flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20"
                >
                  <BookOpen size={20} /> Start Reading Vol 1
                </Link>
              ) : (
                <button
                  disabled
                  className="px-8 py-3.5 bg-slate-700 text-slate-400 rounded-lg font-bold cursor-not-allowed"
                >
                  No Chapters Available
                </button>
              )}

              {/* 👇 GANTI TOMBOL STATIS DENGAN INI */}
              <MangaActions
                manga={{
                  id: manga.id,
                  title: manga.title,
                  cover: manga.cover,
                  status: manga.status,
                }}
              />
            </div>

            {/* ... Chapter List (Kode sama) ... */}
            <div className="bg-[#111827] rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161f32]">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">Chapters</h2>
                  <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full font-bold">
                    {chapters.length}
                  </span>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Find chapter..."
                    className="bg-[#0B1120] border border-slate-700 text-slate-300 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-blue-500 w-full sm:w-64"
                  />
                </div>
              </div>
              <div className="divide-y divide-slate-800/50 max-h-[800px] overflow-y-auto custom-scrollbar">
                {chapters.map((ch: any) => (
                  <Link
                    href={`/read/${ch.id}`}
                    key={ch.id}
                    className="block p-4 sm:px-6 hover:bg-slate-800/50 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition">
                          <BookOpen size={18} />
                        </div>
                        <div>
                          <h4 className="text-white font-bold group-hover:text-amber-500 transition">
                            {ch.chapter ? `Chapter ${ch.chapter}` : "Oneshot"}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <span className="truncate max-w-[100px] sm:max-w-none">
                              {ch.title || `Chapter ${ch.chapter}`}
                            </span>
                            <span>•</span>
                            <span>{ch.scanGroup}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-600 hidden sm:block">
                          {formatTimeAgo(ch.publishAt)}
                        </span>
                        <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-500 opacity-0 group-hover:opacity-100 transition">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                {chapters.length === 0 && (
                  <div className="p-10 text-center text-slate-500">
                    No chapters found in English/Indonesian.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
