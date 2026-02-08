"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  BookOpen,
  Settings,
  Circle,
  Loader2,
  Link as LinkIcon,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useLibrary } from "@/context/LibraryContext";
import { generateCodeVerifier } from "@/lib/mal-auth";
import Cookies from "js-cookie";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "system">("content");
  const { library } = useLibrary();
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // State untuk menyimpan data user MyAnimeList
  const [malUser, setMalUser] = useState<any>(null);

  // Fungsi untuk mengambil profil MAL jika token tersedia
  const fetchMALProfile = async () => {
    const token = Cookies.get("mal_access_token");
    if (!token) return;

    try {
      const res = await fetch(
        "https://api.myanimelist.net/v2/users/@me?fields=main_picture",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();

      if (!data.error) {
        setMalUser(data);
      } else {
        // Jika token expired atau error, hapus cookie
        Cookies.remove("mal_access_token");
      }
    } catch (err) {
      console.error("Gagal mengambil profil MAL:", err);
    }
  };

  // Fungsi untuk mengecek update chapter terbaru secara otomatis
  const fetchUpdates = async () => {
    if (library.length === 0) return;
    setLoading(true);

    try {
      const checkList = library.slice(0, 5);
      const updateData = await Promise.all(
        checkList.map(async (manga) => {
          const res = await fetch(
            `https://api.mangadex.org/manga/${manga.id}/feed?limit=1&order[chapter]=desc&translatedLanguage[]=en`,
          );
          const data = await res.json();
          const latestChapter = data.data[0]?.attributes?.chapter || "??";

          return {
            id: manga.id,
            title: manga.title,
            chapter: latestChapter,
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

  // Efek untuk menjalankan fetch data
  useEffect(() => {
    if (isOpen) {
      fetchMALProfile(); // Cek login MAL setiap kali dropdown dibuka
      if (activeTab === "content") {
        fetchUpdates();
      }
    }
  }, [isOpen, activeTab]);

  // LOGIKA LOGIN MAL
  const handleMALLogin = () => {
    const verifier = generateCodeVerifier();
    Cookies.set("mal_code_verifier", verifier, { expires: 1 / 144 });

    const clientId = process.env.NEXT_PUBLIC_MAL_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_MAL_REDIRECT_URI;

    const url = `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${clientId}&code_challenge=${verifier}&code_challenge_method=plain&redirect_uri=${encodeURIComponent(redirectUri!)}`;

    window.location.href = url;
  };

  // LOGIKA LOGOUT MAL
  const handleMALLogout = () => {
    Cookies.remove("mal_access_token");
    setMalUser(null);
  };

  const systemUpdates = [
    {
      id: 1,
      title: "System v1.2",
      desc: "MAL Auto-Tracker integration ready.",
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
        {(library.length > 0 || malUser) && (
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
            {/* TABS */}
            <div className="flex border-b border-white/5 bg-white/5 font-bold uppercase tracking-tighter text-[10px]">
              <button
                onClick={() => setActiveTab("content")}
                className={`flex-1 py-4 transition ${activeTab === "content" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-slate-500"}`}
              >
                Updates ({library.length})
              </button>
              <button
                onClick={() => setActiveTab("system")}
                className={`flex-1 py-4 transition ${activeTab === "system" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-slate-500"}`}
              >
                System
              </button>
            </div>

            {/* LIST NOTIFIKASI */}
            <div className="max-h-[350px] overflow-y-auto">
              {activeTab === "content" ? (
                <>
                  {loading ? (
                    <div className="flex flex-col items-center py-10 text-slate-500">
                      <Loader2 className="animate-spin mb-2" />
                      <p className="text-xs font-medium">
                        Checking library updates...
                      </p>
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
                    <div className="p-10 text-center text-slate-500 text-xs font-medium">
                      No updates in library.
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

            {/* USER PROFILE / LOGIN MAL (Action Area) */}
            <div className="p-4 bg-white/5 space-y-2 border-t border-white/5">
              {malUser ? (
                <div className="flex items-center gap-3 p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                  <img
                    src={
                      malUser.main_picture?.medium ||
                      "https://cdn.myanimelist.net/images/userimages/default.jpg"
                    }
                    className="w-10 h-10 rounded-full border-2 border-indigo-400 shadow-md"
                    alt="avatar"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">
                      Connected to MAL
                    </p>
                    <p className="text-sm font-bold text-white truncate lowercase">
                      @{malUser.name.replace(/\s+/g, "")}
                    </p>
                  </div>
                  <button
                    onClick={handleMALLogout}
                    className="p-2 text-slate-500 hover:text-red-400 transition"
                    title="Logout from MAL"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleMALLogin}
                  className="w-full py-3 bg-[#2e51a2] hover:bg-[#1c3a81] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                >
                  <LinkIcon size={14} />
                  Connect MyAnimeList
                </button>
              )}

              <Link
                href="/library"
                onClick={() => setIsOpen(false)}
                className="block py-2 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition"
              >
                Manage Your Library
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
