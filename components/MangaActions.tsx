"use client";

import { useState } from "react";
import { Bookmark, Share2, Check } from "lucide-react";
import { useLibrary } from "@/context/LibraryContext";

interface MangaActionsProps {
  manga: {
    id: string;
    title: string;
    cover: string;
    status: string;
  };
}

export default function MangaActions({ manga }: MangaActionsProps) {
  const { toggleLibrary, isInLibrary } = useLibrary();
  const [isCopied, setIsCopied] = useState(false);

  const isSaved = isInLibrary(manga.id);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: manga.title,
          url: url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={() => toggleLibrary(manga)}
        className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all duration-300 border ${
          isSaved
            ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
            : "bg-white/5 hover:bg-white/10 text-white border-white/10 backdrop-blur-md"
        }`}
      >
        {isSaved ? (
          <Check size={20} className="animate-in zoom-in duration-300" />
        ) : (
          <Bookmark size={20} />
        )}
        {isSaved ? "Saved to Library" : "Add to Library"}
      </button>

      <button
        onClick={handleShare}
        className="px-5 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl transition-all backdrop-blur-md flex items-center justify-center"
      >
        {isCopied ? (
          <Check
            size={20}
            className="text-emerald-400 animate-in zoom-in duration-300"
          />
        ) : (
          <Share2 size={20} />
        )}
      </button>
    </div>
  );
}
