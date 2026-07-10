import { Brain, ClipboardList, Heart, MapPin } from "lucide-react";

const steps = [
  { icon: Heart, title: "Share Your Emotions", text: "Answer a brief emotional assessment about how you feel right now.", color: "red" },
  { icon: Brain, title: "Personality Analysis", text: "Your emotional and astrological personality.", color: "blue" },
  { icon: MapPin, title: "Discover Matched Destinations", text: "Receive destinations aligned to your inner state.", color: "orange" },
  { icon: ClipboardList, title: "Receive Your Itinerary", text: "Get a day-by-day travel plan delivered instantly.", color: "green" },
];

export function ProcessSection() {
  return <section className="process" id="how-it-works"><div className="section-heading"><h2>From Emotion to Extraordinary Journey</h2><p>A Simple 4-Step Process Designed Around Your Emotional Truth</p></div><div className="steps">{steps.map(({ icon: Icon, title, text, color }) => <article className="step-card" key={title}><span className={`step-icon ${color}`}><Icon size={22} /></span><h3>{title}</h3><p>{text}</p></article>)}</div></section>;
}
