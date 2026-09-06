import { CommercialHero } from "@/components/site/CommercialHero";
import { CommercialListings } from "@/components/site/CommercialListings";
import { CtaBanner } from "@/components/site/CtaBanner";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { ProcessSlider } from "@/components/site/ProcessSlider";
import { commercialPage } from "@/data/site";

const Commercial = () => {
  return (
    <div className="min-h-[100dvh] w-full overflow-x-clip bg-ink-13">
      <Navbar current="/commercial" />
      <main>
        <CommercialHero />
        <ProcessSlider {...commercialPage.process} />
        <CommercialListings />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
};

export default Commercial;
