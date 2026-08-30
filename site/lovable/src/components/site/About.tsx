import { SpiroRing } from "@/components/site/Icons";
import { about } from "@/data/site";

function TiltedPhoto({
  src,
  alt,
  className,
  rotate,
}: {
  src: string;
  alt: string;
  className?: string;
  rotate: string;
}) {
  return (
    <div
      className={
        "absolute hidden overflow-hidden rounded-[18px] bg-brand shadow-2xl shadow-black/20 lg:block " +
        (className ?? "")
      }
      style={{ transform: `rotate(${rotate})` }}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover object-center opacity-90 mix-blend-luminosity"
        loading="lazy"
      />
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="relative overflow-x-clip bg-brand">
      <TiltedPhoto
        src={about.images[0].src}
        alt={about.images[0].alt}
        rotate="9deg"
        className="right-[2%] top-[8%] h-[292px] w-[234px] xl:right-[4%]"
      />
      <TiltedPhoto
        src={about.images[1].src}
        alt={about.images[1].alt}
        rotate="-11deg"
        className="left-[2%] top-[26%] h-[291px] w-[247px] xl:left-[3%]"
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 py-20 text-center sm:px-8 lg:px-16 lg:py-[120px]">
        <h2 className="mx-auto max-w-[920px] font-display text-d1 font-extrabold leading-[1.02] tracking-tight text-white">
          {about.titleStart}
          <span
            aria-hidden
            className="mx-3 inline-block h-[0.42em] w-[1.3em] translate-y-[-0.1em] rounded-full bg-ink-13 align-middle"
          />
          {about.titleEnd}
          <br />
          {about.titleSecondLine}
        </h2>

        <p className="mx-auto mt-7 max-w-[789px] text-[17px] leading-[1.6] text-white/85 sm:text-lg">
          {about.paragraph}
        </p>

        <a
          href={about.cta.href}
          className="relative mt-9 inline-flex h-[56px] items-center justify-center rounded-lg bg-ink-13 px-8 text-base font-medium text-ink-4 transition-transform duration-200 hover:-translate-y-0.5"
        >
          {about.cta.label}
        </a>

        <dl className="mx-auto mt-12 flex max-w-[720px] flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {about.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="font-display text-[32px] font-extrabold leading-none text-white">
                {stat.value}
              </dt>
              <dd className="mt-1.5 text-sm font-medium text-white/80">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* rosette that spills out of the teal block into the dark section below */}
      <SpiroRing
        lines={32}
        strokeWidth={0.5}
        className="pointer-events-none absolute bottom-[-58%] left-1/2 h-[135vw] max-h-[910px] w-[135vw] max-w-[910px] -translate-x-1/2 text-brand-light/25 sm:bottom-[-62%]"
      />
    </section>
  );
}
