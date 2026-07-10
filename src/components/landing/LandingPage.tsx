import { FooterSection } from "./sections/FooterSection";
import { HeroSection } from "./sections/HeroSection";
import { JourneysSection } from "./sections/JourneysSection";
import { NavbarSection } from "./sections/NavbarSection";
import { ProcessSection } from "./sections/ProcessSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";

export function LandingPage() {
  return (
    <main>
      <NavbarSection />
      <HeroSection />
      <ProcessSection />
      <JourneysSection />
      <TestimonialsSection />
      <FooterSection />
    </main>
  );
}
