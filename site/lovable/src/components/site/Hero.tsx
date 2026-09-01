import { MessageCircle, Phone } from "lucide-react";
import { SpiroRing, Stars } from "@/components/site/Icons";
import { hero } from "@/data/site";

function FloatingReview({
  review,
  className,
}: {
  review: (typeof hero.reviews)[number];
  className?: string;
}) {
  return (
    <figure
      className={
        "flex w-[300px] items-center gap-4 rounded-xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-md sm:w-[330px] " +
        (className ?? "")
      }
    >
      <div
        aria-hidden
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand font-display text-sm font-bold text-white"
      >
        {review.initials}
      </div>
      <div className="min-w-0">
        <Stars count={review.stars} />
        <blockquote className="mt-2 text-[15px] font-medium leading-snug text-white">
          {review.quote}
        </blockquote>
        <figcaption className="mt-1.5 text-[11px] font-semibold text-white/70">
          {review.author} <span className="font-normal">| {review.role}</span>
        </figcaption>
      </div>
    </figure>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-13">
      {/* faint background rosette, as in the template's "Bg elements" layer */}
      <SpiroRing
        lines={31}
        className="pointer-events-none absolute -top-[45%] right-[-25%] h-[1400px] w-[1400px] text-brand/[0.07]"
      />

      {/* image column — left on desktop, stacked on top for mobile */}
      <div className="relative h-[380px] w-full sm:h-[460px] lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-1/2">
        <img
          src="/images/hero.jpg"
          alt="נוף לילי של מגדלי משרדים במרכז העסקים"
          className="h-full w-full object-cover object-center"
          loading="eager"
          width={1200}
          height={1600}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-13/40 via-transparent to-ink-13" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-13 to-transparent lg:hidden" />

        <FloatingReview
          review={hero.reviews[0]}
          className="absolute left-4 top-6 hidden animate-fade-up sm:flex lg:left-[8%] lg:top-[9%]"
        />
        <FloatingReview
          review={hero.reviews[1]}
          className="absolute bottom-6 right-4 hidden animate-fade-up sm:flex lg:bottom-auto lg:right-[3%] lg:top-[66%]"
        />
      </div>

      {/* text column */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-16 pt-12 sm:px-8 lg:min-h-[934px] lg:px-16 lg:pb-[164px] lg:pt-[268px]">
        <div className="max-w-[680px] animate-fade-up">
          <h1 className="font-display text-d2 font-extrabold tracking-tight text-ink-2">
            {hero.titleStart}
            <span className="text-brand">{hero.titleHighlight}</span>
            {hero.titleEnd}
          </h1>
          <p className="mt-4 max-w-[600px] text-[20px] font-semibold leading-snug text-ink-4 sm:text-[22px]">
            {hero.subtitle}
          </p>
          <p className="mt-5 max-w-[680px] text-[17px] leading-[1.6] text-ink-6 sm:text-lg">
            {hero.paragraph}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4 sm:gap-8">
            <a
              href={hero.primaryCta.href}
              className="relative flex h-[59px] items-center justify-center gap-2.5 rounded-lg bg-brand px-7 text-base font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 btn-inner-brand"
            >
              <Phone className="h-[18px] w-[18px]" aria-hidden />
              {hero.primaryCta.label}
            </a>
            <a
              href={hero.secondaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex h-[59px] items-center justify-center gap-2.5 rounded-lg bg-ink-11 px-7 text-base font-medium text-ink-4 transition-colors hover:bg-ink-10 btn-inner-dark"
            >
              <MessageCircle className="h-[18px] w-[18px]" aria-hidden />
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
