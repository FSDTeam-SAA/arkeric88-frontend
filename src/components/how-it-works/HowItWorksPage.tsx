import { FooterSection } from "@/components/landing/sections/FooterSection";
import { NavbarSection } from "@/components/landing/sections/NavbarSection";
import { TestimonialsSection } from "@/components/landing/sections/TestimonialsSection";
import { HowItWorksHero } from "./sections/HowItWorksHero";
import { HowItWorksSteps } from "./sections/HowItWorksSteps";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export function HowItWorksPage() {
  return (
    <main className="how-page">
      <ScrollReveal />
      <NavbarSection activePage="how-it-works" />
      <HowItWorksHero />
      <HowItWorksSteps />
      <TestimonialsSection />
      <div data-reveal><FooterSection /></div>
    </main>
  );
}
