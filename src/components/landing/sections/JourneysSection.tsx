import Link from "next/link";

const journeys = [
  {
    destination: "Japan",
    label: "Reflection",
    details: "Culture · gardens · quiet time",
    href: "/sample-journey/japan",
  },
  {
    destination: "Greece",
    label: "Connection",
    details: "Shared meals · coast · exploration",
    href: "/sample-journey/greece",
  },
  {
    destination: "Mexico",
    label: "Inspiration",
    details: "Art · food · creative streets",
    href: "/sample-journey/mexico",
  },
  {
    destination: "Egypt",
    label: "Discovery",
    details: "History · local stories · new perspectives",
    href: "/sample-journey/egypt",
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
        {journeys.map(({ destination, label, details, href }, index) => (
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
