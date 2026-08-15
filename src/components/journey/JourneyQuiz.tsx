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
import {
  archetypeQuestionKeys,
  getQuizQuestions,
  getWellnessArchetype,
  isWellnessArchetypeId,
  QuizOption,
  travelPeriodOptions,
  wellnessArchetypes,
} from "@/lib/wellness-archetypes";

type Answer = string | string[];
const optionIcons = [Sparkles, Droplets, CircleGauge, Star, User, MapPin];
const draftKey = "velari-journey-draft";
const draftVersion = 4;
const restrictionChips = [
  { value: "no_hiking", label: "No hiking" },
  { value: "no_water_activities", label: "No water activities" },
  { value: "no_long_drives", label: "No long drives" },
  { value: "no_high_impact", label: "No high-impact exercise" },
];

function optionValue(option: QuizOption) {
  return typeof option === "string" ? option : option.value;
}

function optionLabel(option: QuizOption) {
  return typeof option === "string" ? option : option.label;
}

function optionDescription(option: QuizOption) {
  return typeof option === "string" ? undefined : option.description;
}

function answerLabel(question: { options?: QuizOption[] }, value: string) {
  return optionLabel(question.options?.find((option) => optionValue(option) === value) || value);
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
  const [validationError, setValidationError] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [intent, setIntent] = useState<PaymentIntentData | null>(null);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const questions = useMemo(() => getQuizQuestions(answers.selected_archetype), [answers.selected_archetype]);
  const totalQuestions = questions.length;
  const q = questions[step];

  useEffect(() => {
    const raw = localStorage.getItem(draftKey);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      if (draft.version !== draftVersion || !isWellnessArchetypeId(draft.answers?.selected_archetype)) {
        localStorage.removeItem(draftKey);
        return;
      }
      if (draft.answers) setAnswers(draft.answers);
      if (draft.budget) setBudget(draft.budget);
      if (Number.isInteger(draft.step)) {
        setStep(Math.min(draft.step, getQuizQuestions(draft.answers.selected_archetype).length - 1));
      }
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
    localStorage.setItem(draftKey, JSON.stringify({ version: draftVersion, answers, budget, step }));
  }, [answers, budget, step]);

  const selectAnswer = (value: string, answerKey = q.key, multiple = q.multiple, maxSelections = q.maxSelections) => {
    setValidationError("");
    setAnswers((current) => {
      if (answerKey === "selected_archetype") {
        const withoutPreviousBranch = Object.fromEntries(
          Object.entries(current).filter(([key]) => !archetypeQuestionKeys.has(key)),
        );
        return { ...withoutPreviousBranch, selected_archetype: value };
      }
      if (!multiple) {
        const nextAnswers = { ...current, [answerKey]: value };
        if (answerKey === "travel_timing" && value === "flexible") delete nextAnswers.travel_months;
        return nextAnswers;
      }
      const selected = Array.isArray(current[answerKey]) ? current[answerKey] as string[] : [];
      const noPreference = answerKey === "preferred_setting" && value === "no_preference";
      if (noPreference) return { ...current, [answerKey]: [] };
      const withoutNone = selected.filter((item) => item !== "no_preference");
      if (!withoutNone.includes(value) && maxSelections && withoutNone.length >= maxSelections) {
        setValidationError(`You can select up to ${maxSelections} options.`);
        return current;
      }
      return {
        ...current,
        [answerKey]: withoutNone.includes(value)
          ? withoutNone.filter((item) => item !== value)
          : [...withoutNone, value],
      };
    });
  };

  const isSelected = (value: string, answerKey = q.key) => {
    const answer = answers[answerKey];
    return Array.isArray(answer) ? answer.includes(value) : answer === value;
  };

  const validateStep = () => {
    if (q.kind === "range") return true;
    if (q.kind === "timing" && answers.travel_timing === "specific" && (!Array.isArray(answers.travel_months) || !answers.travel_months.length)) {
      setValidationError("Choose at least one month to continue.");
      return false;
    }
    if (q.key === "preferred_setting" && Array.isArray(answers.preferred_setting) && !answers.preferred_setting.length) return true;
    const value = answers[q.key];
    if (q.kind === "text" && q.required === false) return true;
    const valid = Array.isArray(value) ? value.length > 0 : Boolean(value?.trim());
    if (!valid) setValidationError(q.kind === "text" ? "Tell us a little about what you need from this trip." : "Choose an option to continue.");
    return valid;
  };

  const questionnaire = useMemo<QuestionnaireAnswers>(() => ({
    selected_archetype: isWellnessArchetypeId(answers.selected_archetype)
      ? answers.selected_archetype
      : "burned_out_achiever",
    break_from: String(answers.break_from || ""),
    arrival_priority: String(answers.arrival_priority || ""),
    retreat_structure: String(answers.retreat_structure || ""),
    reset_style: String(answers.reset_style || ""),
    physical_intensity: String(answers.physical_intensity || ""),
    travel_party: String(answers.travel_party || ""),
    spirituality: String(answers.spirituality || ""),
    travel_timing: String(answers.travel_timing || "") as "flexible" | "specific",
    travel_months: answers.travel_timing === "specific" && Array.isArray(answers.travel_months)
      ? answers.travel_months.map(Number).filter((month) => Number.isInteger(month) && month >= 1 && month <= 12)
      : undefined,
    party_details: answers.travel_party === "family"
      ? { adults: Number(answers.family_adults || 1), children: Number(answers.family_children || 0) }
      : answers.travel_party === "small_group"
        ? { party_size: Number(answers.group_size || 2) }
        : undefined,
    planning_service: String(answers.planning_service || ""),
    activity_restrictions: {
      text: String(answers.activity_restrictions || ""),
      codes: Array.isArray(answers.restriction_codes) ? answers.restriction_codes : [],
    },
    preferred_setting: Array.isArray(answers.preferred_setting) ? answers.preferred_setting : [],
    budget_per_night: budget,
    budget_open_ended: budget >= 7000,
    trip_length: String(answers.trip_length || ""),
    transform_focus: Array.isArray(answers.transform_focus) ? answers.transform_focus : [],
  }), [answers, budget]);

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
            answer: question.key === "selected_archetype"
              ? getWellnessArchetype(answers.selected_archetype)?.name || ""
              : question.key === "budget_per_night"
                ? `${formatApiPrice(budget)}${budget >= 7000 ? "+" : ""}`
                : question.key === "activity_restrictions"
                  ? String(answers[question.key] || "No limitations provided")
                  : question.key === "travel_timing" && answers.travel_timing === "specific"
                    ? `Specific: ${(Array.isArray(answers.travel_months) ? answers.travel_months : []).map((month) => answerLabel({ options: travelPeriodOptions }, month)).join(", ")}`
                    : Array.isArray(answers[question.key])
                      ? (answers[question.key] as string[]).map((value) => answerLabel(question, value)).join(", ")
                      : question.options
                        ? answerLabel(question, String(answers[question.key] || ""))
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
  }, [answers, budget, questionnaire, questions, session?.user?.email, session?.user?.name, token]);

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
    <div className="quiz-progress" aria-hidden="true"><span style={{ width: `${((step + 1) / totalQuestions) * 100}%` }} /></div>
    <section className="quiz-stage" key={step}>
      <div className="quiz-copy">
        <small>QUESTION {step + 1} of {totalQuestions}{q.multiple ? " · SELECT ALL THAT APPLY" : ""}</small>
        <h1>{q.title.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h1>
        {q.prompt && <p>{q.prompt}</p>}
        {q.kind === "archetypes" && <div className="archetype-grid">{wellnessArchetypes.map((archetype, i) => { const Icon = optionIcons[i % optionIcons.length]; return <button type="button" key={archetype.id} className={isSelected(archetype.id) ? "selected" : ""} aria-pressed={isSelected(archetype.id)} onClick={() => selectAnswer(archetype.id)}><span className="archetype-icon"><Icon size={18} /></span><span><strong>{archetype.name}</strong><small>{archetype.description}</small></span></button>; })}</div>}
        {(!q.kind || q.kind === "options") && <div className={`quiz-options ${q.options!.length > 7 ? "wide" : ""}`}>
          {q.options!.map((option, i) => { const Icon = optionIcons[i % optionIcons.length]; const value = optionValue(option); return <button type="button" key={value} className={isSelected(value) ? "selected" : ""} aria-pressed={isSelected(value)} onClick={() => selectAnswer(value)}><Icon size={14} />{optionLabel(option)}</button>; })}
        </div>}
        {q.kind === "cards" && <><div className="quiz-cards">{q.options!.map((option, i) => { const value = optionValue(option); const Icon = [User, Users, Users, Home, Thermometer, Droplets][i % 6]; return <button type="button" key={value} className={isSelected(value) ? "selected" : ""} aria-pressed={isSelected(value)} onClick={() => selectAnswer(value)}><Icon size={18} /><span><strong>{optionLabel(option)}</strong>{optionDescription(option) && <small>{optionDescription(option)}</small>}</span></button>; })}</div>
          {answers.travel_party === "family" && <div className="quiz-options party-counts"><label>Adults<Input type="number" min="1" value={String(answers.family_adults || 1)} onChange={(event) => setAnswers((current) => ({ ...current, family_adults: event.target.value }))} /></label><label>Children<Input type="number" min="0" value={String(answers.family_children || 0)} onChange={(event) => setAnswers((current) => ({ ...current, family_children: event.target.value }))} /></label></div>}
          {answers.travel_party === "small_group" && <div className="quiz-options party-counts"><label>Party size<Input type="number" min="2" value={String(answers.group_size || 2)} onChange={(event) => setAnswers((current) => ({ ...current, group_size: event.target.value }))} /></label></div>}</>}
        {q.kind === "timing" && <>
          <div className="quiz-options">
            {q.options!.map((option, i) => { const Icon = optionIcons[i % optionIcons.length]; const value = optionValue(option); return <button type="button" key={value} className={isSelected(value) ? "selected" : ""} aria-pressed={isSelected(value)} onClick={() => selectAnswer(value)}><Icon size={14} />{optionLabel(option)}</button>; })}
          </div>
          {answers.travel_timing === "specific" && <div className="quiz-options wide timing-periods">
            <small className="quiz-section-label">Choose one or more months</small>
            {travelPeriodOptions.map((option, i) => { const Icon = optionIcons[i % optionIcons.length]; const value = optionValue(option); return <button type="button" key={value} className={isSelected(value, "travel_months") ? "selected" : ""} aria-pressed={isSelected(value, "travel_months")} onClick={() => selectAnswer(value, "travel_months", true)}><Icon size={14} />{optionLabel(option)}</button>; })}
          </div>}
        </>}
        {q.kind === "range" && <div className="budget-field"><strong>{formatApiPrice(budget)}{budget >= 7000 ? "+" : ""}</strong><input aria-label="Budget per night" type="range" min="100" max="7000" step="100" value={budget} onChange={(event) => setBudget(Number(event.target.value))} /><div><span>$100</span><span>$7,000+</span></div><small>Maximum nightly budget in USD</small></div>}
        {q.kind === "text" && <><textarea aria-label="Activity limitations" placeholder="For example: no hiking, water activities, long drives, extreme heat, or high-impact exercise." value={String(answers[q.key] || "")} onChange={(event) => { setValidationError(""); setAnswers({ ...answers, [q.key]: event.target.value }); }} /><small className="quiz-section-label">Optional restriction tags</small><div className="quiz-options wide">{restrictionChips.map((chip) => <button type="button" key={chip.value} className={isSelected(chip.value, "restriction_codes") ? "selected" : ""} onClick={() => selectAnswer(chip.value, "restriction_codes", true)}>{chip.label}</button>)}</div><p className="quiz-help">We’ll check restrictions where property data allows; unverified restrictions may be shown as warnings.</p></>}
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
