import { ConsentBanner } from "@/components/site/ConsentBanner";
import { CtaBanner } from "@/components/site/CtaBanner";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { PlotsHero } from "@/components/site/PlotsHero";
import { PlotsListings } from "@/components/site/PlotsListings";
import { ProcessSlider } from "@/components/site/ProcessSlider";
import { plotsPage } from "@/data/site";

const Plots = () => {
  return (
    <div className="min-h-[100dvh] w-full overflow-x-clip bg-ink-13">
      <Navbar current="/plots" />
      <main>
        <PlotsHero />
        <ProcessSlider {...plotsPage.process} />
        <PlotsListings />
        <CtaBanner />
      </main>
      <Footer />
      <ConsentBanner />
    </div>
  );
};

export default Plots;
