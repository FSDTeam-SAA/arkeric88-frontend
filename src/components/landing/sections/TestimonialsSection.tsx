"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const testimonials = [
  { name: "Sophia Martin", trip: "Slow Journey – Japan", image: "/images/testimonial-1.png", quote: "Velari understood that I needed quiet, beauty, and room to breathe. Every stop felt considered, from the peaceful gardens to the intimate local restaurants." },
  { name: "Imran Hossain", trip: "Visit Visa – UAE", image: "/images/testimonial-2.png", quote: "Burned out after months of work, I used Velari’s Deep Recharging filter. The AI created a calming Kyoto escape with hidden temples, onsen baths, ramen spots, and a minimalist hotel, feeling personal." },
  { name: "Noah Williams", trip: "Cultural Escape – Greece", image: "/images/testimonial-3.png", quote: "It felt less like an itinerary and more like a journey made by someone who truly knew me. I returned inspired, rested, and completely renewed." },
];

export function TestimonialsSection() {
  const [active, setActive] = useState(1);
  const showPrevious = () => setActive((current) => (current - 1 + testimonials.length) % testimonials.length);
  const showNext = () => setActive((current) => (current + 1) % testimonials.length);
  const testimonial = testimonials[active];

  return (
    <section className="testimonials" aria-labelledby="testimonials-title" data-reveal>
      <h2 id="testimonials-title">Testimonials</h2>
      <div className="avatar-stack">
        {testimonials.map((item, index) => <button type="button" onClick={() => setActive(index)} className={index === active ? "active" : ""} key={item.name} aria-label={`Show ${item.name}'s testimonial`} aria-pressed={index === active}><Image src={item.image} alt="" fill sizes="56px" /></button>)}
      </div>
      <button className="testimonial-arrow left" type="button" onClick={showPrevious} aria-label="Previous testimonial"><ArrowLeft /></button>
      <div className="testimonial-content" key={testimonial.name} aria-live="polite">
        <blockquote>“{testimonial.quote}”</blockquote>
        <div className="reviewer"><strong>{testimonial.name}</strong><small>{testimonial.trip}</small><div aria-label="5 out of 5 stars">★★★★★</div></div>
      </div>
      <button className="testimonial-arrow right" type="button" onClick={showNext} aria-label="Next testimonial"><ArrowRight /></button>
    </section>
  );
}
