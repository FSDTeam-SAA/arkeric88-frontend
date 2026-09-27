const steps = [
  {
    number: "01",
    title: "Share how you feel",
    text: "Choose how you feel now and what you want from the trip.",
  },
  {
    number: "02",
    title: "Tell us what matters",
    text: "Add interests, pace, setting, travel dates, and budget.",
  },
  {
    number: "03",
    title: "Explore your matches",
    text: "See destinations with a clear reason for each recommendation.",
  },
  {
    number: "04",
    title: "Shape your itinerary",
    text: "Review suggested days and adjust what does or does not fit.",
  },
];

export function ProcessSection() {
  return (
    <section className="process" id="how-it-works">
      <div className="section-heading">
        <h2>How Velari shapes your journey</h2>
      </div>
      <div className="steps">
        {steps.map(({ number, title, text }) => (
          <article className="step-card" key={number}>
            <span className="step-number" aria-hidden="true">{number}</span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
