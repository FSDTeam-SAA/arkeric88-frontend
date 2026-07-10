import { ProcessDetail, ProcessDetailRow } from "../components/ProcessDetailRow";

const processSteps: ProcessDetail[] = [
  { number: "01", title: "Share How You Feel", description: "Our assessment takes less than 3 minutes. Answer intuitive questions about your current state, energy levels, and travel preferences.", image: "/images/how-it-works-share-feelings.jpg", imageAlt: "A traveler photographing a mountain landscape" },
  { number: "02", title: "Understanding What Matters Most to You", description: "Our proprietary experience engine combines astrological personality mapping with a deep understanding of individual preferences to uncover the type of journey your soul truly needs.", image: "/images/how-it-works-personality.jpg", imageAlt: "A person resting peacefully in a flower meadow" },
  { number: "03", title: "Discover Your Perfect Journey", description: "Receive personalized destination recommendations matched to your unique emotional and astrological profile, with match scores showing exactly why each destination was chosen for you.", image: "/images/how-it-works-destination.jpg", imageAlt: "A traveler overlooking a dramatic tropical bay" },
  { number: "04", title: "Receive Your Personalized Itinerary", description: "Get a detailed day-by-day itinerary crafted around your preferences – from morning meditations to evening dining experiences – delivered as a premium PDF and saved to your dashboard.", image: "/images/how-it-works-itinerary.jpg", imageAlt: "Travel essentials arranged over a map" },
];

export function HowItWorksSteps() {
  return <section className="how-steps" aria-label="How Velari works process">{processSteps.map((step, index) => <ProcessDetailRow step={step} reverse={index % 2 === 1} key={step.number} />)}</section>;
}
