import Image from "next/image";
import { CtaLink } from "../components/CtaLink";

const places = [
  { name: "Japan", image: "/images/place-1.jpg" }, { name: "Greece", image: "/images/place-2.jpg" },
  { name: "Mexico", image: "/images/place-3.jpg" }, { name: "Egypt", image: "/images/place-4.jpg" },
];

export function JourneysSection() {
  return <section className="journeys" id="journeys"><div className="journey-heading"><div><h2>Journeys Matched By Emotions</h2><p>Sample Journeys</p></div><CtaLink>Explore More</CtaLink></div><div className="places">{places.map((place) => <article className="place-card" key={place.name}><Image src={place.image} alt={`${place.name} travel destination`} fill sizes="(max-width: 700px) 85vw, (max-width: 1100px) 45vw, 25vw" /><div className="place-overlay"><small>For the calm seeker</small><h3>{place.name}</h3><div><span>Calm Luxury</span><span>Calm Luxury</span><span>Calm Luxury</span></div></div></article>)}</div></section>;
}
