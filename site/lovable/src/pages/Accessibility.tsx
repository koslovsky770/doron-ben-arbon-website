import { ConsentBanner } from "@/components/site/ConsentBanner";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { accessibilityPage } from "@/data/site";

const Accessibility = () => {
  return (
    <div className="min-h-[100dvh] w-full overflow-x-clip bg-ink-13">
      <Navbar current="/accessibility" />
      <main>
        <section className="relative overflow-x-clip bg-ink-13 pb-4 pt-14 lg:pb-6 lg:pt-24">
          <div className="mx-auto max-w-[820px] px-4 sm:px-8">
            <h1 className="font-display text-d1 font-extrabold tracking-tight text-ink-2">
              {accessibilityPage.title}
            </h1>
            <p className="mt-4 text-sm text-ink-7">{accessibilityPage.updated}</p>
            <p className="mt-6 text-[17px] leading-[1.6] text-ink-6 sm:text-lg">
              {accessibilityPage.intro}
            </p>
          </div>
        </section>

        <section className="relative z-10 pb-20 lg:pb-[88px]">
          <div className="mx-auto flex max-w-[820px] flex-col gap-10 px-4 sm:px-8">
            {accessibilityPage.sections.map((section) => (
              <div key={section.heading} className="border-t border-ink-10 pt-8">
                <h2 className="font-display text-xl font-bold text-ink-2">{section.heading}</h2>
                <p className="mt-3 text-[17px] leading-[1.6] text-ink-6">{section.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <ConsentBanner />
    </div>
  );
};

export default Accessibility;
