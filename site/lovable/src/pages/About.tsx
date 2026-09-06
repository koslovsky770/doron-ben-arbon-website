import { AboutHero } from "@/components/site/AboutHero";
import { AboutTestimonials } from "@/components/site/AboutTestimonials";
import { Achievements } from "@/components/site/Achievements";
import { CtaBanner } from "@/components/site/CtaBanner";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { StoryValues } from "@/components/site/StoryValues";

const About = () => {
  return (
    <div className="min-h-[100dvh] w-full overflow-x-clip bg-ink-13">
      <Navbar current="/about" />
      <main>
        <AboutHero />
        <StoryValues />
        <Achievements />
        <AboutTestimonials />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
};

export default About;
