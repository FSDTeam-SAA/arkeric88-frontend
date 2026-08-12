import Image from "next/image";
import Link from "next/link";
import { CtaLink } from "../components/CtaLink";

const places = [
  { name: "Japan", image: "/images/place-1.jpg", seeker: "For the calm seeker", themes: ["Quiet Temples", "Mindful Rituals", "Slow Luxury"] },
  { name: "Greece", image: "/images/place-2.jpg", seeker: "For the connection seeker", themes: ["Coastal Calm", "Ancient Culture", "Sunset Rituals"] },
  { name: "Mexico", image: "/images/place-3.jpg", seeker: "For the restoration seeker", themes: ["Wellness Reset", "Sacred Nature", "Barefoot Luxury"] },
  { name: "Egypt", image: "/images/place-4.jpg", seeker: "For the curiosity seeker", themes: ["Ancient Wonder", "Living History", "Nile Stillness"] },
];

export function JourneysSection() {
  return <section className="journeys" id="journeys"><div className="journey-heading"><div><h2>Journeys Matched By Emotions</h2><p>Explore sample journeys before creating your own.</p></div><CtaLink>Explore More</CtaLink></div><div className="places">{places.map((place) => <Link className="place-card" href={`/sample-journey/${place.name.toLowerCase()}`} key={place.name} aria-label={`View sample ${place.name} journey`}><Image src={place.image} alt={`${place.name} travel destination`} fill sizes="(max-width: 700px) 85vw, (max-width: 1100px) 45vw, 25vw" /><div className="place-overlay"><small>{place.seeker}</small><h3>{place.name}</h3><div>{place.themes.map((theme) => <span key={theme}>{theme}</span>)}</div><strong>View Sample Journey →</strong></div></Link>)}</div></section>;
}
