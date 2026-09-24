import { ClipboardList, Compass, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { CtaLink } from "../components/CtaLink";

export function HeroSection() {
  return (
    <section className="hero" id="home">
      <div className="hero-shade" />
      <div className="hero-content">
        <p>Emotional Travel™, Designed Around You</p>
        <h1>
          Start with how
          <br />
          you want to feel.
        </h1>
        <h2>
          Velari™&apos;s Emotional Travel™ Assessment helps us understand what
          you need from your next trip, then matches you with destinations,
          stays, experiences, and itineraries designed around you.
        </h2>
        <div className="hero-actions">
          <CtaLink>Take the Emotional Travel™ Assessment</CtaLink>
          <Link className="hero-secondary-cta" href="#journeys">
            See a Sample Match
          </Link>
        </div>
      </div>
      <div className="hero-features">
        <span>
          <Heart size={18} />
          Emotional Travel™ Assessment
        </span>
        <span>
          <Sparkles size={18} />
          Personalized Matches
        </span>
        <span>
          <Compass size={18} />
          Curated Destinations
        </span>
        <span>
          <ClipboardList size={18} />
          Tailored Itineraries
        </span>
      </div>
    </section>
  );
}
