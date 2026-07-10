import { CtaLink } from "@/components/landing/components/CtaLink";

export function HowItWorksHero() {
  return (
    <section className="how-hero">
      <div className="how-hero-shade" />
      <div className="how-hero-content">
        <h1>How Velari Works</h1>
        <p>“Transforming your emotions, preferences, and aspirations into<br className="desktop-break" /> meaningful travel experiences.”</p>
        <CtaLink>Begin Your Emotional Journey</CtaLink>
      </div>
    </section>
  );
}
