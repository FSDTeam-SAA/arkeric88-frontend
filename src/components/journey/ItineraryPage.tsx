"use client";
import { useState } from "react";
import { Download, MapPin } from "lucide-react";
import { NavbarSection } from "@/components/landing/sections/NavbarSection";
import { FooterSection } from "@/components/landing/sections/FooterSection";

const plans = [
  [{time:"10:00 AM", title:"Check-in at Hotel", text:"Relax and refresh in your sophisticated hotel located near the beach.", place:"Barcelona Hotel", price:"$180"},{time:"12:00 PM",title:"Lunch at La Boqueria Market",text:"Explore and sample delicious artisanal food at this historic market.",place:"La Rambla",price:"$130"},{time:"06:00 PM",title:"Dinner at a Rooftop Restaurant",text:"Enjoy tapas and cocktails with views of the Sagrada Familia.",place:"Eixample",price:"$90"}],
  [{time:"09:00 AM",title:"Gaudí Architecture Walk",text:"Discover Casa Batlló and the whimsical streets of Barcelona.",place:"Passeig de Gràcia",price:"$55"},{time:"01:00 PM",title:"Mediterranean Lunch",text:"A slow seasonal lunch by the sea.",place:"Barceloneta",price:"$75"}],
  [{time:"10:30 AM",title:"Park Güell & Gardens",text:"A restorative morning among mosaic terraces and greenery.",place:"Gràcia",price:"$40"}],
  [{time:"11:00 AM",title:"Gothic Quarter Discovery",text:"Quiet courtyards, local studios, and centuries of stories.",place:"Barri Gòtic",price:"$35"}],
  [{time:"09:00 AM",title:"Farewell Breakfast",text:"A final Catalan breakfast before your onward journey.",place:"El Born",price:"$45"}],
];
export function ItineraryPage(){const [day,setDay]=useState(0); return <main className="itinerary-page"><NavbarSection activePage="none"/><section className="itinerary-hero"><div className="itinerary-shade"/><div className="itinerary-title"><h1>Your Journey to Barcelona</h1><p>Curated for the Restorative Night Owl</p></div><span>Barcelona · 5 Days</span><button><Download size={15}/> Download PDF</button></section><section className="itinerary-layout"><aside><h3>Your Trip at a Glance</h3><small>Duration</small><strong>5 Days</strong><small>Match Score</small><strong>92%</strong><small>Archetype</small><strong>The Restorative Night Owl</strong><small>Destination</small><strong>Barcelona, Spain</strong></aside><div className="day-plan"><div className="day-tabs">{plans.map((_,i)=><button key={i} onClick={()=>setDay(i)} className={day===i?"active":""}>Day {i+1}</button>)}</div><h2>Day {day+1}</h2><p>{day===0?"Arrival & Local Cuisine":"A thoughtfully paced Barcelona experience"}</p><div className="timeline">{plans[day].map((item)=><article key={item.title}><span className="timeline-dot"/><time>{item.time}</time><h3>{item.title}</h3><p>{item.text}</p><small><MapPin size={13}/>{item.place}</small><b>{item.price}</b></article>)}</div></div></section><FooterSection/></main>}
