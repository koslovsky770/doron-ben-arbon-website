import { plotsPage } from "@/data/site";

/**
 * Mirrors CommercialListings / ProjectMarketingListings, but there is no real
 * plot deal yet — renders the temporary placeholder blocks from
 * `plotsPage.listings.placeholder` instead of filtering `projects`.
 */
export function PlotsListings() {
  const { listings } = plotsPage;

  return (
    <section className="relative z-10 bg-ink-13">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 py-16 sm:px-8 lg:flex-row lg:gap-[120px] lg:px-16 lg:py-[88px]">
        <div className="flex flex-col items-start gap-6 lg:w-[360px] lg:shrink-0">
          <h2 className="font-display text-d2 font-bold leading-[1.05] tracking-tight text-ink-2">
            {listings.titleLine1}
            <br />
            {listings.titleLine2}
          </h2>
          <a
            href={listings.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex w-full items-center justify-center rounded-lg bg-brand px-6 py-5 text-lg font-bold text-white btn-inner-brand"
          >
            {listings.cta.label}
          </a>
        </div>

        <div className="flex flex-1 flex-col gap-10 lg:gap-14">
          <p className="text-[17px] leading-[1.6] text-ink-6 sm:text-lg">{listings.paragraph}</p>

          {listings.placeholder.map((plot) => (
            <article key={plot.id} className="flex flex-col gap-4">
              <h3 className="font-display text-h6 font-bold leading-none text-ink-2">
                {plot.title}
              </h3>
              <p className="text-[17px] leading-[1.6] text-ink-6 sm:text-lg">{plot.description}</p>
              <div className="flex h-[240px] w-full items-center justify-center rounded-2xl border border-dashed border-ink-10 bg-ink-12 sm:h-[320px] lg:h-[372px]">
                <span className="text-sm text-ink-7">תמונה תתווסף בהמשך</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
