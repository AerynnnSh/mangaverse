import axios from "axios";

const BASE_URL = "https://api.mangadex.org";
const JIKAN_URL = "https://api.jikan.moe/v4";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "User-Agent": "MangaVerse-Project/1.0",
  },
});

const getCoverUrl = (mangaId: string, fileName: string) => {
  return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.512.jpg`;
};

// 1. Ambil Manga Populer
export const getPopularManga = async (offset = 0, limit = 20) => {
  try {
    const response = await apiClient.get("/manga", {
      params: {
        limit: limit,
        offset: offset,
        includes: ["cover_art"],
        order: { followedCount: "desc" },
        contentRating: ["safe", "suggestive"],
        hasAvailableChapters: "true",
        availableTranslatedLanguage: ["en", "id"],
      },
    });

    const mangaRaw = response.data.data || [];

    const latestChapterIds = mangaRaw
      .map((m: any) => m.attributes.latestUploadedChapter)
      .filter((id: string) => id);

    let chapterNumMap: Record<string, string> = {};

    if (latestChapterIds.length > 0) {
      try {
        const chapterResponse = await apiClient.get("/chapter", {
          params: { ids: latestChapterIds, limit: 100 },
        });
        chapterResponse.data.data.forEach((ch: any) => {
          chapterNumMap[ch.id] = ch.attributes.chapter || "Oneshot";
        });
      } catch (e) {
        console.error("Gagal fetch chapter detail:", e);
      }
    }

    const formattedManga = mangaRaw.map((manga: any) => {
      const title =
        manga.attributes.title.en || Object.values(manga.attributes.title)[0];
      const coverFile = manga.relationships.find(
        (rel: any) => rel.type === "cover_art",
      )?.attributes?.fileName;
      const latestId = manga.attributes.latestUploadedChapter;
      const lastCh = chapterNumMap[latestId] || "N/A";

      return {
        id: manga.id,
        title: title,
        cover: coverFile ? getCoverUrl(manga.id, coverFile) : null,
        status: manga.attributes.status,
        lastChapter: lastCh,
        rating: "Safe",
      };
    });

    return formattedManga.filter((m: any) => m.cover !== null);
  } catch (error) {
    console.error("Gagal ambil MangaDex:", error);
    return [];
  }
};

// 2. Ambil Detail (DIPERBARUI: Tags Dinamis dengan ID)
export const getMangaDetail = async (id: string) => {
  try {
    const response = await apiClient.get(`/manga/${id}`, {
      params: { includes: ["author", "artist", "cover_art"] },
    });

    const manga = response.data.data;
    const title =
      manga.attributes.title.en || Object.values(manga.attributes.title)[0];
    const desc =
      manga.attributes.description.en ||
      Object.values(manga.attributes.description)[0] ||
      "No description.";
    const coverFile = manga.relationships.find(
      (rel: any) => rel.type === "cover_art",
    )?.attributes?.fileName;
    const author =
      manga.relationships.find((rel: any) => rel.type === "author")?.attributes
        ?.name || "Unknown";

    // AMBIL TAGS SECARA DINAMIS (ID & NAME)
    const tags = manga.attributes.tags
      .filter(
        (tag: any) =>
          tag.attributes.group === "genre" || tag.attributes.group === "theme",
      )
      .map((tag: any) => ({
        id: tag.id, // ID asli dari MangaDex (UUID)
        name: tag.attributes.name.en,
      }));

    let malRating = "N/A";
    let malRank = "N/A";
    let malScoredBy = "0";
    let malTotalChapters = "?";

    const malId = manga.attributes.links?.mal;

    if (malId) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const jikanRes = await axios.get(`${JIKAN_URL}/manga/${malId}`);
        const jikanData = jikanRes.data.data;

        malRating = jikanData.score ? jikanData.score.toString() : "N/A";
        malRank = jikanData.rank ? `#${jikanData.rank}` : "N/A";
        malScoredBy = jikanData.scored_by
          ? jikanData.scored_by.toLocaleString()
          : "0";
        malTotalChapters = jikanData.chapters
          ? jikanData.chapters.toString()
          : "?";
      } catch (e) {
        console.warn("Gagal ambil data MAL:", e);
      }
    }

    return {
      id: manga.id,
      title: title,
      altTitle: Object.values(manga.attributes.altTitles?.[0] || {})[0] || "",
      description: desc,
      author: author,
      status: manga.attributes.status,
      year: manga.attributes.year || "N/A",
      tags: tags, // Mengembalikan [{id, name}, ...]
      cover: coverFile ? getCoverUrl(manga.id, coverFile) : "/placeholder.jpg",
      rating: malRating,
      rank: malRank,
      votes: malScoredBy,
      totalChapters: malTotalChapters,
    };
  } catch (error) {
    console.error("Error detail:", error);
    return null;
  }
};

// 3. Ambil Chapter
export const getMangaChapters = async (id: string) => {
  try {
    const response = await apiClient.get(`/manga/${id}/feed`, {
      params: {
        translatedLanguage: ["en", "id"],
        order: { chapter: "desc" },
        limit: 500,
        includes: ["scanlation_group"],
      },
    });

    return response.data.data.map((ch: any) => ({
      id: ch.id,
      chapter: ch.attributes.chapter,
      title: ch.attributes.title,
      language: ch.attributes.translatedLanguage,
      publishAt: ch.attributes.publishAt,
      scanGroup:
        ch.relationships.find((r: any) => r.type === "scanlation_group")
          ?.attributes?.name || "Unknown",
    }));
  } catch (error) {
    console.error("Error chapters:", error);
    return [];
  }
};

// 4. Cari Manga
export const searchManga = async (
  query: string,
  tag?: string,
  sortBy: string = "popular",
) => {
  try {
    const orderMap: Record<string, any> = {
      az: { title: "asc" },
      za: { title: "desc" },
      "rating-high": { rating: "desc" },
      "rating-low": { rating: "asc" },
      "rank-high": { followedCount: "desc" },
      "rank-low": { followedCount: "asc" },
      latest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
      popular: { followedCount: "desc" },
    };

    const params: any = {
      limit: 20,
      includes: ["cover_art", "author"],
      contentRating: ["safe", "suggestive"],
      availableTranslatedLanguage: ["en", "id"],
      order: orderMap[sortBy] || { followedCount: "desc" },
    };

    if (query) params.title = query;
    if (tag) params.includedTags = [tag];

    const response = await apiClient.get("/manga", { params });
    const mangaRaw = response.data.data || [];

    const latestChapterIds = mangaRaw
      .map((m: any) => m.attributes.latestUploadedChapter)
      .filter((id: string) => id);

    let chapterNumMap: Record<string, string> = {};

    if (latestChapterIds.length > 0) {
      try {
        const chapterResponse = await apiClient.get("/chapter", {
          params: { ids: latestChapterIds, limit: 100 },
        });
        chapterResponse.data.data.forEach((ch: any) => {
          chapterNumMap[ch.id] = ch.attributes.chapter || "Oneshot";
        });
      } catch (e) {
        console.error("Gagal fetch chapter detail di search:", e);
      }
    }

    return mangaRaw
      .map((manga: any) => {
        const title =
          manga.attributes.title.en || Object.values(manga.attributes.title)[0];
        const coverFile = manga.relationships.find(
          (rel: any) => rel.type === "cover_art",
        )?.attributes?.fileName;
        const author =
          manga.relationships.find((rel: any) => rel.type === "author")
            ?.attributes?.name || "Unknown";
        const latestId = manga.attributes.latestUploadedChapter;
        const lastCh = chapterNumMap[latestId] || "N/A";

        return {
          id: manga.id,
          title: title,
          author: author,
          cover: coverFile ? getCoverUrl(manga.id, coverFile) : null,
          status: manga.attributes.status,
          lastChapter: lastCh,
          rating: "Safe",
        };
      })
      .filter((m: any) => m.cover !== null);
  } catch (error) {
    console.error("Error search:", error);
    return [];
  }
};
