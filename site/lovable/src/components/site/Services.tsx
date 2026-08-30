import { ArrowLeft } from "lucide-react";
import { RoundArrowMark } from "@/components/site/Icons";
import { servicesSection } from "@/data/site";

export function Services() {
  return (
    <section id="services" className="relative z-10 py-20 lg:py-[88px]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1000px] text-center">
          <div className="flex items-center justify-center gap-5">
            <h2 className="font-display text-d2 font-extrabold tracking-tight text-ink-2">
              {servicesSection.title}
            </h2>
            <RoundArrowMark className="h-[38px] w-[38px] shrink-0 text-brand" />
          </div>
          <p className="mx-auto mt-6 max-w-[674px] text-[17px] leading-[1.6] text-ink-6 sm:text-lg">
            {servicesSection.paragraph}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-[72px] lg:grid-cols-3">
          {servicesSection.items.map((service) => (
            <article
              key={service.id}
              className="group flex flex-col gap-8 rounded-2xl border border-ink-10 bg-ink-12 p-6"
            >
              <div className="h-[220px] w-full overflow-hidden rounded-2xl">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-1 flex-col gap-3">
                <h3 className="font-display text-d3 font-bold text-ink-4">{service.title}</h3>
                <p className="text-base leading-[1.5] text-ink-6">{service.description}</p>
              </div>

              <a
                href={service.href}
                className="inline-flex items-center gap-2 self-start text-base font-medium text-ink-4 underline underline-offset-4 transition-colors hover:text-brand"
              >
                {servicesSection.linkLabel}
                <ArrowLeft
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
                  aria-hidden
                />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
