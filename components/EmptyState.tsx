"use client";

import { Search, Flame, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface EmptyStateProps {
  query: string;
  recommendations: any[];
}

export default function EmptyState({
  query,
  recommendations,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Visual Icon Section */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-500 blur-[80px] opacity-20" />
        <div className="relative w-32 h-32 bg-[#1e293b] rounded-full flex items-center justify-center border border-slate-700 shadow-2xl">
          <Search size={48} className="text-slate-500" />
          <div className="absolute -top-1 -right-1 w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/50">
            <span className="text-red-500 font-bold text-xl">!</span>
          </div>
        </div>
      </div>

      {/* Text Section */}
      <div className="text-center max-w-md px-6 mb-16">
        <h2 className="text-2xl font-bold text-white mb-3">No Results Found</h2>
        <p className="text-slate-400 leading-relaxed">
          We couldn't find any manga matching{" "}
          <span className="text-indigo-400 font-semibold italic">
            "{query}"
          </span>
          . Check for typos or try searching with different keywords.
        </p>
      </div>

      {/* Recommendation Section */}
      <div className="w-full max-w-5xl border-t border-slate-800/50 pt-16">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <Flame className="text-orange-500" /> You Might Like These Instead
          </h3>
          <Link
            href="/"
            className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition"
          >
            View Home <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {recommendations.slice(0, 5).map((manga) => (
            <Link
              href={`/manga/${manga.id}`}
              key={manga.id}
              className="group flex flex-col gap-3"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-800 border border-white/5">
                <Image
                  src={manga.cover}
                  alt={manga.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <h4 className="text-sm font-bold text-slate-200 line-clamp-1 group-hover:text-indigo-400 transition">
                {manga.title}
              </h4>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
