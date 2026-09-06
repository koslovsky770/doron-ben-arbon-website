import { CtaBanner } from "@/components/site/CtaBanner";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { PlotsHero } from "@/components/site/PlotsHero";
import { PlotsListings } from "@/components/site/PlotsListings";

const Plots = () => {
  return (
    <div className="min-h-[100dvh] w-full overflow-x-clip bg-ink-13">
      <Navbar current="/plots" />
      <main>
        <PlotsHero />
        <PlotsListings />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
};

export default Plots;
