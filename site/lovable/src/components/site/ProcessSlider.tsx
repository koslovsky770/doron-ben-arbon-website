import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type ProcessStep = { number: string; title: string; text: string };

type ProcessSliderProps = {
  title: string;
  steps: readonly ProcessStep[];
  closing: string;
};

/**
 * Editorial "how it works" slider: one large active card with the next
 * card peeking in, a thin progress line instead of dots, mouse drag on
 * desktop (native touch scroll handles mobile), and a subtle
 * opacity/scale falloff driven by each card's distance from center.
 */
export function ProcessSlider({ title, steps, closing }: ProcessSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; scrollStart: number } | null>(null);
  const [active, setActive] = useState(0);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    if (!cards.length) return;
    const trackRect = track.getBoundingClientRect();
    const center = trackRect.left + trackRect.width / 2;
    let minDist = Infinity;
    let activeIndex = 0;
    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const dist = Math.abs(r.left + r.width / 2 - center);
      const norm = Math.min(1, dist / (trackRect.width / 2));
      // text stays fully white/legible — only a faint scale hints at focus
      card.style.transform = `scale(${1 - norm * 0.05})`;
      if (dist < minDist) {
        minDist = dist;
        activeIndex = i;
      }
    });
    setActive(activeIndex);
  }, []);

  useEffect(() => {
    measure();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      track.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const scrollByStep = (direction: "next" | "prev") => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild as HTMLElement | null;
    const step = (first?.offsetWidth ?? track.clientWidth) + 24;
    // in RTL a positive scrollLeft moves backwards, so "next" scrolls negative
    track.scrollBy({ left: step * (direction === "next" ? -1 : 1), behavior: "smooth" });
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return; // native touch scrolling handles mobile
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = { startX: e.clientX, scrollStart: track.scrollLeft };
    track.setPointerCapture(e.pointerId);
    track.classList.add("cursor-grabbing");
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !dragRef.current) return;
    track.scrollLeft = dragRef.current.scrollStart - (e.clientX - dragRef.current.startX);
  };
  const endDrag = () => {
    trackRef.current?.classList.remove("cursor-grabbing");
    dragRef.current = null;
  };

  return (
    <section className="relative z-10 bg-ink-13 py-16 lg:py-[88px]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">
        <h2 className="font-display text-d2 font-bold tracking-tight text-ink-2">{title}</h2>

        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          className="mt-10 flex cursor-grab touch-pan-x snap-x snap-mandatory gap-6 overflow-x-auto pb-2 lg:mt-14 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {steps.map((step) => (
            <article
              key={step.number}
              className="flex w-[85%] shrink-0 snap-start flex-col gap-4 rounded-2xl border border-ink-10 bg-ink-12 p-8 transition-transform duration-300 ease-out sm:w-[70%] lg:w-[56%] lg:p-10"
            >
              <span className="font-display text-[64px] font-extrabold leading-none text-brand lg:text-[88px]">
                {step.number}
              </span>
              <h3 className="font-display text-2xl font-bold text-ink-2 lg:text-3xl">{step.title}</h3>
              <p className="max-w-[46ch] text-[17px] leading-[1.6] text-ink-6">{step.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-6">
          <span className="ltr shrink-0 text-sm tabular-nums text-ink-7">
            {String(active + 1).padStart(2, "0")}
            <span className="text-ink-10">/{String(steps.length).padStart(2, "0")}</span>
          </span>
          <div className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-ink-10">
            <div
              className="absolute inset-y-0 right-0 rounded-full bg-brand transition-[width] duration-300 ease-out"
              style={{ width: `${((active + 1) / steps.length) * 100}%` }}
            />
          </div>
          <div className="flex shrink-0 gap-2.5">
            <button
              type="button"
              onClick={() => scrollByStep("prev")}
              aria-label="השלב הקודם"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-ink-10 bg-ink-12 text-ink-4 transition-colors hover:bg-ink-11"
            >
              <ArrowRight className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scrollByStep("next")}
              aria-label="השלב הבא"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-ink-10 bg-ink-12 text-ink-4 transition-colors hover:bg-ink-11"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>

        <p className="mt-10 max-w-[820px] font-display text-2xl font-bold leading-[1.3] text-ink-2 lg:text-[32px]">
          {closing}
        </p>
      </div>
    </section>
  );
}
