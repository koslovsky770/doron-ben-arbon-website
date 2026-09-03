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
    <section
      dir="ltr"
      className="relative overflow-hidden bg-ink-13 lg:flex lg:items-stretch"
    >
      {/* faint background rosette, as in the template's "Bg elements" layer */}
      <SpiroRing
        lines={31}
        className="pointer-events-none absolute -top-[45%] right-[-25%] h-[1400px] w-[1400px] text-brand/[0.07]"
      />

      {/* image column — left on desktop, stacked on top for mobile.
          Flex (not absolute) so the text column always gets exactly what's
          left — no fixed math to keep in sync, no overlap risk.
          The section is forced dir="ltr" so "first child = left" is the
          same in every browser: whether flex-direction:row visually
          reverses under dir="rtl" is NOT consistent across browsers, so
          we don't rely on it. dir="rtl" comes back here for the Hebrew
          floating review cards inside. */}
      <div dir="rtl" className="relative h-[380px] w-full overflow-hidden sm:h-[460px] lg:h-auto lg:w-[62%] lg:shrink-0">
        <img
          src="/images/hero.jpg"
          alt="נוף לילי של מגדלי משרדים במרכז העסקים"
          className="h-full w-full object-cover object-center"
          loading="eager"
          width={1400}
          height={1050}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(2,1,0,0.35)_0%,rgba(2,1,0,0)_30%,rgba(2,1,0,0.6)_50%,rgba(2,1,0,0.92)_65%,rgb(2,1,0)_78%)]" />
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

      {/* text column — pulled left over the image's darkened right portion
          (see the gradient scrim above, tuned to be fully solid well before
          this column starts) so the block sits inside the same wide area as
          the section grids below instead of being boxed into a narrow strip
          on the right. */}
      <div
        dir="rtl"
        className="relative z-10 w-full px-4 pb-16 pt-12 sm:px-8 lg:min-h-[934px] lg:min-w-0 lg:flex-1 lg:px-16 lg:pb-[164px] lg:pt-[268px] lg:-ml-[30%]"
      >
        <div className="max-w-[1040px] animate-fade-up">
          <h1 className="font-display text-d2 font-extrabold tracking-tight text-ink-2">
            {hero.titleStart}
            <span className="text-brand">{hero.titleHighlight}</span>
            {hero.titleEnd}
          </h1>
          <p className="mt-4 max-w-[820px] text-[20px] font-semibold leading-snug text-ink-4 sm:text-[22px]">
            {hero.subtitle}
          </p>
          <p className="mt-5 max-w-[1040px] text-[17px] leading-[1.6] text-ink-6 sm:text-lg">
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
