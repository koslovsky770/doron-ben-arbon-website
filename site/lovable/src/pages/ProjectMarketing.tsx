import { CtaBanner } from "@/components/site/CtaBanner";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { ProjectMarketingHero } from "@/components/site/ProjectMarketingHero";
import { ProjectMarketingListings } from "@/components/site/ProjectMarketingListings";

const ProjectMarketing = () => {
  return (
    <div className="min-h-[100dvh] w-full overflow-x-clip bg-ink-13">
      <Navbar current="/project-marketing" />
      <main>
        <ProjectMarketingHero />
        <ProjectMarketingListings />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectMarketing;
