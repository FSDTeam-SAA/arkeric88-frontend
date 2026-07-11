"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CircleGauge, CreditCard, Droplets, Home, Loader2, MapPin, ShieldCheck, Sparkles, Star, Thermometer, User, Users } from "lucide-react";
import { FormEvent, useState } from "react";

type Question = {
  title: string;
  prompt?: string;
  kind?: "options" | "cards" | "date" | "range" | "text";
  options?: string[];
};

const questions: Question[] = [
  { title: "How are you feeling today?", options: ["Overwhelmed", "Calm", "Stressed", "Adventurous", "Inspired", "Other"] },
  { title: "What kind of experience is\ncalling to you?", options: ["Deep Rest", "Inner Peace", "Celebration", "Exploration", "Escape", "Spiritual"] },
  { title: "What's your energy like\nfor this trip?", options: ["Low", "Medium", "High"] },
  { title: "How do you want to\nexperience this journey?", kind: "cards", options: ["Solo|Just me and my thoughts", "Couple|An intimate shared experience", "Small Group|2–6 close companions", "Family|Travel with loved ones"] },
  { title: "How would you like your\ntrip to be organized?", options: ["Loosely planned", "Well Planned", "Hour by hour"] },
  { title: "Are there any activities\nyou'd like to avoid or can't\ndo?", kind: "cards", options: ["Intense hiking or climbing", "Extreme heat or cold", "High-impact physical activity", "Water activities", "Long drives or transport", "No limitations"] },
  { title: "Which word best describes the\nseason you're in right now?", options: ["Building", "Healing", "Transitioning", "Celebrating", "Reflecting", "Reinventing"] },
  { title: "What environment speaks to\nyour soul?", options: ["Mountains", "Nature", "Ocean", "Beach", "City", "Culture", "Countryside", "Farmland", "Desert", "Snow", "Warm Weather", "Cold Weather"] },
  { title: "Your Birthdate", kind: "date" },
  { title: "Your Trip Budget", prompt: "Approximate budget per person/night?", kind: "range" },
  { title: "Your Trip length", prompt: "How many days are you planning to travel?", options: ["1–3 days", "4–7 days", "1–2 weeks", "2+ weeks"] },
  { title: "What do you hope this\ntrip gives you?", prompt: "Write freely... there are no wrong answers.", kind: "text" },
];

const optionIcons = [Sparkles, Droplets, CircleGauge, Star, User, MapPin];

export function JourneyQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [budget, setBudget] = useState(300);
  const [payment, setPayment] = useState(false);
  const [processing, setProcessing] = useState(false);
  const q = questions[step];

  const continueJourney = () => step === questions.length - 1 ? setPayment(true) : setStep((s) => s + 1);
  const pay = (event: FormEvent) => {
    event.preventDefault();
    setProcessing(true);
    setTimeout(() => router.push("/results"), 900);
  };

  return <main className="quiz-page">
    <header className="quiz-header">
      <button onClick={() => step ? setStep(step - 1) : router.push("/")}><ArrowLeft size={15} /> Back</button>
      <Image src="/images/logo.png" alt="Velari" width={125} height={44} priority />
      <button onClick={() => router.push("/")}>Save &amp; Exit</button>
    </header>
    <section className="quiz-stage" key={step}>
      <div className="quiz-copy">
        <small>QUESTION {step + 1} of {questions.length}</small>
        <h1>{q.title.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h1>
        {q.prompt && <p>{q.prompt}</p>}
        {(!q.kind || q.kind === "options") && <div className={`quiz-options ${q.options!.length > 7 ? "wide" : ""}`}>
          {q.options!.map((option, i) => { const Icon = optionIcons[i % optionIcons.length]; return <button key={option} className={answers[step] === option ? "selected" : ""} onClick={() => setAnswers({...answers, [step]: option})}><Icon size={14}/>{option}</button>; })}
        </div>}
        {q.kind === "cards" && <div className="quiz-cards">{q.options!.map((raw, i) => { const [name, desc] = raw.split("|"); const Icon = [User, Users, Users, Home, Thermometer, Droplets][i % 6]; return <button key={raw} className={answers[step] === raw ? "selected" : ""} onClick={() => setAnswers({...answers, [step]: raw})}><Icon size={18}/><span><strong>{name}</strong>{desc && <small>{desc}</small>}</span></button> })}</div>}
        {q.kind === "date" && <div className="date-fields"><input aria-label="Day" placeholder="DD" maxLength={2}/><input aria-label="Month" placeholder="MM" maxLength={2}/><input aria-label="Year" placeholder="YYYY" maxLength={4}/></div>}
        {q.kind === "range" && <div className="budget-field"><strong>${budget.toLocaleString()}</strong><input type="range" min="100" max="7000" step="100" value={budget} onChange={(e) => setBudget(Number(e.target.value))}/><div><span>$100</span><span>$7,000</span></div></div>}
        {q.kind === "text" && <textarea aria-label="Your hopes for this trip" placeholder="Type Here..." value={answers[step] || ""} onChange={(e) => setAnswers({...answers, [step]: e.target.value})}/>} 
      </div>
      <button className="quiz-continue" onClick={continueJourney}>Continue <ArrowRight size={15}/></button>
    </section>
    {payment && <div className="payment-backdrop" role="dialog" aria-modal="true" aria-label="Payment"><form className="payment-card" onSubmit={pay}>
      <button className="payment-close" type="button" onClick={() => setPayment(false)}>×</button><h2>Payment</h2>
      <label>Card Number<div className="input-icon"><input required placeholder="0000 0000 0000 0000"/><CreditCard size={16}/></div></label>
      <div className="payment-row"><label>Expiry Date<input required placeholder="MM/YY"/></label><label>CVV<input required placeholder="123"/></label></div>
      <label>Name on Card<input required placeholder="John Doe"/></label>
      <div className="payment-row"><label>Country<select required defaultValue=""><option value="" disabled>Select</option><option>Bangladesh</option><option>United States</option><option>United Kingdom</option></select></label><label>ZIP Code<input required placeholder="1234"/></label></div>
      <label className="save-payment"><input type="checkbox"/> Save payment details for future purchases</label>
      <div className="payment-total"><strong>Total Amount</strong><strong>$2.00</strong></div>
      <button className="payment-submit" disabled={processing}>{processing ? <Loader2 className="spin" size={16}/> : <>Continue <ArrowRight size={14}/></>}</button>
      <small className="payment-secure"><ShieldCheck size={13}/> Your payment is encrypted and secure</small>
    </form></div>}
  </main>;
}
