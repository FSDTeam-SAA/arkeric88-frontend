"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AlertCircle, Compass, Download, Loader2, MapPin, RefreshCw, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { FooterSection } from "@/components/landing/sections/FooterSection";
import { NavbarSection } from "@/components/landing/sections/NavbarSection";
import { ApiError, journeyApi, JourneyHistory } from "@/lib/journey-api";
import { downloadItineraryPdf } from "@/lib/itinerary-pdf";

function ItinerarySkeleton() {
  return <main className="itinerary-page"><NavbarSection activePage="none" /><div className="itinerary-hero itinerary-hero-skeleton" /><section className="itinerary-layout"><aside className="itinerary-aside-skeleton"><i /><i /><i /><i /></aside><div className="itinerary-content-skeleton"><i /><i /><i /><i /></div></section></main>;
}

export function ItineraryPage({ historyId }: { historyId?: string }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.user?.accessToken;
  const [history, setHistory] = useState<JourneyHistory | null>(null);
  const [dayIndex, setDayIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<{ message: string; notFound?: boolean } | null>(null);

  const load = useCallback(async () => {
    if (!token || !historyId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await journeyApi<JourneyHistory>(`/history/my/${encodeURIComponent(historyId)}`, token);
      if (data.aiAnalysisStatus !== "completed" || !data.tourPlan?.length) {
        setError({ message: "The full itinerary hasn't been generated yet. Choose a destination from your results first.", notFound: true });
      } else {
        setHistory(data);
      }
    } catch (caught) {
      const apiError = caught as ApiError;
      setError({ message: apiError.message, notFound: apiError.status === 404 || apiError.status === 400 });
    } finally {
      setLoading(false);
    }
  }, [historyId, token]);

  useEffect(() => {
    if (status === "loading") return;
    if (!token) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(`/itinerary/${historyId || ""}`)}`);
      return;
    }
    if (!historyId) {
      setError({ message: "We couldn't identify this itinerary.", notFound: true });
      setLoading(false);
      return;
    }
    void load();
  }, [historyId, load, router, status, token]);

  if (loading || status === "loading") return <ItinerarySkeleton />;
  if (error || !history) return <main className="itinerary-page"><NavbarSection activePage="none" /><section className="journey-state"><div className="journey-state-icon">{error?.notFound ? <Compass size={32} /> : <AlertCircle size={32} />}</div><h1>{error?.notFound ? "Itinerary not found" : "We hit an unexpected detour"}</h1><p>{error?.message || "This itinerary is unavailable."}</p><div>{!error?.notFound && <button type="button" onClick={() => void load()}><RefreshCw size={15} /> Try again</button>}<Link href="/account/search-history">View journey history</Link></div></section><FooterSection /></main>;

  const plans = history.tourPlan || [];
  const activeDay = plans[dayIndex] || plans[0];
  const city = history.selectedCity || "Your destination";
  const cityMatch = history.suggestedCities?.find((item) => item.cityName.toLowerCase() === city.toLowerCase());
  const heroImage = cityMatch?.cityImage?.find(Boolean) || history.stay?.photos?.find(Boolean) || "/images/place-2.jpg";
  const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const downloadPdf = async () => {
    if (downloadingPdf) return;
    setDownloadingPdf(true);
    try {
      await downloadItineraryPdf(history, city, cityMatch?.countryName);
      toast.success("Your complete itinerary PDF has been downloaded.");
    } catch {
      toast.error("We couldn't create the PDF. Please try again.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const regenerateDay = async () => {
    if (!token || !history.activitySessionId || regenerating) {
      toast.error("This itinerary can’t be regenerated because its activity session is unavailable.");
      return;
    }
    setRegenerating(true);
    try {
      const data = await journeyApi<{ history: JourneyHistory }>("/history/regenerate-tour-plan", token, {
        method: "POST",
        body: JSON.stringify({ activity_session_id: history.activitySessionId, day_to_regenerate: activeDay.day || dayIndex + 1 }),
      });
      setHistory(data.history);
      toast.success(`Day ${activeDay.day || dayIndex + 1} has been refreshed.`);
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Unable to refresh this day.");
    } finally {
      setRegenerating(false);
    }
  };

  return <main className="itinerary-page"><NavbarSection activePage="none" />
    <section className="itinerary-hero" style={{ backgroundImage: `url(${JSON.stringify(heroImage)})` }}><div className="itinerary-shade" /><div className="itinerary-title"><h1>Your Journey to {city}</h1><p>Curated around your emotional and travel profile</p></div><span>{city}{cityMatch?.countryName ? `, ${cityMatch.countryName}` : ""} · {plans.length} Days</span><button type="button" onClick={() => void downloadPdf()} disabled={downloadingPdf}>{downloadingPdf ? <><Loader2 className="spin" size={15} /> Creating PDF…</> : <><Download size={15} /> Download PDF</>}</button></section>
    <section className="itinerary-layout"><aside><h3>Your Trip at a Glance</h3><small>Duration</small><strong>{plans.length} Days</strong><small>Zodiac sign</small><strong>{history.userProfile?.zodiacSign || "—"}</strong><small>Travel style</small><strong>{history.userProfile?.travelStyle || "—"}</strong><small>Destination</small><strong>{city}{cityMatch?.countryName ? `, ${cityMatch.countryName}` : ""}</strong>{history.stay?.name && <><small>Recommended stay</small><strong>{history.stay.name}</strong>{history.stay.rating && <span className="stay-rating"><Star size={12} fill="currentColor" />{history.stay.rating}</span>}</>}</aside>
      <div className="day-plan"><div className="day-tabs">{plans.map((plan, index) => <button type="button" key={`${plan.day}-${index}`} onClick={() => setDayIndex(index)} className={dayIndex === index ? "active" : ""}>Day {plan.day || index + 1}</button>)}</div><h2>Day {activeDay.day || dayIndex + 1}</h2><button type="button" className="match-link" onClick={() => void regenerateDay()} disabled={regenerating}>{regenerating ? <><Loader2 className="spin" size={13} /> Refreshing day…</> : <><RefreshCw size={13} /> Change this day</>}</button><p>{activeDay.activities?.length ? "A thoughtfully paced experience, personalized for you." : "No activities were returned for this day."}</p><div className="timeline">{activeDay.activities?.map((activity, index) => {
        const activityImage = activity.activityImage?.find(Boolean);
        return <article className={activityImage ? "has-image" : ""} key={`${activity.activityName}-${index}`}><span className="timeline-dot" />{activityImage && <div className="timeline-activity-image"><Image src={activityImage} alt="" fill unoptimized sizes="150px" /></div>}<div className="timeline-copy"><div className="timeline-heading"><time>{activity.activityTime || "Flexible time"}</time><b>{currency.format(activity.activityCost || 0)}</b></div><h3>{activity.activityName}</h3><p>{activity.activityDescription}</p><small><MapPin size={13} /><span><strong>{activity.activityLocation || city}</strong>{activity.activityAddress && activity.activityAddress !== activity.activityLocation && <em>{activity.activityAddress}</em>}</span></small>{activity.distanceFromPreviousKm != null && <span className="timeline-distance">{activity.distanceFromPreviousKm.toLocaleString(undefined, { maximumFractionDigits: 1 })} km from previous stop</span>}</div></article>;
      })}</div>{dayIndex === plans.length - 1 && <div className="travel-notes">{history.packingTips && <article><h3>Packing tips</h3><p>{history.packingTips}</p></article>}{history.travelTips && <article><h3>Travel tips</h3><p>{history.travelTips}</p></article>}{history.totalCostEstimate != null && <article><h3>Estimated activity total</h3><p>{currency.format(history.totalCostEstimate)}</p></article>}</div>}</div>
    </section><FooterSection /></main>;
}
