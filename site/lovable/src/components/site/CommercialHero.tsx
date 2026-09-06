import { commercialPage } from "@/data/site";

export function CommercialHero() {
  return (
    <section className="relative overflow-x-clip bg-ink-13">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-transparent to-black/50 lg:h-[560px]"
      />

      <div className="relative mx-auto max-w-[1440px] px-4 pb-14 pt-12 sm:px-8 lg:px-16 lg:pb-[66px] lg:pt-24">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="font-display text-h3 font-bold leading-[1.05] tracking-tight text-ink-2">
            {commercialPage.hero.titleLine1}
            <br />
            {commercialPage.hero.titleLine2}
          </h1>
          <p className="max-w-[707px] text-[17px] leading-[1.6] text-ink-6 sm:text-lg">
            {commercialPage.hero.paragraph}
          </p>
        </div>

        <div className="mt-8 h-[220px] w-full overflow-hidden rounded-2xl sm:h-[360px] lg:mt-[66px] lg:h-[639px]">
          <img
            src={commercialPage.hero.image}
            alt="תיווך מסחרי בבני ברק — חנויות, משרדים ומחסנים"
            className="h-full w-full object-cover object-center"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
