const processSteps = [
  {
    number: "01",
    title: "Take the Emotional Travel™ Assessment",
    description: "Tell us how you want to feel and what matters for this trip.",
  },
  {
    number: "02",
    title: "Build Your Travel Profile",
    description: "Add the details that help us narrow the choices.",
  },
  {
    number: "03",
    title: "Discover Your Matches",
    description:
      "See destination ideas tied to your chosen feelings, interests, budget, and travel preferences. Each match explains why it was chosen.",
  },
  {
    number: "04",
    title: "Create Your Journey",
    description:
      "Explore a suggested itinerary and refine the pace or experiences. Rates and availability are checked for your dates when available.",
  },
];

export function HowItWorksSteps() {
  return (
    <section className="how-process" aria-label="How Velari works process">
      {processSteps.map((step) => (
        <article className="how-process-row" data-reveal key={step.number}>
          <span className="how-process-number">{step.number}</span>
          <h2>{step.title}</h2>
          <p>{step.description}</p>
        </article>
      ))}
    </section>
  );
}
