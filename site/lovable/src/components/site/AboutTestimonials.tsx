import { RoundArrowMark } from "@/components/site/Icons";
import { Testimonials } from "@/components/site/Testimonials";
import { aboutPage } from "@/data/site";

export function AboutTestimonials() {
  return (
    <section className="relative z-10 pt-4 lg:pt-6">
      <div className="mx-auto max-w-[1440px] px-4 pb-10 text-center sm:px-8 lg:px-16">
        <div className="flex items-center justify-center gap-4">
          <h2 className="font-display text-d2 font-bold tracking-tight text-ink-2">
            {aboutPage.testimonials.title}
          </h2>
          <RoundArrowMark className="h-8 w-8 shrink-0 text-brand" />
        </div>
      </div>
      <Testimonials />
      <div className="mx-auto max-w-[1440px] px-4 pb-4 text-center sm:px-8 lg:px-16 lg:pb-6">
        <a
          href={aboutPage.testimonials.cta.href}
          className="inline-flex items-center gap-2 text-base font-medium text-ink-4 underline underline-offset-4 transition-colors hover:text-brand"
        >
          {aboutPage.testimonials.cta.label}
        </a>
      </div>
    </section>
  );
}
