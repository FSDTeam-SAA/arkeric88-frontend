import Link from "next/link";
import Image from "next/image";
import { CtaLink } from "../components/CtaLink";

export function HeroSection() {
  return (
    <section className="hero" id="home">
      <Image
        className="hero-image"
        src="/images/velari/01_Homepage_Hero.png"
        alt="Sunrise over a Mediterranean cliffside terrace with coffee, a travel journal, and sea views."
        fill
        priority
        sizes="100vw"
      />
      <div className="hero-shade" />
      <div className="site-container hero-container">
        <div className="hero-content">
          <h1>Start with how you want to feel.</h1>
          <h2>
            Tell us what you want from your next trip. Velari uses your feelings,
            interests, budget, and travel preferences to suggest destinations and
            itinerary ideas that fit you.
          </h2>
          <div className="hero-actions">
            <CtaLink>Take the Emotional Travel™ Assessment</CtaLink>
            <Link className="hero-secondary-cta" href="#journeys">
              See a Sample Match
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
