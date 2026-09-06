import { AsteriskMark } from "@/components/site/Icons";
import { about, aboutPage, googleBusiness } from "@/data/site";

export function Achievements() {
  const stats = [
    ...about.stats,
    { value: googleBusiness.rating.toFixed(1), label: `דירוג ב־${googleBusiness.reviewCount} ביקורות בגוגל` },
  ];

  return (
    <section className="relative z-10 py-16 lg:py-[88px]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[900px] text-center">
          <div className="flex items-center justify-center gap-4">
            <h2 className="font-display text-d2 font-bold tracking-tight text-ink-2">
              {aboutPage.achievements.title}
            </h2>
            <AsteriskMark className="h-8 w-8 shrink-0 text-brand" />
          </div>
          <p className="mx-auto mt-5 max-w-[600px] text-[17px] leading-[1.6] text-ink-6 sm:text-lg">
            {aboutPage.achievements.paragraph}
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-[1312px] grid-cols-2 gap-2 lg:mt-12 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex h-24 flex-col justify-center gap-2 rounded-lg border border-ink-10 px-4 py-3 sm:px-6"
            >
              <p className="font-display text-h6 font-bold leading-none text-ink-2">{stat.value}</p>
              <p className="text-sm font-medium leading-[1.4] text-ink-6 sm:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
