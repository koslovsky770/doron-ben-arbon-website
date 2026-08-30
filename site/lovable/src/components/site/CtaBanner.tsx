import { MessageCircle } from "lucide-react";
import { SpiroRing } from "@/components/site/Icons";
import { ctaSection } from "@/data/site";

export function CtaBanner() {
  return (
    <section className="relative z-10 px-4 py-10 sm:px-8 lg:px-12 lg:py-8">
      <div className="relative mx-auto max-w-[1344px] overflow-hidden rounded-[24px] bg-brand px-6 py-16 text-center sm:px-12 lg:py-[88px]">
        {/* corner rosettes, echoing the template's CTA block */}
        <SpiroRing
          lines={26}
          strokeWidth={0.5}
          className="pointer-events-none absolute -left-[18%] top-1/2 h-[520px] w-[520px] -translate-y-1/2 text-white/25"
        />
        <SpiroRing
          lines={26}
          strokeWidth={0.5}
          className="pointer-events-none absolute -right-[18%] top-1/2 h-[520px] w-[520px] -translate-y-1/2 text-white/25"
        />

        <div className="relative">
          <h2 className="mx-auto max-w-[900px] font-display text-d1 font-extrabold leading-[1.05] tracking-tight text-white">
            {ctaSection.titleStart}
            <span
              aria-hidden
              className="mx-3 inline-block h-[0.4em] w-[1.15em] translate-y-[-0.1em] rounded-full bg-ink-13 align-middle"
            />
            {ctaSection.titleEnd}
            <br />
            {ctaSection.titleSecondLine}
          </h2>

          <a
            href={ctaSection.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex h-[56px] items-center justify-center gap-2.5 rounded-lg bg-ink-13 px-8 text-base font-medium text-ink-4 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <MessageCircle className="h-[18px] w-[18px]" aria-hidden />
            {ctaSection.cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
