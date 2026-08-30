import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { RoundArrowMark } from "@/components/site/Icons";
import {
  projectFilters,
  projects,
  projectsSection,
  site,
  type ProjectCategory,
} from "@/data/site";

type Project = (typeof projects)[number];

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex w-[85vw] shrink-0 snap-start flex-col gap-8 rounded-2xl border border-ink-10 bg-ink-13 p-6 sm:w-[360px] lg:w-[calc((100%-2rem)/3)]">
      <div className="h-[220px] w-full overflow-hidden rounded-2xl sm:h-[300px]">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-d3 font-bold text-ink-4">{project.title}</h3>
          <p className="line-clamp-2-safe text-base leading-[1.5] text-ink-6">
            {project.description}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-[14px] w-[14px] shrink-0 text-ink-7" aria-hidden />
            <span className="truncate text-sm text-ink-7">{project.location}</span>
          </div>
          <ul className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="flex items-center justify-center rounded-lg border border-ink-10 bg-ink-12 px-4 py-2 text-xs text-ink-6"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <a
          href={site.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center justify-center rounded-lg bg-brand px-6 py-4 text-base font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-light"
        >
          {projectsSection.cardCta}
        </a>
      </div>
    </article>
  );
}

export function FeaturedProjects() {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const trackRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

  const measure = useCallback(() => {
    const el = trackRef.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    const step = first.offsetWidth + 16; // card width + gap-4
    const total = el.children.length;
    setPages(total);
    setPage(Math.min(total, Math.round(Math.abs(el.scrollLeft) / step) + 1));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, visible.length]);

  // in RTL a positive scrollLeft moves backwards, so "next" scrolls negative
  const scrollByPage = (direction: "next" | "prev") => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = (first?.offsetWidth ?? el.clientWidth) + 16;
    const delta = step * (direction === "next" ? -1 : 1);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section id="projects" className="relative z-10 py-20 lg:py-[128px]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">
        {/* header */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[796px]">
            <div className="flex items-center gap-6">
              <RoundArrowMark className="h-[38px] w-[38px] shrink-0 text-brand" />
              <h2 className="font-display text-d2 font-extrabold tracking-tight text-ink-2">
                {projectsSection.title}
              </h2>
            </div>
            <p className="mt-6 text-[17px] leading-[1.6] text-ink-6 sm:text-lg">
              {projectsSection.paragraph}
            </p>
          </div>

          <a
            href={projectsSection.cta.href}
            className="relative flex h-[56px] shrink-0 items-center justify-center self-start rounded-lg bg-ink-12 px-6 text-base font-medium text-ink-4 transition-colors hover:bg-ink-11 lg:self-end btn-inner-dark"
          >
            {projectsSection.cta.label}
          </a>
        </div>

        {/* category tabs */}
        <div className="mt-10 overflow-x-auto pb-1 lg:mt-12">
          <div
            role="tablist"
            aria-label="סינון פרויקטים לפי תחום"
            className="inline-flex gap-0 rounded-xl border border-ink-10 bg-ink-12 p-2"
          >
            {projectFilters.map((tab) => {
              const active = tab.id === filter;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(tab.id)}
                  className={`flex h-[53px] items-center justify-center whitespace-nowrap rounded-lg border px-5 text-[15px] font-medium transition-colors sm:text-base ${
                    active
                      ? "border-ink-10 bg-ink-13 text-ink-4"
                      : "border-transparent text-ink-7 hover:text-ink-4"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* cards */}
        {visible.length > 0 ? (
          <>
            <div
              ref={trackRef}
              onScroll={measure}
              className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mt-[72px]"
            >
              {visible.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between lg:mt-[32px]">
              <span className="text-base tabular-nums text-ink-4 ltr">
                {String(page).padStart(2, "0")}
                <span className="text-ink-7">/{String(pages).padStart(2, "0")}</span>
              </span>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => scrollByPage("prev")}
                  aria-label="הפרויקטים הקודמים"
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-ink-10 bg-ink-12 text-ink-4 transition-colors hover:bg-ink-11"
                >
                  <ArrowRight className="h-5 w-5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByPage("next")}
                  aria-label="הפרויקטים הבאים"
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-ink-10 bg-ink-12 text-ink-4 transition-colors hover:bg-ink-11"
                >
                  <ArrowLeft className="h-5 w-5" aria-hidden />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-10 flex flex-col items-start gap-6 rounded-2xl border border-ink-10 bg-ink-12 p-8 sm:flex-row sm:items-center sm:justify-between lg:mt-[72px] lg:p-12">
            <p className="max-w-[640px] text-[17px] leading-[1.6] text-ink-6">
              {projectsSection.emptyState}
            </p>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex h-[56px] shrink-0 items-center justify-center rounded-lg bg-brand px-6 text-base font-bold text-white btn-inner-brand"
            >
              דברו איתי
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
