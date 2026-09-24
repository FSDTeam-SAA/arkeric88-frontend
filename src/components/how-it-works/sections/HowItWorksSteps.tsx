import {
  ProcessDetail,
  ProcessDetailRow,
} from "../components/ProcessDetailRow";

const processSteps: ProcessDetail[] = [
  {
    number: "01",
    title: "Take the Emotional Travel™ Assessment ",
    description:
      "Tell us how you're feeling, what you're looking for from your trip, and how you like to travel.",
    image: "/images/how-it-works-share-feelings.jpg",
    imageAlt: "A traveler photographing a mountain landscape",
  },
  {
    number: "02",
    title: "Build Your Travel Profile",
    description:
      "Velari™ identifies your emotional priorities, travel preferences, preferred pace, environment, budget, and experience style.",
    image: "/images/how-it-works-personality.jpg",
    imageAlt: "A person resting peacefully in a flower meadow",
  },
  {
    number: "03",
    title: "Discover Your Matches",
    description:
      "Velari™ identifies destinations and experiences that align with your Emotional Travel™ profile.",
    image: "/images/how-it-works-destination.jpg",
    imageAlt: "A traveler overlooking a dramatic tropical bay",
  },
  {
    number: "04",
    title: "Create Your Journey",
    description:
      "Velari™ turns those recommendations into a personalized travel experience designed around you.",
    image: "/images/how-it-works-itinerary.jpg",
    imageAlt: "Travel essentials arranged over a map",
  },
];

export function HowItWorksSteps() {
  return (
    <section className="how-steps" aria-label="How Velari™ works process">
      {processSteps.map((step, index) => (
        <ProcessDetailRow
          step={step}
          reverse={index % 2 === 1}
          key={step.number}
        />
      ))}
    </section>
  );
}
