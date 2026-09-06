import { RoundArrowMark } from "@/components/site/Icons";
import { CtaBanner } from "@/components/site/CtaBanner";
import { Footer } from "@/components/site/Footer";
import { GoogleReviews } from "@/components/site/GoogleReviews";
import { Navbar } from "@/components/site/Navbar";
import { Testimonials } from "@/components/site/Testimonials";
import { additionalTestimonials, testimonialsPage, testimonialsSection } from "@/data/site";

const allTestimonials = [...testimonialsSection.items, ...additionalTestimonials];

const TestimonialsPage = () => {
  return (
    <div className="min-h-[100dvh] w-full overflow-x-clip bg-ink-13">
      <Navbar current="/testimonials" />
      <main>
        <section className="relative overflow-x-clip bg-ink-13 pb-4 pt-14 lg:pb-6 lg:pt-24">
          <div className="mx-auto max-w-[1000px] px-4 text-center sm:px-8">
            <div className="flex items-center justify-center gap-4">
              <h1 className="font-display text-d1 font-extrabold tracking-tight text-ink-2">
                {testimonialsPage.title}
              </h1>
              <RoundArrowMark className="h-9 w-9 shrink-0 text-brand sm:h-10 sm:w-10" />
            </div>
            <p className="mx-auto mt-6 max-w-[700px] text-[17px] leading-[1.6] text-ink-6 sm:text-lg">
              {testimonialsPage.paragraph}
            </p>
          </div>
        </section>

        <Testimonials items={allTestimonials} />
        <GoogleReviews />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
};

export default TestimonialsPage;
