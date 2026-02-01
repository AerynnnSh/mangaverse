import axios from "axios";
import Link from "next/link";

const getChapterPages = async (chapterId: string) => {
  try {
    const { data } = await axios.get(
      `https://api.mangadex.org/at-home/server/${chapterId}`,
    );
    return {
      baseUrl: data.baseUrl,
      hash: data.chapter.hash,
      files: data.chapter.data,
    };
  } catch (error) {
    return null;
  }
};

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;
  const chapterData = await getChapterPages(chapterId);

  if (!chapterData)
    return <div className="text-center text-white p-10">Gagal memuat.</div>;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center">
      <div className="fixed top-0 inset-x-0 bg-black/80 backdrop-blur p-4 flex justify-between items-center z-50 border-b border-neutral-800">
        <Link href="/" className="text-white font-bold hover:text-orange-500">
          &larr; Close
        </Link>
        <span className="text-gray-400 text-sm">MangaDex Reader</span>
      </div>

      <div className="w-full max-w-4xl pt-20 pb-10">
        {chapterData.files.map((file: string, index: number) => (
          <div key={index} className="relative w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${chapterData.baseUrl}/data/${chapterData.hash}/${file}`}
              alt={`Page ${index + 1}`}
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
