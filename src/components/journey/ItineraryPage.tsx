"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AlertCircle, ArrowLeft, Compass, Download, ExternalLink, Loader2, MapPin, RefreshCw, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { FooterSection } from "@/components/landing/sections/FooterSection";
import { NavbarSection } from "@/components/landing/sections/NavbarSection";
import { ApiError, JourneyHistory, journeyApi, TourActivity } from "@/lib/journey-api";
import { downloadItineraryPdf } from "@/lib/itinerary-pdf";

function ItinerarySkeleton() {
  return <main className="itinerary-page"><NavbarSection activePage="none" /><div className="itinerary-hero itinerary-hero-skeleton" /><section className="itinerary-layout"><aside className="itinerary-aside-skeleton"><i /><i /><i /><i /></aside><div className="itinerary-content-skeleton"><i /><i /><i /><i /></div></section></main>;
}

function formatMoney(amount?: number | null, currency = "USD") {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

function ActivityCard({ activity, city }: { activity: TourActivity; city: string }) {
  const image = activity.activityImage?.find(Boolean);
  const isTransfer = activity.itemType === "transfer";
  const isOpenTime = activity.openSlot && (activity.itemType === "free_time" || activity.itemType === "meal");
  const travelLine = activity.travelMinutesFromPrevious != null
    ? `${activity.travelMinutesFromPrevious} min${activity.travelFrom ? ` from ${activity.travelFrom}` : " from the previous stop"}`
    : undefined;

  if (isTransfer) return <article className="timeline-transfer"><time>{activity.activityTime || "Transfer"}</time><div><strong>{activity.activityName}</strong><p>{activity.activityDescription}</p>{activity.transferMinutes != null && <small>{activity.transferMinutes} min transfer{activity.transferBufferMinutes != null ? ` · ${activity.transferBufferMinutes} min buffer` : ""}{activity.includesFerry ? " · Ferry included" : ""}</small>}</div></article>;
  if (isOpenTime) return <article className="timeline-open-time"><time>{activity.activityTime || "Open time"}</time><div><strong>{activity.activityName}</strong>{activity.activityDescription && <p>{activity.activityDescription}</p>}</div></article>;

  return <article className={`${image ? "has-image" : ""} timeline-activity`}>
    <span className="timeline-dot" />
    {image && <div className="timeline-activity-image"><Image src={image} alt="" fill unoptimized sizes="150px" /></div>}
    <div className="timeline-copy">
      <div className="timeline-heading"><time>{activity.activityTime || "Flexible time"}</time>{activity.priceIndication && <b>{activity.priceIndication}</b>}</div>
      <h3>{activity.activityName}</h3><p>{activity.activityDescription}</p>
      {activity.whySelected && <p className="activity-why"><strong>Why this fits:</strong> {activity.whySelected}</p>}
      {activity.activityAddress && <small><MapPin size={13} /><span>{activity.activityAddress || city}</span></small>}
      {travelLine && <span className="timeline-distance">{travelLine}</span>}
      {activity.viator?.booking_url && <a className="viator-link" href={activity.viator.booking_url} target="_blank" rel="noreferrer">View on Viator <ExternalLink size={13} />{activity.viator.from_price != null && <small>From {formatMoney(activity.viator.from_price, activity.viator.currency)} per person{activity.viator.rating != null ? ` · ★ ${activity.viator.rating}${activity.viator.review_count != null ? ` (${activity.viator.review_count.toLocaleString()} reviews)` : ""}` : ""} on Viator</small>}</a>}
    </div>
  </article>;
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
  const [regenerationInstruction, setRegenerationInstruction] = useState("");
  const [error, setError] = useState<{ message: string; notFound?: boolean } | null>(null);

  const load = useCallback(async () => {
    if (!token || !historyId) return;
    setLoading(true); setError(null);
    try {
      const data = await journeyApi<JourneyHistory>(`/history/my/${encodeURIComponent(historyId)}`, token);
      if (!data.tourPlan?.length && data.aiAnalysisStatus !== "failed") setError({ message: "The full itinerary hasn't been generated yet. Choose a destination from your results first.", notFound: true });
      else setHistory(data);
    } catch (caught) {
      const apiError = caught as ApiError;
      setError({ message: apiError.message, notFound: apiError.status === 404 || apiError.status === 400 });
    } finally { setLoading(false); }
  }, [historyId, token]);

  useEffect(() => {
    if (status === "loading") return;
    if (!token) { router.replace(`/login?callbackUrl=${encodeURIComponent(`/itinerary/${historyId || ""}`)}`); return; }
    if (!historyId) { setError({ message: "We couldn't identify this itinerary.", notFound: true }); setLoading(false); return; }
    void load();
  }, [historyId, load, router, status, token]);

  const goBack = () => window.history.length > 1 ? router.back() : router.push("/account/search-history");
  const regeneratePlan = async (dayToRegenerate?: number) => {
    if (!token || !history?.activitySessionId || regenerating) { toast.error("This itinerary can’t be regenerated because its activity session is unavailable."); return; }
    setRegenerating(true);
    try {
      const data = await journeyApi<{ history: JourneyHistory }>("/history/regenerate-tour-plan", token, { method: "POST", body: JSON.stringify({ activity_session_id: history.activitySessionId, ...(dayToRegenerate ? { day_to_regenerate: dayToRegenerate } : {}), ...(regenerationInstruction.trim() ? { user_instruction: regenerationInstruction.trim() } : {}) }) });
      setHistory(data.history); setDayIndex(0); setRegenerationInstruction("");
      toast.success(dayToRegenerate ? `Day ${dayToRegenerate} has been refreshed.` : "Your complete itinerary has been refreshed.");
    } catch (caught) { toast.error(caught instanceof Error ? caught.message : "Unable to refresh this itinerary."); }
    finally { setRegenerating(false); }
  };

  if (loading || status === "loading") return <ItinerarySkeleton />;
  if (error || !history) return <main className="itinerary-page"><NavbarSection activePage="none" /><section className="journey-state"><div className="journey-state-icon">{error?.notFound ? <Compass size={32} /> : <AlertCircle size={32} />}</div><h1>{error?.notFound ? "Itinerary not found" : "We hit an unexpected detour"}</h1><p>{error?.message || "This itinerary is unavailable."}</p><div>{!error?.notFound && <button type="button" onClick={() => void load()}><RefreshCw size={15} /> Try again</button>}<Link href="/account/search-history">View journey history</Link></div></section><FooterSection /></main>;

  const plans = history.tourPlan || [];
  const city = history.selectedCity || "Your destination";
  const cityMatch = history.suggestedCities.find((item) => item.cityName.toLowerCase() === city.toLowerCase());
  const heroImage = cityMatch?.cityImage.find(Boolean) || history.stops?.flatMap((stop) => stop.stay?.photos || []).find(Boolean) || "/images/place-2.jpg";
  const needsRegeneration = history.validation?.displayReady === false || history.aiAnalysisStatus === "failed";
  const activeDay = plans[dayIndex] || plans[0];
  const downloadPdf = async () => {
    if (downloadingPdf) return;
    setDownloadingPdf(true);
    try { await downloadItineraryPdf(history, city, cityMatch?.countryName); toast.success("Your complete itinerary PDF has been downloaded."); }
    catch { toast.error("We couldn't create the PDF. Please try again."); }
    finally { setDownloadingPdf(false); }
  };

  if (needsRegeneration) return <main className="itinerary-page"><NavbarSection activePage="none" /><section className="journey-state"><div className="journey-state-icon"><RefreshCw size={32} /></div><h1>Your itinerary needs a refresh</h1><p>We couldn&apos;t safely show this itinerary yet. Regenerate it and we&apos;ll prepare a new version.</p><div className="itinerary-regeneration recovery"><input value={regenerationInstruction} onChange={(event) => setRegenerationInstruction(event.target.value)} placeholder="Anything you would like changed?" aria-label="Itinerary regeneration instruction" /><button type="button" onClick={() => void regeneratePlan()} disabled={regenerating}>{regenerating ? <><Loader2 className="spin" size={15} /> Regenerating…</> : <><RefreshCw size={15} /> Regenerate itinerary</>}</button></div><Link href={`/results?historyId=${history._id}`}>Back to destinations</Link></section><FooterSection /></main>;

  return <main className="itinerary-page"><NavbarSection activePage="none" />
    <section className="itinerary-hero" style={{ backgroundImage: `url(${JSON.stringify(heroImage)})` }}><div className="itinerary-shade" /><button type="button" className="itinerary-back" onClick={goBack} aria-label="Go back"><ArrowLeft size={15} /> Back</button><div className="itinerary-title"><h1>Your Journey to {city}</h1><p>{history.feelingBlock?.headline || "Curated around your travel preferences"}</p></div><span>{city}{cityMatch?.countryName ? `, ${cityMatch.countryName}` : ""} · {plans.length} Days</span><button type="button" onClick={() => void downloadPdf()} disabled={downloadingPdf}>{downloadingPdf ? <><Loader2 className="spin" size={15} /> Creating PDF…</> : <><Download size={15} /> Download PDF</>}</button></section>
    <section className="itinerary-layout"><aside><h3>Your Trip at a Glance</h3><small>Duration</small><strong>{plans.length} Days</strong><small>Destination</small><strong>{city}{cityMatch?.countryName ? `, ${cityMatch.countryName}` : ""}</strong>{history.stops?.length ? <><small>Base areas</small><strong>{history.stops.map((stop) => stop.baseArea).join(" · ")}</strong></> : null}</aside>
      <div className="day-plan">
        {history.feelingBlock && <section className="itinerary-detail-card feeling-block"><small>YOUR TRIP INTENTION</small><h2>{history.feelingBlock.primaryFeeling || history.feelingBlock.headline}</h2><p style={{ whiteSpace: "pre-line" }}>{history.feelingBlock.markdown || history.feelingBlock.explanation || history.feelingBlock.headline}</p></section>}
        {history.stops?.map((stop) => <section className="itinerary-detail-card stop-stay" key={stop.stop}><small>STOP {stop.stop} · DAYS {stop.firstDay}–{stop.lastDay}</small><h3>{stop.baseArea} · {stop.nights} night{stop.nights === 1 ? "" : "s"}</h3>{stop.stay && <><strong>{stop.stay.name}</strong><p>{stop.stay.address}</p>{stop.stay.rating != null && <p><Star size={13} fill="currentColor" /> {stop.stay.rating}{stop.stay.priceLevel ? ` · ${stop.stay.priceLevel}` : ""}{stop.stay.averageNightlyPrice != null ? ` · ${formatMoney(Number(stop.stay.averageNightlyPrice))} nightly` : ""}</p>}{stop.stay.whySelected && <small>{stop.stay.whySelected}</small>}{stop.stay.estimateNote && <small>{stop.stay.estimateNote}</small>}</>}</section>)}
        {history.priceBreakdown && <section className="itinerary-detail-card price-breakdown"><small>PRICE GUIDE{history.priceBreakdown.appliesTo ? ` · ${history.priceBreakdown.appliesTo}` : ""}</small><h3>Trip pricing</h3>{history.priceBreakdown.lines.map((line) => <div className="price-line" key={`${line.category}-${line.label}`}><div><strong>{line.label}</strong><small>{line.basis}</small>{line.details.map((detail) => <small key={detail}>{detail}</small>)}</div><b>{formatMoney(line.amount, history.priceBreakdown?.currency)}</b></div>)}{history.priceBreakdown.total != null ? <div className="price-total"><strong>{history.priceBreakdown.totalLabel || "Estimated total"}</strong><b>{formatMoney(history.priceBreakdown.total, history.priceBreakdown.currency)}</b></div> : history.priceBreakdown.totalWithheldReason ? <p>{history.priceBreakdown.totalWithheldReason}</p> : null}{history.priceBreakdown.whatMayVary && <small>{history.priceBreakdown.whatMayVary}</small>}{history.bookingStatus?.guestLabel && <p className="booking-label">{history.bookingStatus.guestLabel}</p>}</section>}
        {history.guestNotes?.length ? <section className="itinerary-detail-card guest-notes"><small>GOOD TO KNOW</small><ul>{history.guestNotes.map((note) => <li key={note}>{note}</li>)}</ul></section> : null}
        <div className="itinerary-regeneration"><input value={regenerationInstruction} onChange={(event) => setRegenerationInstruction(event.target.value)} placeholder="How should we change the plan?" aria-label="Itinerary regeneration instruction" /><button type="button" className="match-link" onClick={() => void regeneratePlan()} disabled={regenerating}>{regenerating ? <><Loader2 className="spin" size={13} /> Refreshing…</> : <><RefreshCw size={13} /> Refresh full itinerary</>}</button></div>
        <div className="day-tabs">{plans.map((plan, index) => <button type="button" key={`${plan.day}-${index}`} onClick={() => setDayIndex(index)} className={dayIndex === index ? "active" : ""}>Day {plan.day || index + 1}</button>)}</div>
        {activeDay && <><h2>Day {activeDay.day || dayIndex + 1}{activeDay.dayType === "transfer" ? " · Transfer day" : ""}</h2><button type="button" className="match-link" onClick={() => void regeneratePlan(activeDay.day || dayIndex + 1)} disabled={regenerating}>{regenerating ? <><Loader2 className="spin" size={13} /> Refreshing day…</> : <><RefreshCw size={13} /> Change this day</>}</button><div className="timeline">{activeDay.activities.map((activity, index) => <ActivityCard activity={activity} city={city} key={`${activity.activityName}-${activity.activityTime}-${index}`} />)}</div></>}
      </div>
    </section><FooterSection /></main>;
}
