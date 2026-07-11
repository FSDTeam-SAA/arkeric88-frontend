import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NavbarSection } from "@/components/landing/sections/NavbarSection";
import { FooterSection } from "@/components/landing/sections/FooterSection";

const places = [
  { name: "Tulum", country: "Mexico", image: "/images/place-1.jpg", match: 93 },
  { name: "Barcelona", country: "Spain", image: "/images/place-2.jpg", match: 92 },
  { name: "Lisbon", country: "Portugal", image: "/images/place-3.jpg", match: 90 },
];
export function ResultsPage() { return <main className="results-page"><NavbarSection activePage="none" />
  <section className="results-hero"><div className="results-shade"/><div><small>YOUR TRAVEL ARCHETYPE</small><h1>The Restorative Night Owl</h1><p>In the embrace of twilight, where the bustling nightlife meets serene retreats, the<br/>Restorative Night Owl seeks solace amidst vibrant glow, breathing in moments of<br/>tranquility before indulging in spirited revelry.</p><div className="result-tags"><span>Calm Energy</span><span>Nature-Led</span><span>Introspective</span></div></div></section>
  <section className="matched"><h2>Your Matched Destinations</h2><p>Selected from thousands of experiences based on your<br/>unique emotional and astrological profile</p><div className="match-grid">{places.map((place) => <Link className="match-card" href="/itinerary/barcelona" key={place.name} aria-label={`View ${place.name} itinerary`}><article><div className="match-image"><Image src={place.image} alt={place.name} fill sizes="(max-width:700px) 90vw, 30vw"/><span>{place.match}% match</span></div><div className="match-copy"><h3>{place.name}, <small>{place.country}</small></h3><p>5 Days · The Restorative Night Owl</p><span className="match-link">View Full Itinerary <ArrowRight size={13}/></span></div></article></Link>)}</div></section><FooterSection />
  </main> }
