import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { GoogleG, StarMark } from "@/components/site/Icons";
import {
  googleBusiness,
  googleReviews,
  googleReviewsSection,
  type GoogleReview,
} from "@/data/site";

const AUTOPLAY_MS = 7000;

function ReviewSlide({ review }: { review: GoogleReview }) {
  return (
    <figure className="w-full shrink-0 px-1">
      <div className="mx-auto flex max-w-[900px] flex-col gap-7 rounded-2xl border border-ink-10 bg-ink-12 p-7 sm:p-10">
        <div className="flex items-center gap-4">
          <div
            aria-hidden
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand font-display text-xl font-bold text-white"
          >
            {review.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-ink-4">{review.author}</p>
            <p className="text-sm text-ink-7">{review.when}</p>
          </div>
          <GoogleG className="h-6 w-6 shrink-0" />
        </div>

        <div className="flex items-center gap-[3px]" aria-label={`${review.rating} מתוך 5`}>
          {Array.from({ length: review.rating }).map((_, i) => (
            <StarMark key={i} className="h-5 w-5 text-[#F5B02E]" />
          ))}
        </div>

        <blockquote className="font-display text-[19px] font-medium leading-[1.45] text-ink-4 sm:text-[22px] sm:leading-[1.4]">
          {review.text}
        </blockquote>
      </div>
    </figure>
  );
}

export function GoogleReviews() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = googleReviews.length;

  const go = useCallback(
    (next: number) => setIndex(((next % total) + total) % total),
    [total],
  );

  useEffect(() => {
    if (paused || total < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % total), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, total]);

  return (
    <section id="reviews" className="relative z-10 py-20 lg:py-[88px]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">
        {/* header */}
        <div className="mx-auto max-w-[1000px] text-center">
          <div className="flex items-center justify-center gap-5">
            <h2 className="font-display text-d2 font-bold tracking-tight text-ink-2">
              {googleReviewsSection.title}
            </h2>
            <GoogleG className="h-9 w-9 shrink-0" />
          </div>

          {/* live rating badge */}
          <div className="mt-8 inline-flex items-center gap-4 rounded-xl border border-ink-10 bg-ink-12 px-6 py-4">
            <span className="font-display text-[32px] font-bold leading-none text-ink-2 ltr">
              {googleBusiness.rating.toFixed(1)}
            </span>
            <span className="h-8 w-px bg-ink-10" aria-hidden />
            <span className="flex flex-col items-start gap-1.5">
              <span className="flex items-center gap-[3px]" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarMark key={i} className="h-4 w-4 text-[#F5B02E]" />
                ))}
              </span>
              <span className="text-sm text-ink-7">
                {googleBusiness.reviewCount} ביקורות בגוגל
              </span>
            </span>
          </div>
        </div>

        {/* carousel */}
        <div
          className="mt-12 lg:mt-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="overflow-hidden" aria-live="polite">
            <div
              className="flex w-full transition-transform duration-500 ease-out"
              /* RTL: slide 0 sits at the right edge, so later slides need a
                 positive X shift to come into view */
              style={{ transform: `translateX(${index * 100}%)` }}
            >
              {googleReviews.map((review) => (
                <ReviewSlide key={review.id} review={review} />
              ))}
            </div>
          </div>

          {/* controls */}
          <div className="mt-8 flex items-center justify-between gap-6">
            <a
              href={googleBusiness.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-ink-4 underline underline-offset-4 transition-colors hover:text-brand"
            >
              {googleReviewsSection.allReviewsLabel}
            </a>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2" role="tablist" aria-label="בחירת ביקורת">
                {googleReviews.map((review, i) => (
                  <button
                    key={review.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`ביקורת ${i + 1}`}
                    onClick={() => go(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === index ? "w-7 bg-brand" : "w-2 bg-ink-10 hover:bg-ink-7"
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="הביקורת הקודמת"
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-ink-10 bg-ink-12 text-ink-4 transition-colors hover:bg-ink-11"
                >
                  <ArrowRight className="h-5 w-5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="הביקורת הבאה"
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-ink-10 bg-ink-12 text-ink-4 transition-colors hover:bg-ink-11"
                >
                  <ArrowLeft className="h-5 w-5" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
