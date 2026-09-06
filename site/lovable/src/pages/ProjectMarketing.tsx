import { ConsentBanner } from "@/components/site/ConsentBanner";
import { CtaBanner } from "@/components/site/CtaBanner";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { ProcessSlider } from "@/components/site/ProcessSlider";
import { ProjectMarketingHero } from "@/components/site/ProjectMarketingHero";
import { ProjectMarketingListings } from "@/components/site/ProjectMarketingListings";
import { projectMarketingPage } from "@/data/site";

const ProjectMarketing = () => {
  return (
    <div className="min-h-[100dvh] w-full overflow-x-clip bg-ink-13">
      <Navbar current="/project-marketing" />
      <main>
        <ProjectMarketingHero />
        <ProcessSlider {...projectMarketingPage.process} />
        <ProjectMarketingListings />
        <CtaBanner />
      </main>
      <Footer />
      <ConsentBanner />
    </div>
  );
};

export default ProjectMarketing;
