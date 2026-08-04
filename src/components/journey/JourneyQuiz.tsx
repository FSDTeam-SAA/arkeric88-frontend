"use client";

import { CardCvcElement, CardExpiryElement, CardNumberElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CircleGauge,
  Droplets,
  Home,
  Loader2,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Star,
  Thermometer,
  User,
  Users,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/lib/countries";
import {
  journeyApi,
  PaymentIntentData,
  QuestionnaireAnswers,
} from "@/lib/journey-api";

type Answer = string | string[];
type Question = {
  key: string;
  title: string;
  prompt?: string;
  kind?: "options" | "cards" | "date" | "range" | "text";
  options?: string[];
  multiple?: boolean;
};

const questions: Question[] = [
  { key: "todays_feeling", title: "How are you feeling today?", options: ["Overwhelmed", "Calm", "Stressed", "Adventurous", "Inspired", "Other"] },
  { key: "experience_kind", title: "What kind of experience is\ncalling to you?", options: ["Deep Rest", "Inner Peace", "Celebration", "Exploration", "Escape", "Spiritual"] },
  { key: "energy_level", title: "What's your energy like\nfor this trip?", options: ["Low", "Medium", "High"] },
  { key: "travel_style", title: "How do you want to\nexperience this journey?", kind: "cards", options: ["Solo|Just me and my thoughts", "Couple|An intimate shared experience", "Small Group|2–6 close companions", "Family|Travel with loved ones"] },
  { key: "trip_organization", title: "How would you like your\ntrip to be organized?", options: ["Loosely planned", "Well Planned", "Hour by hour"] },
  { key: "activity_restrictions", title: "Are there any activities\nyou'd like to avoid or can't\ndo?", kind: "cards", multiple: true, options: ["Intense hiking or climbing", "Extreme heat or cold", "High-impact physical activity", "Water activities", "Long drives or transport", "No limitations"] },
  { key: "life_season", title: "Which word best describes the\nseason you're in right now?", options: ["Building", "Healing", "Transitioning", "Celebrating", "Reflecting", "Reinventing"] },
  { key: "preferred_environments", title: "What environment speaks to\nyour soul?", multiple: true, options: ["Mountains", "Nature", "Ocean", "Beach", "City", "Culture", "Countryside", "Farmland", "Desert", "Snow", "Warm Weather", "Cold Weather"] },
  { key: "birthdate", title: "Your Birthdate", kind: "date" },
  { key: "total_trip_budget", title: "Your Trip Budget", prompt: "Approximate total trip budget?", kind: "range" },
  { key: "trip_length_days", title: "Your Trip length", prompt: "How many days are you planning to travel?", options: ["1–3 days", "4–7 days", "1–2 weeks", "2+ weeks"] },
  { key: "hope_of_this_trip", title: "What do you hope this\ntrip gives you?", prompt: "Write freely... there are no wrong answers.", kind: "text" },
];

const optionIcons = [Sparkles, Droplets, CircleGauge, Star, User, MapPin];
const draftKey = "velari-journey-draft";

function tripLengthToDays(value: string) {
  return ({ "1–3 days": 3, "4–7 days": 7, "1–2 weeks": 14, "2+ weeks": 21 } as Record<string, number>)[value] || 0;
}

function formatApiPrice(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function PaymentForm({ intent, name, email, onClose }: { intent: PaymentIntentData; name?: string | null; email?: string | null; onClose: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [cardholderName, setCardholderName] = useState(name || "");
  const [country, setCountry] = useState("BD");
  const [postalCode, setPostalCode] = useState("");
  const cardStyle = {
    base: { color: "#24231f", fontSize: "15px", fontFamily: "Arial, sans-serif", lineHeight: "20px", "::placeholder": { color: "#8c8982" } },
    invalid: { color: "#9a3f37" },
  };

  const pay = async (event: FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || processing) return;
    setProcessing(true);
    setError("");
    const card = elements.getElement(CardNumberElement);
    if (!card) {
      setError("The secure card form is not ready yet.");
      setProcessing(false);
      return;
    }
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      intent.clientSecret,
      {
        payment_method: {
          card,
          billing_details: {
            name: cardholderName.trim() || name || undefined,
            email: email || undefined,
            address: { country, postal_code: postalCode.trim() || undefined },
          },
        },
        return_url: `${window.location.origin}/results`,
      },
    );
    if (stripeError) {
      setError(stripeError.message || "Your payment could not be completed.");
      setProcessing(false);
      return;
    }
    if (paymentIntent) {
      sessionStorage.setItem("velari-last-payment", intent.paymentIntentId);
      router.push(`/results?payment_intent=${encodeURIComponent(paymentIntent.id)}`);
    }
  };

  return (
    <form className="payment-card" onSubmit={pay}>
      <button className="payment-close" type="button" onClick={onClose} disabled={processing} aria-label="Close payment">×</button>
      <h2>Payment</h2>
      <p className="payment-intro">Complete your card payment to create your personalized journey.</p>
      <label>Card Number<div className="stripe-card-field"><CardNumberElement options={{ showIcon: true, style: cardStyle }} /></div></label>
      <div className="payment-row">
        <label>Expiry Date<div className="stripe-card-field"><CardExpiryElement options={{ style: cardStyle }} /></div></label>
        <label>CVV<div className="stripe-card-field"><CardCvcElement options={{ style: cardStyle }} /></div></label>
      </div>
      <label>Name on Card<Input className="payment-input" required autoComplete="cc-name" value={cardholderName} onChange={(event) => setCardholderName(event.target.value)} placeholder="John Doe" /></label>
      <div className="payment-row">
        <div className="payment-field">
          <Label>Country</Label>
          <Select value={country} onValueChange={(value) => value && setCountry(value)}>
            <SelectTrigger className="payment-country-trigger" aria-label="Country">
              <SelectValue>{countries.find((item) => item.code === country)?.name}</SelectValue>
            </SelectTrigger>
            <SelectContent align="start" className="payment-country-content">
              {countries.map((item) => <SelectItem className="payment-country-item" key={item.code} value={item.code}>{item.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <label>ZIP Code<Input className="payment-input" required autoComplete="postal-code" inputMode="numeric" value={postalCode} onChange={(event) => setPostalCode(event.target.value)} placeholder="1234" /></label>
      </div>
      <div className="save-payment">
        <Checkbox id="save-payment-details" className="payment-checkbox" defaultChecked />
        <Label htmlFor="save-payment-details">Save payment details for future purchases</Label>
      </div>
      {error && <div className="payment-error" role="alert"><AlertCircle size={15} />{error}</div>}
      <div className="payment-total"><strong>Total Amount</strong><strong>{formatApiPrice(intent.amount)}</strong></div>
      <button className="payment-submit" disabled={!stripe || processing}>
        {processing ? <><Loader2 className="spin" size={16} /> Processing securely…</> : <>Pay &amp; create my journey <ArrowRight size={14} /></>}
      </button>
      <small className="payment-secure"><ShieldCheck size={13} /> Secure payment powered by Stripe</small>
    </form>
  );
}

export function JourneyQuiz() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.user?.accessToken;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [budget, setBudget] = useState(300);
  const [birthdate, setBirthdate] = useState({ day: "", month: "", year: "" });
  const [validationError, setValidationError] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [intent, setIntent] = useState<PaymentIntentData | null>(null);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const q = questions[step];

  useEffect(() => {
    const raw = localStorage.getItem(draftKey);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      if (draft.answers) setAnswers(draft.answers);
      if (draft.budget) setBudget(draft.budget);
      if (draft.birthdate) setBirthdate(draft.birthdate);
      if (Number.isInteger(draft.step)) setStep(Math.min(draft.step, questions.length - 1));
    } catch {
      localStorage.removeItem(draftKey);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=%2Fjourney");
    }
  }, [router, status]);

  const saveDraft = useCallback(() => {
    localStorage.setItem(draftKey, JSON.stringify({ answers, budget, birthdate, step }));
  }, [answers, birthdate, budget, step]);

  const selectAnswer = (value: string) => {
    setValidationError("");
    setAnswers((current) => {
      if (!q.multiple) return { ...current, [q.key]: value };
      const selected = Array.isArray(current[q.key]) ? current[q.key] as string[] : [];
      if (value === "No limitations") return { ...current, [q.key]: [value] };
      const withoutNone = selected.filter((item) => item !== "No limitations");
      return {
        ...current,
        [q.key]: withoutNone.includes(value)
          ? withoutNone.filter((item) => item !== value)
          : [...withoutNone, value],
      };
    });
  };

  const isSelected = (value: string) => {
    const answer = answers[q.key];
    return Array.isArray(answer) ? answer.includes(value) : answer === value;
  };

  const validateStep = () => {
    if (q.kind === "range") return true;
    if (q.kind === "date") {
      const iso = `${birthdate.year}-${birthdate.month.padStart(2, "0")}-${birthdate.day.padStart(2, "0")}`;
      const parsed = new Date(`${iso}T00:00:00Z`);
      const valid = /^\d{4}-\d{2}-\d{2}$/.test(iso) && !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(iso) && parsed < new Date();
      if (!valid) setValidationError("Enter a valid birthdate in the past.");
      return valid;
    }
    const value = answers[q.key];
    const valid = Array.isArray(value) ? value.length > 0 : Boolean(value?.trim());
    if (!valid) setValidationError(q.kind === "text" ? "Tell us a little about what you need from this trip." : "Choose an option to continue.");
    return valid;
  };

  const questionnaire = useMemo<QuestionnaireAnswers>(() => ({
    todays_feeling: String(answers.todays_feeling || ""),
    experience_kind: String(answers.experience_kind || ""),
    energy_level: String(answers.energy_level || ""),
    travel_style: String(answers.travel_style || "").replace("|", " (") + (String(answers.travel_style || "").includes("|") ? ")" : ""),
    trip_organization: String(answers.trip_organization || ""),
    activity_restrictions: Array.isArray(answers.activity_restrictions) ? answers.activity_restrictions : [],
    life_season: String(answers.life_season || ""),
    preferred_environments: Array.isArray(answers.preferred_environments) ? answers.preferred_environments : [],
    birthdate: `${birthdate.year}-${birthdate.month.padStart(2, "0")}-${birthdate.day.padStart(2, "0")}`,
    total_trip_budget: budget,
    trip_length_days: tripLengthToDays(String(answers.trip_length_days || "")),
  }), [answers, birthdate, budget]);

  const initializePayment = useCallback(async () => {
    if (!token) {
      setPaymentError("Your session has expired. Sign in again to continue securely.");
      setPaymentLoading(false);
      return;
    }
    setPaymentLoading(true);
    setPaymentError("");
    setIntent(null);
    try {
      const price = await journeyApi<{ price: number }>("/price");
      const amount = Number(price?.price);
      if (!Number.isFinite(amount) || amount < 0.5) throw new Error("The journey price is currently unavailable.");
      const analysisPayload = {
        questions_answers: questionnaire,
        hope_of_this_trip: String(answers.hope_of_this_trip || ""),
      };
      const data = await journeyApi<PaymentIntentData>("/payments", token, {
        method: "POST",
        body: JSON.stringify({
          amount,
          currency: "usd",
          description: "Velari personalized emotional journey",
          nameOnCard: session?.user?.name,
          email: session?.user?.email,
          quiz: questions.map((question) => ({
            question: question.title.replaceAll("\n", " "),
            answer: question.key === "total_trip_budget"
              ? String(budget)
              : question.key === "birthdate"
                ? questionnaire.birthdate
                : Array.isArray(answers[question.key])
                  ? (answers[question.key] as string[]).join(", ")
                  : String(answers[question.key] || ""),
          })),
          ...analysisPayload,
        }),
      });
      sessionStorage.setItem(`velari-analysis-${data.paymentIntentId}`, JSON.stringify(analysisPayload));
      setIntent(data);
      setStripePromise(loadStripe(data.publishableKey));
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : "Unable to prepare payment.");
    } finally {
      setPaymentLoading(false);
    }
  }, [answers, budget, questionnaire, session?.user?.email, session?.user?.name, token]);

  const continueJourney = () => {
    setValidationError("");
    if (!validateStep()) return;
    if (step < questions.length - 1) {
      setStep((current) => current + 1);
      return;
    }
    saveDraft();
    setPaymentOpen(true);
    void initializePayment();
  };

  const saveAndExit = () => {
    saveDraft();
    toast.success("Your journey draft has been saved.");
    router.push("/");
  };

  return <main className="quiz-page">
    <header className="quiz-header">
      <button onClick={() => step ? setStep(step - 1) : router.push("/")}><ArrowLeft size={15} /> Back</button>
      <Image src="/images/logo.png" alt="Velari" width={125} height={44} priority />
      <button onClick={saveAndExit}>Save &amp; Exit</button>
    </header>
    <div className="quiz-progress" aria-hidden="true"><span style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
    <section className="quiz-stage" key={step}>
      <div className="quiz-copy">
        <small>QUESTION {step + 1} of {questions.length}{q.multiple ? " · SELECT ALL THAT APPLY" : ""}</small>
        <h1>{q.title.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h1>
        {q.prompt && <p>{q.prompt}</p>}
        {(!q.kind || q.kind === "options") && <div className={`quiz-options ${q.options!.length > 7 ? "wide" : ""}`}>
          {q.options!.map((option, i) => { const Icon = optionIcons[i % optionIcons.length]; return <button type="button" key={option} className={isSelected(option) ? "selected" : ""} aria-pressed={isSelected(option)} onClick={() => selectAnswer(option)}><Icon size={14} />{option}</button>; })}
        </div>}
        {q.kind === "cards" && <div className="quiz-cards">{q.options!.map((raw, i) => { const [name, desc] = raw.split("|"); const Icon = [User, Users, Users, Home, Thermometer, Droplets][i % 6]; return <button type="button" key={raw} className={isSelected(raw) ? "selected" : ""} aria-pressed={isSelected(raw)} onClick={() => selectAnswer(raw)}><Icon size={18} /><span><strong>{name}</strong>{desc && <small>{desc}</small>}</span></button>; })}</div>}
        {q.kind === "date" && <div className="date-fields">
          <input aria-label="Day" inputMode="numeric" placeholder="DD" maxLength={2} value={birthdate.day} onChange={(event) => { setValidationError(""); setBirthdate({ ...birthdate, day: event.target.value.replace(/\D/g, "") }); }} />
          <input aria-label="Month" inputMode="numeric" placeholder="MM" maxLength={2} value={birthdate.month} onChange={(event) => { setValidationError(""); setBirthdate({ ...birthdate, month: event.target.value.replace(/\D/g, "") }); }} />
          <input aria-label="Year" inputMode="numeric" placeholder="YYYY" maxLength={4} value={birthdate.year} onChange={(event) => { setValidationError(""); setBirthdate({ ...birthdate, year: event.target.value.replace(/\D/g, "") }); }} />
        </div>}
        {q.kind === "range" && <div className="budget-field"><strong>{formatApiPrice(budget)}</strong><input aria-label="Total trip budget" type="range" min="100" max="7000" step="100" value={budget} onChange={(event) => setBudget(Number(event.target.value))} /><div><span>$100</span><span>$7,000</span></div></div>}
        {q.kind === "text" && <textarea aria-label="Your hopes for this trip" placeholder="Type Here..." value={String(answers[q.key] || "")} onChange={(event) => { setValidationError(""); setAnswers({ ...answers, [q.key]: event.target.value }); }} />}
        {validationError && <p className="quiz-error" role="alert"><AlertCircle size={14} />{validationError}</p>}
      </div>
      <button className="quiz-continue" onClick={continueJourney}>{step === questions.length - 1 ? "Continue to payment" : "Continue"} <ArrowRight size={15} /></button>
    </section>
    {paymentOpen && <div className="payment-backdrop" role="dialog" aria-modal="true" aria-label="Payment">
      {paymentLoading || status === "loading" ? <div className="payment-card payment-skeleton" aria-label="Preparing secure payment"><span className="skeleton-line title" /><span className="skeleton-line" /><span className="skeleton-box" /><span className="skeleton-line short" /><span className="skeleton-button" /></div>
        : paymentError ? <div className="payment-card payment-state"><button className="payment-close" type="button" onClick={() => setPaymentOpen(false)} aria-label="Close payment">×</button><AlertCircle size={34} /><h2>Payment couldn&apos;t load</h2><p>{paymentError}</p><button className="payment-submit" type="button" onClick={() => void initializePayment()}><RefreshCw size={15} /> Try again</button></div>
          : intent && stripePromise ? <Elements stripe={stripePromise}><PaymentForm intent={intent} name={session?.user?.name} email={session?.user?.email} onClose={() => setPaymentOpen(false)} /></Elements>
            : null}
    </div>}
  </main>;
}
