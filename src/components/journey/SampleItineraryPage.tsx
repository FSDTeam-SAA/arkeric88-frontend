import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { FooterSection } from "@/components/landing/sections/FooterSection";
import { NavbarSection } from "@/components/landing/sections/NavbarSection";
import type { SampleJourney } from "@/lib/sample-journeys";

const journeyFocus: Record<string, string> = {
  japan: "reflection and discovery",
  greece: "connection and exploration",
  mexico: "inspiration and creativity",
  egypt: "discovery and new perspectives",
};

const dayHeadings: Record<string, string[]> = {
  japan: ["Arrive gently", "Gardens and riverside calm", "Contemplative Kyoto"],
  greece: ["Ease into island life", "History and local flavors", "Reconnect on the water"],
  mexico: ["Meet the creative city", "Art and neighborhood culture", "Design and street food"],
  egypt: ["Enter Luxor's stories", "Explore ancient Thebes", "Discovery beside the Nile"],
};

export function SampleItineraryPage({ journey }: { journey: SampleJourney }) {
  const focus = journeyFocus[journey.slug] || journey.seeker.toLowerCase();
  const headings = dayHeadings[journey.slug] || [];

  return (
    <main className="itinerary-page sample-itinerary-page">
      <NavbarSection activePage="none" />

      <div className="sample-overview">
        <Link className="sample-back-link" href="/#journeys"><ArrowLeft size={15} /> Back to sample journeys</Link>
        <header className="sample-overview-header">
          <small>Sample journey · {journey.country}</small>
          <h1>A sample {journey.city} journey for {focus}</h1>
          <p>{journey.days.length}-day illustrative itinerary</p>
        </header>

        <div className="sample-verification-note" role="note">
          Illustrative itinerary. Check dates, opening hours, prices, and bookings before travel.
        </div>

        <section className="sample-glance" aria-labelledby="sample-glance-title">
          <h2 id="sample-glance-title">Trip at a Glance</h2>
          <p><strong>Suggested stay area:</strong> {journey.stayArea}</p>
          <div>{journey.themes.map((theme) => <span key={theme}>{theme}</span>)}</div>
        </section>

        <section className="sample-days" aria-label={`${journey.city} sample itinerary`}>
          {journey.days.map((day, dayIndex) => (
            <article className="sample-day" key={day.day}>
              <div className="sample-day-heading">
                <span>Day {day.day}</span>
                <div>
                  <h2>{headings[dayIndex] || `Explore ${journey.city}`}</h2>
                  <p>{day.title}</p>
                </div>
              </div>

              <div className="sample-activity-grid">
                {day.activities.map((activity) => (
                  <article key={activity.name}>
                    <MapPin size={16} aria-hidden="true" />
                    <div>
                      <h3>{activity.name}</h3>
                      <p>{activity.description}</p>
                      <small>{activity.location}</small>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="sample-practical-notes" aria-label="Practical notes">
          <article><h2>Packing notes</h2><p>{journey.packingTips}</p></article>
          <article><h2>Travel notes</h2><p>{journey.travelTips}</p></article>
        </section>

        <section className="sample-overview-cta">
          <small>Ready for something personal?</small>
          <h2>Your journey should feel like yours.</h2>
          <p>Tell us how you feel, what matters, and how you want to travel. Velari will shape a journey around your answers.</p>
          <Link href="/journey">Begin Your Emotional Journey <ArrowRight size={16} /></Link>
        </section>
      </div>

      <FooterSection />
    </main>
  );
}
