"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Offer } from "@/lib/types";
import { ArrowIcon } from "./Icons";
import SwatchImage from "./SwatchImage";

const INTERVAL = 6000;

// Full-width banner slider for boutique offers and new collections: auto-advances, pauses on hover,
// swipes on phones and has arrows on desktop.
export default function HeroCarousel({ slides }: { slides: Offer[] }) {
  const [[index, direction], setSlide] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (step: number) => setSlide(([i]) => [(i + step + slides.length) % slides.length, step]),
    [slides.length],
  );

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(id);
  }, [index, paused, go]);

  const slide = slides[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Offers and new collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative h-[460px] overflow-hidden rounded-[2rem] bg-ink sm:h-[520px]"
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={{
            enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0.6 }),
            center: { x: 0, opacity: 1 },
            exit: (d: number) => ({ x: d > 0 ? "-30%" : "30%", opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(1);
            else if (info.offset.x > 60) go(-1);
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${slides.length}`}
        >
          <motion.div
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: INTERVAL / 1000 + 1, ease: "linear" }}
            className="absolute inset-0"
          >
            <SwatchImage src={slide.image} alt="" className="object-[50%_30%]" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/10 sm:bg-gradient-to-r sm:from-ink/85 sm:via-ink/45 sm:to-transparent" />

          <div className="relative flex h-full flex-col justify-end p-6 pb-16 text-ivory sm:max-w-xl sm:justify-center sm:p-14">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="text-xs font-semibold tracking-[0.2em] text-gold-soft uppercase"
            >
              {slide.eyebrow}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl"
            >
              {slide.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="mt-3 max-w-md text-sm text-ivory/80 sm:text-base"
            >
              {slide.body}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.5 }}>
              <Link
                href={slide.href}
                draggable={false}
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-ivory px-6 py-3.5 text-sm font-semibold text-ink transition hover:bg-white"
              >
                {slide.cta}
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-6 bottom-6 z-10 flex items-center gap-3 sm:inset-x-14">
        <div className="flex flex-1 gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => setSlide([i, i > index ? 1 : -1])}
              className="h-1 flex-1 overflow-hidden rounded-full bg-ivory/25 sm:max-w-14"
            >
              {i === index && (
                <motion.span
                  key={`${s.id}-${paused}`}
                  initial={{ width: paused ? "100%" : "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: paused ? 0 : INTERVAL / 1000, ease: "linear" }}
                  className="block h-full bg-ivory"
                />
              )}
              {i < index && <span className="block h-full w-full bg-ivory/70" />}
            </button>
          ))}
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/30 text-ivory backdrop-blur transition hover:bg-ivory hover:text-ink"
          >
            <ArrowIcon className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/30 text-ivory backdrop-blur transition hover:bg-ivory hover:text-ink"
          >
            <ArrowIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
