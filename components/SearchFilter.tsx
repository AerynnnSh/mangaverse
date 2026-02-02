"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDownUp } from "lucide-react";

export default function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <ArrowDownUp size={16} />
        <span className="hidden sm:inline">Sort by:</span>
      </div>

      <div className="relative">
        <select
          onChange={handleSortChange}
          defaultValue={searchParams.get("sort") || "popular"}
          className="appearance-none bg-[#1e293b] border border-slate-700 text-white text-sm rounded-lg pl-4 pr-10 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer hover:bg-slate-800 transition"
        >
          {/* 👇 HAPUS Opsi Rating, Sisakan yang valid */}
          <option value="rank-high">Most Popular (Rank High)</option>
          <option value="rank-low">Least Popular (Rank Low)</option>
          <option value="latest">Newest Added</option>
          <option value="oldest">Oldest Added</option>
          <option value="az">A - Z</option>
          <option value="za">Z - A</option>
        </select>

        {/* Custom Arrow Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
