import { Hero } from "@/components/sections/Hero";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { AICapabilities } from "@/components/sections/AICapabilities";
import { RegionsMap } from "@/components/sections/RegionsMap";
import { Testimonials } from "@/components/sections/Testimonials";
import { TrustIndicators } from "@/components/sections/TrustIndicators";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <AICapabilities />
      <RegionsMap />
      <Testimonials />
      <TrustIndicators />
      <CTASection />
    </>
  );
}
