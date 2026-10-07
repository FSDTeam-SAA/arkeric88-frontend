import Link from "next/link";
import Image from "next/image";

const journeys = [
  {
    destination: "Japan",
    label: "Reflection",
    details: "Culture · gardens · quiet time",
    href: "/sample-journey/japan",
    image: "/images/velari/06_Sample_Journey_Japan_Reflection.png",
    imageAlt: "Peaceful Japanese tea house overlooking an autumn garden and pond.",
    imagePosition: "50% 50%",
  },
  {
    destination: "Greece",
    label: "Connection",
    details: "Shared meals · coast · exploration",
    href: "/sample-journey/greece",
    image: "/images/velari/07_Sample_Journey_Greece_Connection.png",
    imageAlt: "Travelers sharing a sunset meal above the Mediterranean coast.",
    imagePosition: "50% 50%",
  },
  {
    destination: "Mexico",
    label: "Inspiration",
    details: "Art · food · creative streets",
    href: "/sample-journey/mexico",
    image: "/images/velari/08_Sample_Journey_Mexico_Inspiration.png",
    imageAlt: "Traveler walking through a colorful colonial street in Mexico lined with bright flowers.",
    imagePosition: "50% 50%",
  },
  {
    destination: "Egypt",
    label: "Discovery",
    details: "History · local stories · new perspectives",
    href: "/sample-journey/egypt",
    image: "/images/velari/09_Sample_Journey_Egypt_Discovery.png",
    imageAlt: "Sunrise view over ancient Egyptian temple ruins and the Nile.",
    imagePosition: "50% 50%",
  },
];

export function JourneysSection() {
  return (
    <section className="journeys" id="journeys">
      <div className="journey-heading">
        <div>
          <span>Journey examples</span>
          <h2>Explore a sample journey</h2>
          <p>See how different feelings can shape where you go and what you experience.</p>
        </div>
      </div>

      <div className="sample-journey-grid">
        {journeys.map(({ destination, label, details, href, image, imageAlt, imagePosition }, index) => (
          <Link
            className="sample-journey-card"
            href={href}
            key={destination}
            aria-label={`Explore the ${destination} sample journey`}
          >
            <div className="sample-card-top">
              <small>Sample {String(index + 1).padStart(2, "0")}</small>
              <span className="sample-card-arrow" aria-hidden="true">↗</span>
            </div>
            <div className="sample-card-image">
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(max-width: 620px) calc(100vw - 40px), (max-width: 950px) calc(50vw - 30px), 590px"
                style={{ objectPosition: imagePosition }}
              />
            </div>
            <div className="sample-card-copy">
              <h3>{destination}</h3>
              <strong>{label}</strong>
              <p>{details}</p>
            </div>
            <span className="sample-card-link">View sample journey <b aria-hidden="true">→</b></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
