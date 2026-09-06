import { renderBold } from "@/components/site/RichText";
import { about, aboutPage } from "@/data/site";

export function AboutHero() {
  return (
    <section className="relative overflow-x-clip bg-ink-13">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-transparent to-black/50 lg:h-[560px]"
      />

      <div className="relative mx-auto max-w-[1440px] px-4 pb-14 pt-12 sm:px-8 lg:px-16 lg:pb-[66px] lg:pt-24">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="font-display text-h3 font-bold leading-[1.05] tracking-tight text-ink-2">
            {aboutPage.hero.titleLine1}
            <br />
            {aboutPage.hero.titleLine2}
          </h1>
          <p className="max-w-[707px] text-[17px] leading-[1.6] text-ink-6 sm:text-lg">
            {renderBold(about.paragraph)}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-2 sm:flex-row lg:mt-[66px]">
          <div className="h-[240px] w-full overflow-hidden rounded-2xl sm:h-[360px] lg:h-[484px] lg:flex-1">
            <img
              src={aboutPage.hero.images[0].src}
              alt={aboutPage.hero.images[0].alt}
              className="h-full w-full object-cover object-center"
              loading="eager"
            />
          </div>
          <div className="h-[240px] w-full overflow-hidden rounded-2xl sm:h-[360px] lg:h-[484px] lg:w-[368px] lg:shrink-0">
            <img
              src={aboutPage.hero.images[1].src}
              alt={aboutPage.hero.images[1].alt}
              className="h-full w-full object-cover object-center"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
