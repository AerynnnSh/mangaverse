"use client";

import { useState, useEffect } from "react";
import { Bell, BookOpen, Settings, Circle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLibrary } from "@/context/LibraryContext";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "system">("content");
  const { library } = useLibrary(); // Mengambil data asli dari Library kamu
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fungsi untuk mengecek update chapter terbaru secara otomatis
  const fetchUpdates = async () => {
    if (library.length === 0) return;
    setLoading(true);

    try {
      // Kita ambil 3 manga terakhir yang kamu simpan untuk dicek update-nya
      const checkList = library.slice(0, 5);

      const updateData = await Promise.all(
        checkList.map(async (manga) => {
          // Fetch ke API MangaDex untuk mencari chapter terbaru
          const res = await fetch(
            `https://api.mangadex.org/manga/${manga.id}/feed?limit=1&order[chapter]=desc&translatedLanguage[]=en`,
          );
          const data = await res.json();
          const latestChapter = data.data[0]?.attributes?.chapter || "??";

          return {
            id: manga.id,
            title: manga.title,
            chapter: latestChapter,
            time: "Latest Update",
            unread: true,
          };
        }),
      );
      setUpdates(updateData);
    } catch (error) {
      console.error("Gagal mengambil update:", error);
    } finally {
      setLoading(false);
    }
  };

  // Jalankan fetch otomatis saat dropdown dibuka
  useEffect(() => {
    if (isOpen && activeTab === "content") {
      fetchUpdates();
    }
  }, [isOpen, activeTab]);

  const systemUpdates = [
    {
      id: 1,
      title: "System v1.2",
      desc: "Hero Slider & Library Sync fixed.",
      time: "Today",
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-300 hover:text-white transition group"
      >
        <Bell size={24} className="group-hover:rotate-12 transition" />
        {library.length > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#09090b]"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-4 w-80 md:w-96 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex border-b border-white/5 bg-white/5 font-bold uppercase tracking-tighter text-[10px]">
              <button
                onClick={() => setActiveTab("content")}
                className={`flex-1 py-4 transition ${activeTab === "content" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-slate-500"}`}
              >
                Manga Updates ({library.length})
              </button>
              <button
                onClick={() => setActiveTab("system")}
                className={`flex-1 py-4 transition ${activeTab === "system" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-slate-500"}`}
              >
                System Update
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {activeTab === "content" ? (
                <>
                  {loading ? (
                    <div className="flex flex-col items-center py-10 text-slate-500">
                      <Loader2 className="animate-spin mb-2" />
                      <p className="text-xs">Checking updates...</p>
                    </div>
                  ) : updates.length > 0 ? (
                    updates.map((item) => (
                      <Link
                        href={`/manga/${item.id}`}
                        key={item.id}
                        onClick={() => setIsOpen(false)}
                        className="flex items-start gap-4 p-4 hover:bg-white/5 transition border-b border-white/5 group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                          <BookOpen size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">
                            New Chapter {item.chapter} is out!
                          </p>
                        </div>
                        {item.unread && (
                          <Circle
                            size={8}
                            className="fill-indigo-500 text-indigo-500 mt-2"
                          />
                        )}
                      </Link>
                    ))
                  ) : (
                    <div className="p-10 text-center text-slate-500 text-xs">
                      No updates in your library yet.
                    </div>
                  )}
                </>
              ) : (
                systemUpdates.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-4 border-b border-white/5"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">
                      v1
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Link
              href="/library"
              className="block py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white bg-white/5 transition"
            >
              Manage Your Library
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
