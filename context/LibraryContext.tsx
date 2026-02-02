"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface Manga {
  id: string;
  title: string;
  cover: string;
  status: string;
}

interface LibraryContextType {
  library: Manga[];
  toggleLibrary: (manga: Manga) => void;
  isInLibrary: (id: string) => boolean;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [library, setLibrary] = useState<Manga[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("manga_library");
    if (saved) setLibrary(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("manga_library", JSON.stringify(library));
  }, [library]);

  const toggleLibrary = (manga: Manga) => {
    setLibrary((prev) => {
      const exists = prev.find((item) => item.id === manga.id);
      if (exists) {
        return prev.filter((item) => item.id !== manga.id);
      }
      return [manga, ...prev];
    });
  };

  const isInLibrary = (id: string) => library.some((item) => item.id === id);

  return (
    <LibraryContext.Provider value={{ library, toggleLibrary, isInLibrary }}>
      {children}
    </LibraryContext.Provider>
  );
}

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context)
    throw new Error("useLibrary must be used within LibraryProvider");
  return context;
};
