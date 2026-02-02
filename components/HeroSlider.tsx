"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
// Impor komponen MangaActions agar tombol library berfungsi
import MangaActions from "@/components/MangaActions";

export default function HeroSlider({ slides }: { slides: any[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 7000);
    return () => clearInterval(timer);
  }, [current, slides.length]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => {
      let next = prev + newDirection;
      if (next >= slides.length) return 0;
      if (next < 0) return slides.length - 1;
      return next;
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "15%" : "-15%",
      opacity: 0,
      filter: "blur(10px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        x: { type: "tween", duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
        opacity: { duration: 0.6 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "15%" : "-15%",
      opacity: 0,
      filter: "blur(10px)",
      transition: {
        x: { type: "tween", duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
        opacity: { duration: 0.4 },
      },
    }),
  };

  if (!slides.length) return null;

  return (
    <div className="relative min-h-[600px] md:min-h-[750px] w-full overflow-hidden bg-[#09090b]">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Ambient */}
          <div className="absolute inset-0 z-0">
            <Image
              src={slides[current].cover}
              alt="Hero BG"
              fill
              className="object-cover opacity-20 blur-3xl scale-125"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent" />
          </div>

          <div className="container mx-auto px-6 relative z-10 h-full flex items-center pt-12 md:pt-16">
            <div className="grid md:grid-cols-2 gap-12 items-center w-full">
              {/* KONTEN TEKS (KIRI) */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-bold backdrop-blur-xl"
                >
                  <Sparkles size={14} className="animate-pulse" /> #
                  {current + 1} MOST POPULAR
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-4">
                    {slides[current].title}
                  </h1>
                  <p className="text-slate-400 text-lg line-clamp-3 max-w-lg leading-relaxed font-medium">
                    Dive into the captivating world of {slides[current].title}.
                    An epic saga of adventure and destiny awaits.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-4 pt-2"
                >
                  <Link
                    href={`/manga/${slides[current].id}`}
                    className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-3 group"
                  >
                    <span>Read Now</span>
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-2 transition-transform"
                    />
                  </Link>

                  {/* Tombol Add to Library yang sekarang berfungsi */}
                  <MangaActions
                    manga={{
                      id: slides[current].id,
                      title: slides[current].title,
                      cover: slides[current].cover,
                      status: slides[current].status,
                    }}
                  />
                </motion.div>
              </div>

              {/* AREA COVER & NAVIGASI (KANAN) */}
              <div className="hidden md:flex justify-end items-center relative gap-6">
                <button
                  onClick={() => paginate(-1)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-indigo-600 border border-white/10 text-white transition-all backdrop-blur-md"
                >
                  <ChevronLeft size={28} />
                </button>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative w-[320px] lg:w-[360px] aspect-[2/3] rounded-[2rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] border border-white/10"
                >
                  <Image
                    src={slides[current].cover}
                    alt="Cover"
                    fill
                    className="object-cover"
                  />

                  <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2 z-20">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setDirection(i > current ? 1 : -1);
                          setCurrent(i);
                        }}
                        className={`h-1.5 transition-all duration-500 rounded-full ${
                          i === current
                            ? "w-10 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"
                            : "w-2 bg-white/30 hover:bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </motion.div>

                <button
                  onClick={() => paginate(1)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-indigo-600 border border-white/10 text-white transition-all backdrop-blur-md"
                >
                  <ChevronRight size={28} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
