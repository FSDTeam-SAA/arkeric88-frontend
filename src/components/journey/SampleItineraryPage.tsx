"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import { FooterSection } from "@/components/landing/sections/FooterSection";
import { NavbarSection } from "@/components/landing/sections/NavbarSection";
import type { SampleJourney } from "@/lib/sample-journeys";

export function SampleItineraryPage({ journey }: { journey: SampleJourney }) {
  const [dayIndex, setDayIndex] = useState(0);
  const activeDay = journey.days[dayIndex] || journey.days[0];
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <main className="itinerary-page sample-itinerary-page">
      <NavbarSection activePage="none" />
      <section className="itinerary-hero" style={{ backgroundImage: `url(${JSON.stringify(journey.heroImage)})` }}>
        <div className="itinerary-shade" />
        <div className="itinerary-title">
          <small className="sample-kicker"><Sparkles size={12} /> Sample Journey</small>
          <h1>Your Journey to {journey.city}</h1>
          <p>An example itinerary designed for a {journey.seeker.toLowerCase()}</p>
          <div className="sample-hero-themes">{journey.themes.map((theme) => <span key={theme}>{theme}</span>)}</div>
        </div>
        <span>{journey.city}, {journey.country} · {journey.days.length} Day Preview</span>
        <Link className="sample-itinerary-cta" href="/journey">Create My Journey <ArrowRight size={15} /></Link>
      </section>

      <div className="sample-disclaimer">
        <Sparkles size={16} />
        <p><strong>This is a curated sample.</strong> Complete the emotional journey quiz to receive destinations and a full itinerary matched to you.</p>
      </div>

      <section className="itinerary-layout">
        <aside>
          <h3>Your Trip at a Glance</h3>
          <small>Duration</small><strong>{journey.days.length} Days</strong>
          <small>Journey profile</small><strong>{journey.seeker}</strong>
          <small>Travel style</small><strong>{journey.travelStyle}</strong>
          <small>Destination</small><strong>{journey.city}, {journey.country}</strong>
          <small>Sample stay</small><strong>{journey.stay.name}</strong>
          <span className="stay-rating"><Star size={12} fill="currentColor" />{journey.stay.rating}</span>
        </aside>

        <div className="day-plan">
          <div className="day-tabs">{journey.days.map((day, index) => (
            <button type="button" key={day.day} onClick={() => setDayIndex(index)} className={dayIndex === index ? "active" : ""}>Day {day.day}</button>
          ))}</div>
          <h2>Day {activeDay.day}</h2>
          <p>{activeDay.title}</p>
          <div className="timeline">{activeDay.activities.map((activity, index) => (
            <article key={`${activity.name}-${index}`}>
              <span className="timeline-dot" />
              <div className="timeline-copy">
                <div className="timeline-heading"><time>{activity.time}</time><b>{activity.estimatedCost === 0 ? "Free" : currency.format(activity.estimatedCost)}</b></div>
                <h3>{activity.name}</h3>
                <p>{activity.description}</p>
                <small><MapPin size={13} /><span><strong>{activity.location}</strong><em>{activity.address}</em></span></small>
                {activity.distanceFromPreviousKm != null && <span className="timeline-distance">{activity.distanceFromPreviousKm.toLocaleString(undefined, { maximumFractionDigits: 1 })} km from previous stop</span>}
              </div>
            </article>
          ))}</div>

          {dayIndex === journey.days.length - 1 && <div className="travel-notes">
            <article><h3>Packing tips</h3><p>{journey.packingTips}</p></article>
            <article><h3>Travel tips</h3><p>{journey.travelTips}</p></article>
            <article><h3>Estimated activity total</h3><p>{currency.format(journey.estimatedTotal)} <small>for this sample preview</small></p></article>
          </div>}
        </div>
      </section>

      <section className="sample-conversion">
        <small>Ready for something personal?</small>
        <h2>Your journey should feel like yours.</h2>
        <p>Tell us how you feel, what you need, and how you want to travel. Velari will build your own matched experience.</p>
        <Link href="/journey">Begin Your Emotional Journey <ArrowRight size={16} /></Link>
      </section>
      <FooterSection />
    </main>
  );
}
