"use server";

import { getPopularManga } from "@/lib/api";

export async function loadMoreManga(offset: number) {
  // Panggil API dengan offset baru
  const data = await getPopularManga(offset);
  return data;
}
