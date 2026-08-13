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
import { ApiError, journeyApi, JourneyHistory } from "@/lib/journey-api";

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
  { title: "Understanding you", detail: "Reading your archetype, needs and travel style", icon: UserRound },
  { title: "Comparing destinations", detail: "Balancing pace, budget and preferences", icon: SlidersHorizontal },
  { title: "Curating your matches", detail: "Selecting the journeys that fit you best", icon: MapPin },
];

function ResultsSkeleton({ message = "Reading your emotional travel profile…" }: { message?: string }) {
  const confirmingPayment = message.startsWith("Confirming");
  const [activeStep, setActiveStep] = useState(confirmingPayment ? 0 : 1);

  useEffect(() => {
    if (confirmingPayment) {
      setActiveStep(0);
      return;
    }
    setActiveStep(1);
    const compareTimer = window.setTimeout(() => setActiveStep(2), 2600);
    const curateTimer = window.setTimeout(() => setActiveStep(3), 6200);
    return () => {
      window.clearTimeout(compareTimer);
      window.clearTimeout(curateTimer);
    };
  }, [confirmingPayment]);

  return <main className="results-page"><NavbarSection activePage="none" /><section className="analysis-state" aria-live="polite" aria-busy="true">
    <div className="analysis-glow analysis-glow-left" aria-hidden="true" />
    <div className="analysis-glow analysis-glow-right" aria-hidden="true" />
    <div className="analysis-shell">
      <small className="analysis-eyebrow"><Sparkles size={12} /> PERSONALIZING YOUR JOURNEY</small>
      <div className="analysis-orbit" aria-hidden="true"><span /><Sparkles size={25} /><i /></div>
      <h1>Your journey is taking shape</h1>
      <p>We&apos;re turning your answers into destinations that match how you want to feel and travel.</p>
      <div className="analysis-live-status"><Loader2 className="spin" size={14} /><span>{message}</span></div>
      <div className="analysis-progress" aria-hidden="true"><span /></div>
      <ol className="analysis-steps" aria-label="Journey preparation progress">
        {analysisSteps.map((step, index) => {
          const Icon = step.icon;
          const state = index < activeStep ? "complete" : index === activeStep ? "active" : "waiting";
          return <li className={state} key={step.title} aria-current={state === "active" ? "step" : undefined}>
            <span className="analysis-step-icon">{state === "complete" ? <Check size={15} /> : <Icon size={15} />}</span>
            <span><strong>{step.title}</strong><small>{step.detail}</small></span>
          </li>;
        })}
      </ol>
      <div className="results-skeleton-grid" aria-hidden="true">{[0, 1, 2].map((item) => <div className="result-skeleton-card" style={{ "--card-index": item } as React.CSSProperties} key={item}><span><i /></span><div><i /><i /><i /></div></div>)}</div>
      <small className="analysis-reassurance">You can keep this page open—we&apos;ll reveal your matches as soon as they&apos;re ready.</small>
    </div>
  </section></main>;
}

function ResultsState({ title, message, notFound, onRetry }: { title: string; message: string; notFound?: boolean; onRetry?: () => void }) {
  return <main className="results-page"><NavbarSection activePage="none" /><section className="journey-state"><div className="journey-state-icon">{notFound ? <Compass size={32} /> : <AlertCircle size={32} />}</div><h1>{title}</h1><p>{message}</p><div>{onRetry && <button type="button" onClick={onRetry}><RefreshCw size={15} /> Try again</button>}<Link href="/journey">Start a new journey</Link></div></section><FooterSection /></main>;
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
  const [message, setMessage] = useState("Reading your emotional travel profile…");
  const [error, setError] = useState<{ message: string; notFound?: boolean; analysisFailed?: boolean } | null>(null);
  const [selectedCity, setSelectedCity] = useState("");
  const pollCount = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setError(null);
    try {
      if (historyId) {
        const data = await journeyApi<JourneyHistory>(`/history/my/${encodeURIComponent(historyId)}`, token);
        setHistory(data);
        setLoading(false);
        return;
      }
      if (!paymentIntent) {
        setError({ message: "We couldn't identify the journey you were looking for.", notFound: true });
        setLoading(false);
        return;
      }
      const data = await journeyApi<PaymentHistory>(`/history/by-payment/${encodeURIComponent(paymentIntent)}`, token);
      if (["failed", "canceled"].includes(data.payment.status)) {
        setError({ message: "The payment was not completed. You haven't been charged for an incomplete payment." });
        setLoading(false);
        return;
      }
      if (data.payment.analysisStatus === "failed") {
        setError({ message: data.payment.analysisError || "The AI couldn't create your recommendations this time.", analysisFailed: true });
        setLoading(false);
        return;
      }
      if (data.history?.suggestedCities?.length) {
        setHistory(data.history);
        setLoading(false);
        sessionStorage.removeItem("velari-last-payment");
        sessionStorage.removeItem(`velari-analysis-${paymentIntent}`);
        localStorage.removeItem("velari-journey-draft");
        return;
      }
      pollCount.current += 1;
      setMessage(data.payment.status === "pending" ? "Confirming your secure payment…" : "Our AI is matching destinations to your unique profile…");
      if (pollCount.current >= 60) {
        setError({ message: "Your payment is complete, but the analysis is taking longer than expected. You can safely try again." });
        setLoading(false);
        return;
      }
      timer.current = setTimeout(() => void load(), 2000);
    } catch (caught) {
      const apiError = caught as ApiError;
      setError({ message: apiError.message, notFound: apiError.status === 404 });
      setLoading(false);
    }
  }, [historyId, paymentIntent, token]);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!token) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(`/results?${searchParams.toString()}`)}`);
      return;
    }
    pollCount.current = 0;
    setLoading(true);
    void load();
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [load, router, searchParams, sessionStatus, token]);

  const retry = async () => {
    pollCount.current = 0;
    setError(null);
    setLoading(true);
    if (error?.analysisFailed && paymentIntent && token) {
      const raw = sessionStorage.getItem(`velari-analysis-${paymentIntent}`);
      if (raw) {
        try {
          const payload = JSON.parse(raw) as Record<string, unknown>;
          const data = await journeyApi<{ history: JourneyHistory }>("/history/suggested-cities", token, {
            method: "POST",
            body: JSON.stringify({ ...payload, payment_intent_id: paymentIntent }),
          });
          setHistory(data.history);
          setLoading(false);
          localStorage.removeItem("velari-journey-draft");
          sessionStorage.removeItem(`velari-analysis-${paymentIntent}`);
          return;
        } catch (caught) {
          setError({ message: caught instanceof Error ? caught.message : "The analysis could not be retried.", analysisFailed: true });
          setLoading(false);
          return;
        }
      }
    }
    void load();
  };

  const createItinerary = async (cityName: string) => {
    if (!history) return;
    const normalizeCity = (value?: string) => value?.trim().toLocaleLowerCase();
    const hasSavedItinerary = Boolean(
      history.tourPlan?.length && normalizeCity(history.selectedCity) === normalizeCity(cityName),
    );

    if (hasSavedItinerary) {
      router.push(`/itinerary/${history._id}`);
      return;
    }

    if (!token || !history.aiSessionId) {
      toast.error("This journey is missing its AI session, so a new itinerary can't be generated.");
      return;
    }
    setSelectedCity(cityName);
    try {
      const data = await journeyApi<{ history: JourneyHistory }>("/history/tour-plan", token, {
        method: "POST",
        body: JSON.stringify({ session_id: history.aiSessionId, selected_city: cityName }),
      });
      router.push(`/itinerary/${data.history._id}`);
    } catch (caught) {
      try {
        const latest = await journeyApi<JourneyHistory>(`/history/my/${encodeURIComponent(history._id)}`, token);
        const savedPlanAvailable = Boolean(
          latest.tourPlan?.length && normalizeCity(latest.selectedCity) === normalizeCity(cityName),
        );
        if (savedPlanAvailable) {
          setHistory(latest);
          router.push(`/itinerary/${latest._id}`);
          return;
        }
      } catch {
        // Preserve the original AI error when the database fallback is unavailable.
      }
      setSelectedCity("");
      toast.error(caught instanceof Error ? caught.message : "Unable to create the itinerary.");
    }
  };

  if (loading || sessionStatus === "loading") return <ResultsSkeleton message={message} />;
  if (error) return <ResultsState title={error.notFound ? "Journey not found" : "We hit an unexpected detour"} message={error.message} notFound={error.notFound} onRetry={!error.notFound ? () => void retry() : undefined} />;
  if (!history || !history.suggestedCities?.length) return <ResultsState title="No destinations found" message="The analysis completed, but no matching destinations were returned. Try a new journey with a few different preferences." notFound />;

  const profile = history.userProfile;
  const archetype = profile?.wellnessArchetype || profile?.seeking || `${profile?.emotionalState || "Mindful"} ${profile?.travelStyle || "traveler"}`;
  const heroDescription = history.astroInsight || `A journey designed for your ${profile?.currentEnergy || "current"} energy, ${profile?.preferredPace?.replace("_", " ") || "natural"} pace, and the experiences your soul is seeking now.`;
  const tags = (history.travelThemes || []).slice(0, 3);

  return <main className="results-page"><NavbarSection activePage="none" />
    <section className="results-hero"><div className="results-shade" /><div><small>YOUR EMOTIONAL TRAVEL PROFILE</small><h1>{archetype}</h1><p>{heroDescription}</p><div className="result-tags">{(tags.length ? tags : [profile?.zodiacSign, profile?.currentEnergy, profile?.travelStyle]).filter(Boolean).map((tag) => <span key={tag}>{tag}</span>)}</div></div></section>
    <section className="matched"><h2>Your Matched Destinations</h2><p>Selected for your unique emotional, astrological, and travel profile.<br />Choose a destination to create the full day-by-day itinerary.</p><div className="match-grid">{history.suggestedCities.map((city, index) => {
      const image = city.cityImage?.find(Boolean) || fallbackImages[index % fallbackImages.length];
      const isCreating = selectedCity === city.cityName;
      const hasSavedItinerary = Boolean(history.tourPlan?.length && history.selectedCity?.trim().toLocaleLowerCase() === city.cityName.trim().toLocaleLowerCase());
      return <button className="match-card" type="button" key={`${city.cityName}-${index}`} onClick={() => void createItinerary(city.cityName)} disabled={Boolean(selectedCity)} aria-label={`${hasSavedItinerary ? "View saved" : "Create"} ${city.cityName} itinerary`}><article><div className="match-image"><Image src={image} alt={city.cityName} fill unoptimized sizes="(max-width:700px) 90vw, 30vw" onError={(event) => { event.currentTarget.src = fallbackImages[index % fallbackImages.length]; }} /><span>#{index + 1} match</span>{isCreating && <div className="match-loading"><div className="match-loader-mark"><span /><Sparkles size={23} /></div><strong>Designing your {city.cityName} journey</strong><small>Organizing your days, stay and experiences…</small><div className="match-loader-track"><i /></div></div>}</div><div className="match-copy"><h3>{city.cityName}</h3><div className="match-meta"><span><MapPin size={12} />{city.countryName}</span><span><CalendarDays size={12} />{city.numberOfDays || profile?.tripLengthDays || "—"} days</span></div><p>{city.description || "Personalized for your emotional and travel profile."}</p><span className="match-link">{hasSavedItinerary ? "View Saved Itinerary" : "Create Full Itinerary"} <ArrowRight size={13} /></span></div></article></button>;
    })}</div></section><FooterSection />
  </main>;
}
