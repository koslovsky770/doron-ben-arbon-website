import { About } from "@/components/site/About";
import { CtaBanner } from "@/components/site/CtaBanner";
import { FeaturedProjects } from "@/components/site/FeaturedProjects";
import { Footer } from "@/components/site/Footer";
import { GoogleReviews } from "@/components/site/GoogleReviews";
import { Hero } from "@/components/site/Hero";
import { Navbar } from "@/components/site/Navbar";
import { Services } from "@/components/site/Services";
import { Testimonials } from "@/components/site/Testimonials";

const Index = () => {
  return (
    <div className="min-h-[100dvh] w-full overflow-x-clip bg-ink-13">
      <Navbar current="/" />
      <main>
        <Hero />
        <About />
        <Services />
        <FeaturedProjects />
        <GoogleReviews />
        <Testimonials />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
