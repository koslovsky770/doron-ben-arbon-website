import { testimonialsSection } from "@/data/site";

/**
 * Secondary social proof: the three verified quotes from the printed
 * prospectus (business clients). The primary block is <GoogleReviews />.
 */
export function Testimonials() {
  return (
    <section id="testimonials" className="relative z-10 pb-20 lg:pb-[88px]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {testimonialsSection.items.map((item) => (
            <figure
              key={item.id}
              className="flex flex-col gap-5 rounded-2xl border border-ink-10 bg-ink-13 p-6"
            >
              <div className="flex items-center gap-3">
                <div
                  aria-hidden
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand font-display text-base font-bold text-white"
                >
                  {item.initials}
                </div>
                <figcaption className="min-w-0">
                  <span className="block truncate text-[15px] font-bold text-ink-4">
                    {item.author}
                  </span>
                  <span className="block truncate text-[13px] text-ink-7">{item.role}</span>
                </figcaption>
              </div>

              <blockquote className="text-[15px] leading-[1.6] text-ink-6">
                {item.quote}
              </blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
