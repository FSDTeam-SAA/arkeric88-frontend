import { FooterSection } from "./sections/FooterSection";
import { HeroSection } from "./sections/HeroSection";
import { JourneysSection } from "./sections/JourneysSection";
import { NavbarSection } from "./sections/NavbarSection";
import { ProcessSection } from "./sections/ProcessSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export function LandingPage() {
  return (
    <main>
      <ScrollReveal />
      <NavbarSection />
      <HeroSection />
      <div data-reveal><ProcessSection /></div>
      <div data-reveal><JourneysSection /></div>
      <TestimonialsSection />
      <div data-reveal><FooterSection /></div>
    </main>
  );
}
