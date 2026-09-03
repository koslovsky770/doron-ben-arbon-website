import { LogoMark } from "@/components/site/Icons";
import { site } from "@/data/site";

/**
 * Horizontal lockup: existing DORON mark + wordmark + tagline.
 * NOTE: this is a faithful vector rebuild of the raster logo we were given —
 * swap in the original vector file when Doron supplies it.
 *
 * `size` controls the lockup: "md" in the footer, "lg" in the header.
 */
export function Logo({
  size = "md",
  showTagline = true,
}: {
  size?: "md" | "lg";
  showTagline?: boolean;
}) {
  const lg = size === "lg";

  return (
    <a
      href="/"
      className="group flex shrink-0 items-center gap-3"
      aria-label={`${site.name} — ${site.business}`}
    >
      <LogoMark
        className={`shrink-0 text-brand transition-transform duration-300 group-hover:scale-105 ${
          lg ? "h-11 w-11 lg:h-[56px] lg:w-[56px]" : "h-[34px] w-[34px]"
        }`}
      />
      <span className="flex flex-col justify-center leading-none">
        <span
          className={`font-display font-bold leading-none tracking-tight text-ink-2 ${
            lg ? "text-[26px] lg:text-[34px]" : "text-[23px]"
          }`}
        >
          {site.shortName}
        </span>
        {showTagline && (
          <span
            className={`font-medium leading-none text-ink-7 ${
              lg ? "mt-1 text-[11px] lg:text-[13px]" : "mt-[3px] text-[10px]"
            }`}
          >
            {site.tagline}
          </span>
        )}
      </span>
    </a>
  );
}
