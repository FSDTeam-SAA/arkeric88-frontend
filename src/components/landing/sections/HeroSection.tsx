import { Brain, ClipboardList, Compass, Sparkles } from "lucide-react";
import { CtaLink } from "../components/CtaLink";

export function HeroSection() {
  return (
    <section className="hero" id="home">
      <div className="hero-shade" />
      <div className="hero-content"><p>Luxury Travel Intelligence, Tailored to You</p><h1>Travel That<br />Understands You</h1><h2>“Discover personalized luxury experiences designed around how you feel”.</h2><CtaLink>Begin Your Emotional Journey</CtaLink></div>
      <div className="hero-features"><span><Brain size={18} />Emotional Intelligence</span><span><Sparkles size={18} />Curated Travel Match</span><span><Compass size={18} />Curated Luxury Destinations</span><span><ClipboardList size={18} />Personalized Itineraries</span></div>
    </section>
  );
}
