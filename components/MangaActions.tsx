"use client";

import { useState, useEffect } from "react";
import { Bookmark, Share2, Check, Copy } from "lucide-react";

interface MangaActionsProps {
  manga: {
    id: string;
    title: string;
    cover: string;
    status: string;
  };
}

export default function MangaActions({ manga }: MangaActionsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // 1. Cek LocalStorage saat pertama load
  useEffect(() => {
    const library = JSON.parse(localStorage.getItem("manga_library") || "[]");
    const exists = library.some((item: any) => item.id === manga.id);
    setIsSaved(exists);
  }, [manga.id]);

  // 2. Logic Add/Remove Library
  const toggleLibrary = () => {
    const library = JSON.parse(localStorage.getItem("manga_library") || "[]");

    if (isSaved) {
      // Remove
      const newLibrary = library.filter((item: any) => item.id !== manga.id);
      localStorage.setItem("manga_library", JSON.stringify(newLibrary));
      setIsSaved(false);
    } else {
      // Add
      library.push(manga);
      localStorage.setItem("manga_library", JSON.stringify(library));
      setIsSaved(true);
    }
  };

  // 3. Logic Share
  const handleShare = async () => {
    const url = window.location.href;

    // Jika di HP, pakai Native Share
    if (navigator.share) {
      try {
        await navigator.share({
          title: manga.title,
          text: `Read ${manga.title} on MangaVerse!`,
          url: url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Jika di PC, Copy to Clipboard
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset icon setelah 2 detik
    }
  };

  return (
    <>
      <button
        onClick={toggleLibrary}
        className={`px-6 py-3.5 rounded-lg font-bold flex items-center gap-2 transition border ${
          isSaved
            ? "bg-indigo-600 border-indigo-500 text-white"
            : "bg-[#1e293b] hover:bg-slate-700 text-white border-slate-600"
        }`}
      >
        {isSaved ? <Check size={20} /> : <Bookmark size={20} />}
        {isSaved ? "Saved" : "Add to Library"}
      </button>

      <button
        onClick={handleShare}
        className="px-4 py-3.5 bg-[#1e293b] hover:bg-slate-700 text-white border border-slate-600 rounded-lg transition flex items-center justify-center min-w-[3.5rem]"
        title="Share"
      >
        {isCopied ? (
          <Check size={20} className="text-emerald-400" />
        ) : (
          <Share2 size={20} />
        )}
      </button>
    </>
  );
}
