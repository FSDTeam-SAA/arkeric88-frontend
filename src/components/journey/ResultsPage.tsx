"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { AlertCircle, ArrowRight, CalendarDays, Check, Compass, CreditCard, Loader2, MapPin, RefreshCw, SlidersHorizontal, Sparkles, UserRound } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FooterSection } from "@/components/landing/sections/FooterSection";
import { NavbarSection } from "@/components/landing/sections/NavbarSection";
import { ApiError, JourneyHistory, journeyApi, SuggestedCity, VelariIntakeUpdate } from "@/lib/journey-api";

type PaymentHistory = {
  payment: {
    status: "pending" | "succeeded" | "failed" | "canceled";
    analysisStatus: "pending" | "processing" | "completed" | "failed" | "skipped";
    analysisError?: string;
  };
  history: JourneyHistory | null;
};

const fallbackImages = ["/images/place-1.jpg", "/images/place-2.jpg", "/images/place-3.jpg", "/images/place-4.jpg"];
const analysisSteps = [
  { title: "Verifying payment", detail: "Confirming your secure checkout", icon: CreditCard },
  { title: "Understanding you", detail: "Reading your travel preferences", icon: UserRound },
  { title: "Comparing destinations", detail: "Balancing pace, budget and preferences", icon: SlidersHorizontal },
  { title: "Curating your matches", detail: "Selecting journeys that fit", icon: MapPin },
];

function ResultsSkeleton({ message = "Reading your travel preferences…" }: { message?: string }) {
  const confirmingPayment = message.startsWith("Confirming");
  const [activeStep, setActiveStep] = useState(confirmingPayment ? 0 : 1);
  useEffect(() => {
    if (confirmingPayment) { setActiveStep(0); return; }
    setActiveStep(1);
    const compareTimer = window.setTimeout(() => setActiveStep(2), 2600);
    const curateTimer = window.setTimeout(() => setActiveStep(3), 6200);
    return () => { window.clearTimeout(compareTimer); window.clearTimeout(curateTimer); };
  }, [confirmingPayment]);

  return <main className="results-page"><NavbarSection activePage="none" /><section className="analysis-state" aria-live="polite" aria-busy="true">
    <div className="analysis-glow analysis-glow-left" aria-hidden="true" /><div className="analysis-glow analysis-glow-right" aria-hidden="true" />
    <div className="analysis-shell"><small className="analysis-eyebrow"><Sparkles size={12} /> PERSONALIZING YOUR JOURNEY</small><div className="analysis-orbit" aria-hidden="true"><span /><Sparkles size={25} /><i /></div><h1>Your journey is taking shape</h1><p>We&apos;re turning your answers into destinations that match how you want to feel and travel.</p><div className="analysis-live-status"><Loader2 className="spin" size={14} /><span>{message}</span></div><div className="analysis-progress" aria-hidden="true"><span /></div><ol className="analysis-steps" aria-label="Journey preparation progress">{analysisSteps.map((step, index) => { const Icon = step.icon; const state = index < activeStep ? "complete" : index === activeStep ? "active" : "waiting"; return <li className={state} key={step.title} aria-current={state === "active" ? "step" : undefined}><span className="analysis-step-icon">{state === "complete" ? <Check size={15} /> : <Icon size={15} />}</span><span><strong>{step.title}</strong><small>{step.detail}</small></span></li>; })}</ol><div className="results-skeleton-grid" aria-hidden="true">{[0, 1, 2].map((item) => <div className="result-skeleton-card" style={{ "--card-index": item } as React.CSSProperties} key={item}><span><i /></span><div><i /><i /><i /></div></div>)}</div><small className="analysis-reassurance">You can keep this page open—we&apos;ll reveal your matches as soon as they&apos;re ready.</small></div>
  </section></main>;
}

function ResultsState({ title, message, notFound, onRetry }: { title: string; message: string; notFound?: boolean; onRetry?: () => void }) {
  return <main className="results-page"><NavbarSection activePage="none" /><section className="journey-state"><div className="journey-state-icon">{notFound ? <Compass size={32} /> : <AlertCircle size={32} />}</div><h1>{title}</h1><p>{message}</p><div>{onRetry && <button type="button" onClick={onRetry}><RefreshCw size={15} /> Try again</button>}<Link href="/journey">Start a new journey</Link></div></section><FooterSection /></main>;
}

function recordMessages(value?: Record<string, unknown>): string[] {
  if (!value) return [];
  return Object.values(value).flatMap((item) => {
    if (typeof item === "string" || typeof item === "number") return [String(item)];
    if (Array.isArray(item)) return item.filter((entry): entry is string => typeof entry === "string");
    return [];
  });
}

export function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const token = session?.user?.accessToken;
  const paymentIntent = searchParams.get("payment_intent");
  const historyId = searchParams.get("historyId");
  const [history, setHistory] = useState<JourneyHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Reading your travel preferences…");
  const [error, setError] = useState<{ message: string; notFound?: boolean } | null>(null);
  const [selectedDestinationId, setSelectedDestinationId] = useState("");
  const [regenerating, setRegenerating] = useState(false);
  const [regenerationInstruction, setRegenerationInstruction] = useState("");
  const [regenerationPace, setRegenerationPace] = useState("");
  const [regenerationBudget, setRegenerationBudget] = useState("");
  const pollCount = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setError(null);
    try {
      if (historyId) {
        const data = await journeyApi<JourneyHistory>(`/history/my/${encodeURIComponent(historyId)}`, token);
        setHistory(data); setLoading(false); return;
      }
      if (!paymentIntent) {
        setError({ message: "We couldn't identify the journey you were looking for.", notFound: true }); setLoading(false); return;
      }
      const data = await journeyApi<PaymentHistory>(`/history/by-payment/${encodeURIComponent(paymentIntent)}`, token);
      if (["failed", "canceled"].includes(data.payment.status)) {
        setError({ message: "The payment was not completed. You haven't been charged for an incomplete payment." }); setLoading(false); return;
      }
      if (data.payment.analysisStatus === "failed") {
        setError({ message: data.payment.analysisError || "The destination analysis could not be completed." }); setLoading(false); return;
      }
      if (data.payment.status === "succeeded" && data.payment.analysisStatus === "completed" && data.history) {
        setHistory(data.history); setLoading(false);
        sessionStorage.removeItem("velari-last-payment"); localStorage.removeItem("velari-journey-draft");
        return;
      }
      pollCount.current += 1;
      setMessage(data.payment.status === "pending" ? "Confirming your secure payment…" : "Our AI is matching destinations to your preferences…");
      if (pollCount.current >= 60) {
        setError({ message: "Your payment is complete, but destination generation is taking longer than expected. You can safely try again." }); setLoading(false); return;
      }
      timer.current = setTimeout(() => void load(), 2000);
    } catch (caught) {
      const apiError = caught as ApiError;
      setError({ message: apiError.message, notFound: apiError.status === 404 }); setLoading(false);
    }
  }, [historyId, paymentIntent, token]);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!token) { router.replace(`/login?callbackUrl=${encodeURIComponent(`/results?${searchParams.toString()}`)}`); return; }
    pollCount.current = 0; setLoading(true); void load();
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [load, router, searchParams, sessionStatus, token]);

  const retry = () => { pollCount.current = 0; setError(null); setLoading(true); void load(); };

  const createItinerary = async (city: SuggestedCity) => {
    if (!history || !token || !history.aiSessionId) { toast.error("This journey is missing its AI session. Please refresh your matches."); return; }
    const hasSavedItinerary = Boolean(history.tourPlan?.length && history.selectedDestinationId === city.destinationId);
    if (hasSavedItinerary) { router.push(`/itinerary/${history._id}`); return; }
    setSelectedDestinationId(city.destinationId);
    try {
      const data = await journeyApi<{ history: JourneyHistory }>("/history/tour-plan", token, { method: "POST", body: JSON.stringify({ session_id: history.aiSessionId, destination_id: city.destinationId }) });
      router.push(`/itinerary/${data.history._id}`);
    } catch (caught) {
      try {
        const latest = await journeyApi<JourneyHistory>(`/history/my/${encodeURIComponent(history._id)}`, token);
        if (latest.tourPlan?.length && latest.selectedDestinationId === city.destinationId) { setHistory(latest); router.push(`/itinerary/${latest._id}`); return; }
      } catch { /* preserve the original request error */ }
      setSelectedDestinationId(""); toast.error(caught instanceof Error ? caught.message : "Unable to create the itinerary.");
    }
  };

  const regenerateSuggestions = async () => {
    if (!token || !history?.aiSessionId || regenerating) return;
    const updates: VelariIntakeUpdate = {};
    if (regenerationPace) updates.trip_pace = regenerationPace as VelariIntakeUpdate["trip_pace"];
    const budget = Number(regenerationBudget);
    if (regenerationBudget && Number.isFinite(budget) && budget >= 100 && budget <= 7000) updates.budget_per_night = budget;
    const instruction = regenerationInstruction.trim() || "Show different destinations.";
    setRegenerating(true);
    try {
      const data = await journeyApi<{ history: JourneyHistory }>("/history/regenerate-suggested-cities", token, {
        method: "POST",
        body: JSON.stringify({ session_id: history.aiSessionId, user_instruction: instruction, ...(Object.keys(updates).length ? { intake_updates: updates } : {}) }),
      });
      setHistory(data.history); setSelectedDestinationId(""); setRegenerationInstruction(""); setRegenerationPace(""); setRegenerationBudget("");
    } catch (caught) { toast.error(caught instanceof Error ? caught.message : "Unable to find more destinations."); }
    finally { setRegenerating(false); }
  };

  if (loading || sessionStatus === "loading") return <ResultsSkeleton message={message} />;
  if (error) return <ResultsState title={error.notFound ? "Journey not found" : "We hit an unexpected detour"} message={error.message} notFound={error.notFound} onRetry={!error.notFound ? retry : undefined} />;
  if (!history) return <ResultsState title="Journey not found" message="We couldn't load this journey." notFound />;

  if (history.matchStatus === "no_valid_result") {
    const guidance = recordMessages(history.noValidResult);
    const clarifications = (history.clarifications || []).flatMap(recordMessages);
    return <main className="results-page"><NavbarSection activePage="none" /><section className="journey-state"><div className="journey-state-icon"><Compass size={32} /></div><h1>Let&apos;s refine your journey</h1><p>{guidance[0] || "We couldn't find a destination that meets every current preference."}</p>{guidance.slice(1).map((item) => <p key={item}>{item}</p>)}{clarifications.length > 0 && <ul>{clarifications.map((item) => <li key={item}>{item}</li>)}</ul>}<div><Link href="/journey">Adjust trip preferences</Link><Link href="/account/search-history">View journey history</Link></div></section><FooterSection /></main>;
  }

  const profile = history.userProfile;
  const headline = profile?.seeking || "Your personalized journey";
  const heroDescription = `Destinations selected for your ${profile?.preferredPace?.replace("_", " ") || "preferred"} pace, budget, and travel style.`;
  const tags = (history.travelThemes || []).slice(0, 3);
  return <main className="results-page"><NavbarSection activePage="none" />
    <section className="results-hero"><div className="results-shade" /><div><small>YOUR PERSONALIZED JOURNEY</small><h1>{headline}</h1><p>{heroDescription}</p><div className="result-tags">{(tags.length ? tags : [profile?.currentEnergy, profile?.travelStyle]).filter(Boolean).map((tag) => <span key={tag}>{tag}</span>)}</div></div></section>
    <section className="matched"><h2>Your Matched Destinations</h2><p>Choose a destination to create the full day-by-day itinerary.</p><div className="regeneration-controls"><input value={regenerationInstruction} onChange={(event) => setRegenerationInstruction(event.target.value)} placeholder="What would you like to change?" aria-label="Destination regeneration instruction" /><select value={regenerationPace} onChange={(event) => setRegenerationPace(event.target.value)} aria-label="Updated trip pace"><option value="">Keep current pace</option><option value="mostly_open">Mostly open time</option><option value="one_highlight">One highlight a day</option><option value="balanced">Balanced</option><option value="full_days">Full days</option></select><input type="number" min="100" max="7000" value={regenerationBudget} onChange={(event) => setRegenerationBudget(event.target.value)} placeholder="New nightly budget" aria-label="Updated nightly budget" /><button type="button" className="match-link" onClick={() => void regenerateSuggestions()} disabled={regenerating || Boolean(selectedDestinationId)}>{regenerating ? <><Loader2 className="spin" size={13} /> Finding more options…</> : <><RefreshCw size={13} /> Show other options</>}</button></div><div className="match-grid">{history.suggestedCities.map((city, index) => {
      const image = city.cityImage?.find(Boolean) || fallbackImages[index % fallbackImages.length];
      const isCreating = selectedDestinationId === city.destinationId;
      const hasSavedItinerary = Boolean(history.tourPlan?.length && history.selectedDestinationId === city.destinationId);
      return <button className="match-card" type="button" key={city.destinationId} onClick={() => void createItinerary(city)} disabled={Boolean(selectedDestinationId) || regenerating} aria-label={`${hasSavedItinerary ? "View saved" : "Create"} ${city.cityName} itinerary`}><article><div className="match-image"><Image src={image} alt={city.cityName} fill unoptimized sizes="(max-width:700px) 90vw, 30vw" onError={(event) => { event.currentTarget.src = fallbackImages[index % fallbackImages.length]; }} /><span>{city.matchScore != null ? `Match score: ${city.matchScore}` : `#${index + 1} match`}</span>{isCreating && <div className="match-loading"><div className="match-loader-mark"><span /><Sparkles size={23} /></div><strong>Designing your {city.cityName} journey</strong><small>Organizing your days, stay and experiences…</small><div className="match-loader-track"><i /></div></div>}</div><div className="match-copy"><h3>{city.cityName}</h3><div className="match-meta"><span><MapPin size={12} />{city.countryName}</span><span><CalendarDays size={12} />{city.numberOfDays || "—"} days</span></div><p>{city.description || "Personalized for your travel preferences."}</p>{city.matchReasons.length > 0 && <p><strong>Why it fits:</strong> {city.matchReasons.slice(0, 3).join(" · ")}</p>}{city.tradeoffs.length > 0 && <p><strong>Trade-offs:</strong> {city.tradeoffs.slice(0, 2).join(" · ")}</p>}{city.unresolvedFacts.length > 0 && <p><strong>To confirm:</strong> {city.unresolvedFacts.slice(0, 2).join(" · ")}</p>}{city.warnings.map((warning) => <p key={warning} role="note"><AlertCircle size={13} /> {warning}</p>)}<span className="match-link">{hasSavedItinerary ? "View Saved Itinerary" : "Create Full Itinerary"} <ArrowRight size={13} /></span></div></article></button>;
    })}</div></section><FooterSection />
  </main>;
}
