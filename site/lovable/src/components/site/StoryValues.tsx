import { GoogleG } from "@/components/site/Icons";
import { about, aboutPage } from "@/data/site";

export function StoryValues() {
  const { story } = aboutPage;

  return (
    <section className="relative z-10 bg-ink-13">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 py-16 sm:px-8 lg:flex-row lg:gap-[120px] lg:px-16 lg:py-[88px]">
        <div className="lg:flex-1">
          <h2 className="font-display text-d2 font-bold leading-[1.05] tracking-tight text-ink-2">
            {story.titleLine1}
            <br />
            {story.titleLine2}
          </h2>
        </div>

        <div className="flex flex-col items-start gap-6 lg:w-[707px] lg:shrink-0">
          <p className="text-[17px] leading-[1.6] text-ink-6 sm:text-lg">{story.bio}</p>

          <figure className="flex w-full flex-col gap-6 rounded-2xl border border-ink-10 p-6 sm:flex-row sm:items-start sm:p-6">
            <div
              aria-hidden
              className="flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded-2xl bg-brand font-display text-3xl font-bold text-white"
            >
              {story.quote.initials}
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <blockquote className="text-xl font-bold leading-[1.5] text-ink-4">
                &quot;{story.quote.text}&quot;
              </blockquote>
              <figcaption className="flex items-center gap-2 text-base text-ink-6">
                <GoogleG className="h-4 w-4 shrink-0" />
                {story.quote.author} · {story.quote.source}
              </figcaption>
            </div>
          </figure>

          <p className="text-[17px] leading-[1.6] text-ink-6 sm:text-lg">{about.paragraph}</p>

          <div className="text-[17px] leading-[1.6] text-ink-6 sm:text-lg">
            <p>{story.valuesIntro}</p>
            <ul className="mt-4 flex flex-col gap-3">
              {story.values.map((value) => (
                <li key={value.title} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <span>
                    <span className="font-bold text-ink-4">{value.title}</span>
                    {" — "}
                    {value.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
