"use client";

import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Compass,
  Home,
  Loader2,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  Users,
  X,
} from "lucide-react";
import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  ApiError,
  DateRecommendation,
  journeyApi,
  PaymentIntentData,
  Restriction,
  RestrictionSeverity,
  TravelDateRecommendations,
  VelariIntake,
} from "@/lib/journey-api";
import {
  getQuizQuestions,
  QuizOption,
  travelPeriodOptions,
} from "@/lib/wellness-archetypes";

type Answer = string | string[];
type LocationSuggestion = {
  id: string;
  label: string;
  mainText: string;
  secondaryText: string;
};

const optionIcons = [Sparkles, Compass, Star, User, MapPin, Home];
const draftKey = "velari-journey-draft";
const draftVersion = 6;

type DateRecommendationApiResponse = {
  recommended: Record<string, unknown>;
  alternatives?: Record<string, unknown>[];
  summary?: string;
  availabilityNote?: string;
  availability_note?: string;
  status?: string;
  window?: Record<string, unknown>;
};

function stringList(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function normalizeDateRecommendation(data: DateRecommendationApiResponse): TravelDateRecommendations {
  const option = (value: Record<string, unknown>): DateRecommendation => ({
    label: String(value.label || "Recommended dates"),
    checkIn: String(value.checkIn || value.check_in || ""),
    checkOut: String(value.checkOut || value.check_out || ""),
    weekdays: stringList(value.weekdays),
    nights: Number(value.nights || 0),
    reasons: stringList(value.reasons),
    considerations: stringList(value.considerations),
    checkInWeekday: typeof value.checkInWeekday === "string" ? value.checkInWeekday : typeof value.check_in_weekday === "string" ? value.check_in_weekday : undefined,
    checkOutWeekday: typeof value.checkOutWeekday === "string" ? value.checkOutWeekday : typeof value.check_out_weekday === "string" ? value.check_out_weekday : undefined,
    matchScore: typeof value.matchScore === "number" ? value.matchScore : typeof value.match_score === "number" ? value.match_score : undefined,
  });
  const window = data.window || {};
  return {
    recommended: option(data.recommended),
    alternatives: (data.alternatives || []).slice(0, 2).map(option),
    summary: data.summary || "Here are the dates that best fit your trip preferences.",
    availabilityNote: data.availabilityNote || data.availability_note || "These dates are suggestions only; live availability and prices have not been checked.",
    status: data.status,
    window: {
      earliestCheckIn: typeof window.earliestCheckIn === "string" ? window.earliestCheckIn : typeof window.earliest_check_in === "string" ? window.earliest_check_in : undefined,
      latestCheckOut: typeof window.latestCheckOut === "string" ? window.latestCheckOut : typeof window.latest_check_out === "string" ? window.latest_check_out : undefined,
      note: typeof window.note === "string" ? window.note : undefined,
    },
  };
}

function answerLabel(question: { options?: QuizOption[] }, value: string) {
  return (
    question.options?.find((option) => option.value === value)?.label || value
  );
}

function formatApiPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getNightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return null;

  return Math.round(
    (new Date(`${checkOut}T00:00:00`).getTime() -
      new Date(`${checkIn}T00:00:00`).getTime()) /
      86400000,
  );
}

function PaymentForm({
  intent,
  name,
  email,
  onClose,
}: {
  intent: PaymentIntentData;
  name?: string | null;
  email?: string | null;
  onClose: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [cardholderName, setCardholderName] = useState(name || "");
  const [country, setCountry] = useState("BD");
  const [postalCode, setPostalCode] = useState("");
  const cardStyle = {
    base: {
      color: "#24231f",
      fontSize: "15px",
      fontFamily: "Arial, sans-serif",
      lineHeight: "20px",
      "::placeholder": { color: "#8c8982" },
    },
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
    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(intent.clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: cardholderName.trim() || name || undefined,
            email: email || undefined,
            address: { country, postal_code: postalCode.trim() || undefined },
          },
        },
        return_url: `${window.location.origin}/results`,
      });
    if (stripeError) {
      setError(stripeError.message || "Your payment could not be completed.");
      setProcessing(false);
      return;
    }
    if (paymentIntent?.status === "succeeded") {
      sessionStorage.setItem("velari-last-payment", intent.paymentIntentId);
      router.push(
        `/results?payment_intent=${encodeURIComponent(intent.paymentIntentId)}`,
      );
    } else {
      setError("Your payment is still processing. Please wait a moment and try again.");
      setProcessing(false);
    }
  };

  return (
    <form className="payment-card" onSubmit={pay}>
      <button
        className="payment-close"
        type="button"
        onClick={onClose}
        disabled={processing}
        aria-label="Close payment"
      >
        ×
      </button>
      <h2>Payment</h2>
      <p className="payment-intro">
        Complete your card payment to create your personalized journey.
      </p>
      <label>
        Card Number
        <div className="stripe-card-field">
          <CardNumberElement options={{ showIcon: true, style: cardStyle }} />
        </div>
      </label>
      <div className="payment-row">
        <label>
          Expiry Date
          <div className="stripe-card-field">
            <CardExpiryElement options={{ style: cardStyle }} />
          </div>
        </label>
        <label>
          CVV
          <div className="stripe-card-field">
            <CardCvcElement options={{ style: cardStyle }} />
          </div>
        </label>
      </div>
      <label>
        Name on Card
        <Input
          className="payment-input"
          required
          autoComplete="cc-name"
          value={cardholderName}
          onChange={(event) => setCardholderName(event.target.value)}
          placeholder="John Doe"
        />
      </label>
      <div className="payment-row">
        <div className="payment-field">
          <Label>Country</Label>
          <Select
            value={country}
            onValueChange={(value) => value && setCountry(value)}
          >
            <SelectTrigger
              className="payment-country-trigger"
              aria-label="Country"
            >
              <SelectValue>
                {countries.find((item) => item.code === country)?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start" className="payment-country-content">
              {countries.map((item) => (
                <SelectItem
                  className="payment-country-item"
                  key={item.code}
                  value={item.code}
                >
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <label>
          ZIP Code
          <Input
            className="payment-input"
            required
            autoComplete="postal-code"
            inputMode="numeric"
            value={postalCode}
            onChange={(event) => setPostalCode(event.target.value)}
            placeholder="1234"
          />
        </label>
      </div>
      <div className="save-payment">
        <Checkbox
          id="save-payment-details"
          className="payment-checkbox"
          defaultChecked
        />
        <Label htmlFor="save-payment-details">
          Save payment details for future purchases
        </Label>
      </div>
      {error && (
        <div className="payment-error" role="alert">
          <AlertCircle size={15} />
          {error}
        </div>
      )}
      <div className="payment-total">
        <strong>Total Amount</strong>
        <strong>{formatApiPrice(intent.amount)}</strong>
      </div>
      <button className="payment-submit" disabled={!stripe || processing}>
        {processing ? (
          <>
            <Loader2 className="spin" size={16} /> Processing securely…
          </>
        ) : (
          <>
            Pay &amp; create my journey <ArrowRight size={14} />
          </>
        )}
      </button>
      <small className="payment-secure">
        <ShieldCheck size={13} /> Secure payment powered by Stripe
      </small>
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
  const [paymentErrorSources, setPaymentErrorSources] = useState<string[]>([]);
  const [intent, setIntent] = useState<PaymentIntentData | null>(null);
  const [dateRecommendations, setDateRecommendations] = useState<TravelDateRecommendations | null>(null);
  const [selectedRecommendedDate, setSelectedRecommendedDate] = useState<DateRecommendation | null>(null);
  const [dateRecommendationLoading, setDateRecommendationLoading] = useState(false);
  const [dateRecommendationError, setDateRecommendationError] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationSearchEnabled, setLocationSearchEnabled] = useState(false);
  const [activeLocationIndex, setActiveLocationIndex] = useState(-1);
  const locationFieldRef = useRef<HTMLDivElement>(null);
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);
  const questions = useMemo(() => getQuizQuestions(), []);
  const totalQuestions = questions.length;
  const q = questions[step];

  useEffect(() => {
    const raw = localStorage.getItem(draftKey);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      if (
        draft.version !== draftVersion ||
        !draft.answers ||
        typeof draft.answers !== "object"
      ) {
        localStorage.removeItem(draftKey);
        return;
      }
      setAnswers(draft.answers);
      if (Number.isFinite(draft.budget)) setBudget(draft.budget);
      if (Number.isInteger(draft.step))
        setStep(Math.min(Math.max(draft.step, 0), totalQuestions - 1));
    } catch {
      localStorage.removeItem(draftKey);
    }
  }, [totalQuestions]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=%2Fjourney");
    }
  }, [router, status]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!locationFieldRef.current?.contains(event.target as Node)) {
        setLocationOpen(false);
        setActiveLocationIndex(-1);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!locationSearchEnabled) return;

    const query = String(answers.departure_location || "").trim();
    if (query.length < 2) {
      setLocationSuggestions([]);
      setLocationError("");
      setLocationLoading(false);
      setLocationOpen(false);
      setActiveLocationIndex(-1);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLocationLoading(true);
      setLocationError("");
      setLocationOpen(true);

      try {
        const response = await fetch(
          `/api/location-autocomplete?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );
        const result = (await response.json().catch(() => null)) as {
          suggestions?: LocationSuggestion[];
          error?: string;
        } | null;

        if (!response.ok) {
          throw new Error(result?.error || "Unable to load locations.");
        }

        setLocationSuggestions(result?.suggestions || []);
        setActiveLocationIndex(-1);
      } catch (error) {
        if (controller.signal.aborted) return;
        setLocationSuggestions([]);
        setLocationError(
          error instanceof Error
            ? error.message
            : "Unable to load locations. Please try again.",
        );
      } finally {
        if (!controller.signal.aborted) setLocationLoading(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [answers.departure_location, locationSearchEnabled]);

  const saveDraft = useCallback(() => {
    localStorage.setItem(
      draftKey,
      JSON.stringify({ version: draftVersion, answers, budget, step }),
    );
  }, [answers, budget, step]);

  const selectedValues = useCallback(
    (key: string) =>
      Array.isArray(answers[key]) ? (answers[key] as string[]) : [],
    [answers],
  );

  const selectAnswer = (
    value: string,
    answerKey = q.key,
    multiple = q.multiple,
    maxSelections = q.maxSelections,
  ) => {
    setValidationError("");
    setAnswers((current) => {
      if (!multiple) {
        const next = { ...current, [answerKey]: value };
        if (answerKey === "travel_party") {
          const defaults =
            value === "solo"
              ? { party_adults: "1", party_children: "0", party_rooms: "1" }
              : {
                  party_adults:
                    value === "couple"
                      ? "2"
                      : String(current.party_adults || 2),
                  party_children: String(current.party_children || 0),
                  party_rooms: String(current.party_rooms || 1),
                };
          return { ...next, ...defaults };
        }
        return next;
      }

      const selected = Array.isArray(current[answerKey])
        ? (current[answerKey] as string[])
        : [];
      if (answerKey === "preferred_environments") {
        if (value === "surprise_me")
          return {
            ...current,
            [answerKey]: selected.includes(value) ? [] : [value],
          };
      }
      const withoutExclusive =
        answerKey === "preferred_environments"
          ? selected.filter((item) => item !== "surprise_me")
          : selected;
      if (
        !withoutExclusive.includes(value) &&
        maxSelections &&
        withoutExclusive.length >= maxSelections
      ) {
        setValidationError(`You can select up to ${maxSelections} options.`);
        return current;
      }
      const nextValues = withoutExclusive.includes(value)
        ? withoutExclusive.filter((item) => item !== value)
        : [...withoutExclusive, value];
      const next = {
        ...current,
        [answerKey]: nextValues,
      };
      if (answerKey === "activity_restrictions" && !nextValues.includes(value)) {
        delete next[`restriction_severity_${value}`];
      }
      return next;
    });
  };

  const setTextAnswer = (key: string, value: string) => {
    setValidationError("");
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  const selectLocation = (suggestion: LocationSuggestion) => {
    setTextAnswer("departure_location", suggestion.label);
    setLocationSearchEnabled(false);
    setLocationSuggestions([]);
    setLocationError("");
    setLocationOpen(false);
    setActiveLocationIndex(-1);
  };

  const clearLocation = () => {
    setTextAnswer("departure_location", "");
    setLocationSearchEnabled(false);
    setLocationSuggestions([]);
    setLocationLoading(false);
    setLocationError("");
    setLocationOpen(false);
    setActiveLocationIndex(-1);
  };

  const handleLocationKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setLocationOpen(false);
      setActiveLocationIndex(-1);
      return;
    }

    if (!locationOpen || !locationSuggestions.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveLocationIndex((current) =>
        current >= locationSuggestions.length - 1 ? 0 : current + 1,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveLocationIndex((current) =>
        current <= 0 ? locationSuggestions.length - 1 : current - 1,
      );
    } else if (event.key === "Enter" && activeLocationIndex >= 0) {
      event.preventDefault();
      selectLocation(locationSuggestions[activeLocationIndex]);
    }
  };

  const isSelected = (value: string, answerKey = q.key) => {
    const answer = answers[answerKey];
    return Array.isArray(answer) ? answer.includes(value) : answer === value;
  };

  const updateDate = (
    key: "check_in_date" | "check_out_date",
    value: string,
  ) => {
    setValidationError("");
    setAnswers((current) => {
      const next = { ...current, [key]: value };
      const checkIn = String(next.check_in_date || "");
      const checkOut = String(next.check_out_date || "");
      const nights = getNightsBetween(checkIn, checkOut);

      if (nights && nights > 0) {
        if (next.travel_timing === "exact_dates") {
          next.trip_nights = String(nights);
        } else if (next.travel_timing === "flexible") {
          const selectedNights = Number(next.trip_nights);
          next.trip_nights = String(
            Math.min(Math.max(1, selectedNights || 1), nights),
          );
        }
      }
      return next;
    });
  };

  const validateStep = () => {
    if (q.kind === "range") return true;

    if (q.kind === "restrictions") {
      const restrictions = selectedValues("activity_restrictions");
      if (
        restrictions.includes("other") &&
        !String(answers.restriction_notes || "").trim()
      ) {
        setValidationError("Tell us what else we should plan around.");
        return false;
      }
      const missingSeverity = restrictions.some(
        (item) => !answers[`restriction_severity_${item}`],
      );
      if (missingSeverity) {
        setValidationError(
          "Choose how important each selected restriction is.",
        );
        return false;
      }
      return true;
    }

    if (q.kind === "party") {
      if (!answers.travel_party) {
        setValidationError("Choose who is traveling.");
        return false;
      }
      if (answers.travel_party === "solo") return true;

      const adults = Number(answers.party_adults);
      const children = Number(answers.party_children);
      const rooms = Number(answers.party_rooms);
      if (
        !Number.isInteger(adults) ||
        adults < 1 ||
        !Number.isInteger(children) ||
        children < 0 ||
        !Number.isInteger(rooms) ||
        rooms < 1
      ) {
        setValidationError(
          "Enter a valid number of adults, children and rooms.",
        );
        return false;
      }
      if (rooms > adults + children) {
        setValidationError("Room count cannot exceed the total number of travelers.");
        return false;
      }
      const childAges = Array.from({ length: children }, (_, index) =>
        Number(answers[`party_child_age_${index}`]),
      );
      if (children > 0 && childAges.some((age) => !Number.isInteger(age) || age < 0 || age > 17)) {
        setValidationError("Enter an age from 0 to 17 for every child.");
        return false;
      }
      return true;
    }

    if (q.kind === "departure") {
      if (
        !String(answers.departure_location || "").trim() ||
        !answers.travel_distance
      ) {
        setValidationError(
          "Enter your departure city or airport and choose a travel range.",
        );
        return false;
      }
      return true;
    }

    if (q.kind === "timing") {
      const nights = Number(answers.trip_nights);
      if (!answers.travel_timing) {
        setValidationError("Choose the timing you know today.");
        return false;
      }
      const usesDateRange =
        answers.travel_timing === "exact_dates" ||
        answers.travel_timing === "flexible";
      if (usesDateRange) {
        const checkIn = String(answers.check_in_date || "");
        const checkOut = String(answers.check_out_date || "");
        if (!checkIn || !checkOut) {
          setValidationError("Choose both check-in and check-out dates.");
          return false;
        }
        if (new Date(checkOut) <= new Date(checkIn)) {
          setValidationError("Check-out must be after check-in.");
          return false;
        }
        const today = new Date().toISOString().slice(0, 10);
        if (checkIn < today) {
          setValidationError("Check-in cannot be in the past.");
          return false;
        }
        const expectedNights = getNightsBetween(checkIn, checkOut);
        if (answers.travel_timing === "exact_dates" && nights !== expectedNights) {
          setValidationError("Number of nights must match the selected dates.");
          return false;
        }
        if (
          answers.travel_timing === "flexible" &&
          expectedNights !== null &&
          nights > expectedNights
        ) {
          setValidationError(
            "Number of nights cannot be longer than your selected date range.",
          );
          return false;
        }
      }
      if (answers.travel_timing === "month_season" && !answers.travel_period) {
        setValidationError("Choose a month or season.");
        return false;
      }
      if (!Number.isInteger(nights) || nights < 1) {
        setValidationError("Enter the number of nights.");
        return false;
      }
      return true;
    }

    const value = answers[q.key];
    const valid = Array.isArray(value)
      ? value.length > 0
      : Boolean(String(value || "").trim());
    if (!valid) {
      setValidationError("Choose an option to continue.");
      return false;
    }
    if (
      q.otherOption &&
      (Array.isArray(value)
        ? value.includes(q.otherOption)
        : value === q.otherOption)
    ) {
      if (!String(answers[`${q.key}_other`] || "").trim()) {
        setValidationError("Tell us a little more.");
        return false;
      }
    }
    return true;
  };

  const intake = useMemo<VelariIntake>(() => {
    const travelParty = String(answers.travel_party) as VelariIntake["travel_party"];
    const isSolo = travelParty === "solo";
    const adults = isSolo ? 1 : Math.max(1, Number(answers.party_adults) || 1);
    const children = isSolo ? 0 : Math.max(0, Number(answers.party_children) || 0);
    const rooms = isSolo ? 1 : Math.max(1, Number(answers.party_rooms) || 1);
    const restrictions = selectedValues("activity_restrictions") as Restriction[];
    const restrictionSeverity = restrictions.reduce<Partial<Record<Restriction, RestrictionSeverity>>>(
      (result, restriction) => {
        const severity = answers[`restriction_severity_${restriction}`];
        if (severity === "must_avoid" || severity === "prefer_avoid") result[restriction] = severity;
        return result;
      },
      {},
    );
    const recentFeelings = selectedValues("recent_feelings") as VelariIntake["recent_feelings"];
    const tripPrompt = String(answers.trip_prompt) as VelariIntake["trip_prompt"];
    const timing = String(answers.travel_timing) as VelariIntake["travel_timing"];
    const notes = String(answers.restriction_notes || "").trim();
    const childAges = Array.from({ length: children }, (_, index) => Number(answers[`party_child_age_${index}`]));

    return {
      recent_feelings: recentFeelings,
      ...(recentFeelings.includes("something_else") ? { recent_feelings_other: String(answers.recent_feelings_other || "").trim() } : {}),
      trip_goals: selectedValues("trip_goals") as VelariIntake["trip_goals"],
      trip_prompt: tripPrompt,
      ...(tripPrompt === "something_else" ? { trip_prompt_other: String(answers.trip_prompt_other || "").trim() } : {}),
      preferred_moments: selectedValues("preferred_moments") as VelariIntake["preferred_moments"],
      preferred_environments: selectedValues("preferred_environments") as VelariIntake["preferred_environments"],
      trip_pace: String(answers.trip_pace) as VelariIntake["trip_pace"],
      travel_party: travelParty,
      party_adults: adults,
      party_children: children,
      party_rooms: rooms,
      ...(children > 0 ? { party_child_ages: childAges } : {}),
      ...(restrictions.length ? { activity_restrictions: restrictions, restriction_severity: restrictionSeverity } : {}),
      ...(notes ? { restriction_notes: notes } : {}),
      departure_location: String(answers.departure_location || "").trim(),
      travel_distance: String(answers.travel_distance) as VelariIntake["travel_distance"],
      travel_timing: timing,
      ...(timing === "exact_dates" || timing === "flexible" ? {
        check_in_date: String(answers.check_in_date || ""),
        check_out_date: String(answers.check_out_date || ""),
      } : {}),
      ...(timing === "month_season" ? { travel_period: String(answers.travel_period || "") as NonNullable<VelariIntake["travel_period"]> } : {}),
      trip_nights: Math.max(1, Number(answers.trip_nights) || 1),
      budget_per_night: budget,
      currency: "USD",
    };
  }, [answers, budget, selectedValues]);

  const applyRecommendedDates = (option: DateRecommendation) => {
    setSelectedRecommendedDate(option);
    setAnswers((current) => ({
      ...current,
      travel_timing: "exact_dates",
      check_in_date: option.checkIn,
      check_out_date: option.checkOut,
      trip_nights: String(option.nights),
    }));
    setValidationError("");
  };

  const recommendTravelDates = async () => {
    if (answers.travel_timing !== "flexible" || !validateStep()) return;
    if (!token) { setDateRecommendationError("Your session has expired. Please sign in again."); return; }
    const intakePayload = Object.fromEntries(Object.entries(intake).filter(([key]) => !["budget_per_night", "check_in_date", "check_out_date", "currency"].includes(key)));
    setDateRecommendationLoading(true); setDateRecommendationError(""); setDateRecommendations(null); setSelectedRecommendedDate(null);
    try {
      const data = await journeyApi<DateRecommendationApiResponse>("/history/recommend-travel-dates", token, {
        method: "POST",
        body: JSON.stringify({
          ...intakePayload,
          earliest_check_in: intake.check_in_date,
          latest_check_out: intake.check_out_date,
        }),
      });
      setDateRecommendations(normalizeDateRecommendation(data));
    } catch (caught) {
      setDateRecommendationError(caught instanceof Error ? caught.message : "Unable to recommend travel dates. Please try again.");
    } finally { setDateRecommendationLoading(false); }
  };

  const initializePayment = useCallback(async () => {
    if (!token) {
      setPaymentError(
        "Your session has expired. Sign in again to continue securely.",
      );
      setPaymentLoading(false);
      return;
    }
    setPaymentLoading(true);
    setPaymentError("");
    setPaymentErrorSources([]);
    setIntent(null);
    try {
      const price = await journeyApi<{ price: number }>("/price");
      const amount = Number(price?.price);
      if (!Number.isFinite(amount) || amount < 0.5)
        throw new Error("The journey price is currently unavailable.");
      const data = await journeyApi<PaymentIntentData>("/payments", token, {
        method: "POST",
        body: JSON.stringify({
          amount,
          currency: "usd",
          intake,
        }),
      });
      setIntent(data);
      setStripePromise(loadStripe(data.publishableKey));
    } catch (error) {
      if (error instanceof ApiError) {
        setPaymentError(error.message);
        setPaymentErrorSources(
          error.errorSources.map((source) =>
            `${String(source.path).replace(/^intake\./, "")}: ${source.message}`,
          ),
        );
      } else {
        setPaymentError(error instanceof Error ? error.message : "Unable to prepare payment.");
      }
    } finally {
      setPaymentLoading(false);
    }
  }, [
    intake,
    token,
  ]);

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

  return (
    <main className="quiz-page">
      <header className="quiz-header">
        <button
          onClick={() =>
            step ? setStep((current) => current - 1) : router.push("/")
          }
        >
          <ArrowLeft size={15} /> Back
        </button>
        <Image
          src="/images/logo.png"
          alt="Velari™"
          width={125}
          height={44}
          priority
        />
        <button onClick={saveAndExit}>Save &amp; Exit</button>
      </header>
      <div className="quiz-progress" aria-hidden="true">
        <span style={{ width: `${((step + 1) / totalQuestions) * 100}%` }} />
      </div>
      <section className="quiz-stage" key={step}>
        <div
          className={`quiz-copy ${q.kind === "departure" ? "departure-step" : ""}`}
        >
          <small>
            QUESTION {step + 1} OF {totalQuestions}
          </small>
          <h1>
            {q.title.split("\n").map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </h1>
          <p className="quiz-prompt">{q.prompt}</p>

          {(!q.kind || q.kind === "options") && (
            <div
              className={`quiz-options ${(q.options?.length || 0) > 7 ? "wide" : ""}`}
            >
              {q.options?.map((option, i) => {
                const Icon = optionIcons[i % optionIcons.length];
                return (
                  <button
                    type="button"
                    key={option.value}
                    className={isSelected(option.value) ? "selected" : ""}
                    aria-pressed={isSelected(option.value)}
                    onClick={() => selectAnswer(option.value)}
                  >
                    <Icon size={14} />
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}

          {q.kind === "cards" && (
            <div className="quiz-cards goal-cards">
              {q.options?.map((option, i) => {
                const Icon = optionIcons[i % optionIcons.length];
                return (
                  <button
                    type="button"
                    key={option.value}
                    className={isSelected(option.value) ? "selected" : ""}
                    aria-pressed={isSelected(option.value)}
                    onClick={() => selectAnswer(option.value)}
                  >
                    <Icon size={18} />
                    <span>
                      <strong>{option.label}</strong>
                      <small>{option.description}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {q.otherOption && isSelected(q.otherOption) && (
            <Input
              className="quiz-text-input other-answer"
              value={String(answers[`${q.key}_other`] || "")}
              onChange={(event) =>
                setTextAnswer(`${q.key}_other`, event.target.value)
              }
              placeholder="Tell us in your own words"
              autoFocus
            />
          )}

          {q.kind === "party" && (
            <>
              <div className="quiz-cards party-cards">
                {q.options?.map((option, i) => {
                  const Icon = i === 0 ? User : Users;
                  return (
                    <button
                      type="button"
                      key={option.value}
                      className={isSelected(option.value) ? "selected" : ""}
                      aria-pressed={isSelected(option.value)}
                      onClick={() => selectAnswer(option.value)}
                    >
                      <Icon size={18} />
                      <span>
                        <strong>{option.label}</strong>
                      </span>
                    </button>
                  );
                })}
              </div>
              {answers.travel_party && answers.travel_party !== "solo" && (
                <div className="conditional-panel party-panel">
                  <strong>How many people and rooms?</strong>
                  <div className="party-counts">
                    <label>
                      Adults
                        <Input
                          type="number"
                          min="1"
                          max="30"
                        inputMode="numeric"
                        value={String(answers.party_adults || 1)}
                        onChange={(event) =>
                          setTextAnswer("party_adults", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      Children
                        <Input
                          type="number"
                          min="0"
                          max="20"
                        inputMode="numeric"
                        value={String(answers.party_children || 0)}
                        onChange={(event) =>
                          setTextAnswer("party_children", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      Rooms
                        <Input
                          type="number"
                          min="1"
                          max="20"
                        inputMode="numeric"
                        value={String(answers.party_rooms || 1)}
                        onChange={(event) =>
                          setTextAnswer("party_rooms", event.target.value)
                        }
                      />
                    </label>
                  </div>
                  {Number(answers.party_children) > 0 && (
                    <div className="party-child-ages">
                      <strong>Children&apos;s ages</strong>
                      {Array.from({ length: Number(answers.party_children) }, (_, index) => (
                        <label key={index}>
                          Child {index + 1}
                          <Input
                            type="number"
                            min="0"
                            max="17"
                            inputMode="numeric"
                            value={String(answers[`party_child_age_${index}`] || "")}
                            onChange={(event) => setTextAnswer(`party_child_age_${index}`, event.target.value)}
                          />
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {q.kind === "restrictions" && (
            <>
              <div className="quiz-options wide">
                {q.options?.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    className={isSelected(option.value) ? "selected" : ""}
                    aria-pressed={isSelected(option.value)}
                    onClick={() => selectAnswer(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {selectedValues("activity_restrictions").length > 0 && (
                <div className="restriction-details">
                  {selectedValues("activity_restrictions").map((value) => (
                    <div className="restriction-row" key={value}>
                      <span>{answerLabel(q, value)}</span>
                      <div>
                        <button
                          type="button"
                          className={
                            answers[`restriction_severity_${value}`] ===
                            "must_avoid"
                              ? "selected"
                              : ""
                          }
                          onClick={() =>
                            setTextAnswer(
                              `restriction_severity_${value}`,
                              "must_avoid",
                            )
                          }
                        >
                          I must avoid this
                        </button>
                        <button
                          type="button"
                          className={
                            answers[`restriction_severity_${value}`] ===
                            "prefer_avoid"
                              ? "selected"
                              : ""
                          }
                          onClick={() =>
                            setTextAnswer(
                              `restriction_severity_${value}`,
                              "prefer_avoid",
                            )
                          }
                        >
                          I’d prefer to avoid this
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <textarea
                className="restriction-notes"
                aria-label="Other planning needs"
                placeholder="Anything else we should know? (optional)"
                value={String(answers.restriction_notes || "")}
                onChange={(event) =>
                  setTextAnswer("restriction_notes", event.target.value)
                }
              />
            </>
          )}

          {q.kind === "departure" && (
            <>
              <div className="departure-field" ref={locationFieldRef}>
                <Input
                  className="quiz-text-input"
                  aria-label="Departure city or airport"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={locationOpen}
                  aria-controls="departure-location-suggestions"
                  aria-activedescendant={
                    activeLocationIndex >= 0
                      ? `departure-location-${activeLocationIndex}`
                      : undefined
                  }
                  value={String(answers.departure_location || "")}
                  onChange={(event) => {
                    setLocationSearchEnabled(true);
                    setLocationSuggestions([]);
                    setLocationError("");
                    setActiveLocationIndex(-1);
                    setTextAnswer("departure_location", event.target.value);
                  }}
                  onFocus={() => {
                    if (
                      locationSearchEnabled &&
                      String(answers.departure_location || "").trim().length >=
                        2
                    ) {
                      setLocationOpen(true);
                    }
                  }}
                  onKeyDown={handleLocationKeyDown}
                  placeholder="Search your city or departure airport"
                  autoComplete="off"
                />
                {String(answers.departure_location || "") && (
                  <button
                    type="button"
                    className="location-clear"
                    aria-label="Clear departure location"
                    onClick={clearLocation}
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                )}
                {locationLoading && (
                  <Loader2
                    className="location-loading spin"
                    size={18}
                    aria-label="Loading location suggestions"
                  />
                )}
                {locationOpen && (
                  <div
                    className="location-suggestions"
                    id="departure-location-suggestions"
                    role="listbox"
                    aria-label="Location suggestions"
                  >
                    {locationLoading && !locationSuggestions.length ? (
                      <div className="location-message" role="status">
                        Searching locations…
                      </div>
                    ) : locationError ? (
                      <div className="location-message error" role="alert">
                        {locationError}
                      </div>
                    ) : locationSuggestions.length ? (
                      locationSuggestions.map((suggestion, index) => (
                        <button
                          type="button"
                          id={`departure-location-${index}`}
                          key={suggestion.id}
                          className={
                            index === activeLocationIndex ? "active" : ""
                          }
                          role="option"
                          aria-selected={index === activeLocationIndex}
                          onMouseDown={(event) => event.preventDefault()}
                          onMouseEnter={() => setActiveLocationIndex(index)}
                          onClick={() => selectLocation(suggestion)}
                        >
                          <MapPin size={16} aria-hidden="true" />
                          <span>
                            <strong>{suggestion.mainText}</strong>
                            {suggestion.secondaryText && (
                              <small>{suggestion.secondaryText}</small>
                            )}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="location-message" role="status">
                        No matching locations found.
                      </div>
                    )}
                    <div className="location-attribution">
                      Powered by Google
                    </div>
                  </div>
                )}
              </div>
              <div className="quiz-options departure-options">
                {q.options?.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    className={
                      isSelected(option.value, "travel_distance")
                        ? "selected"
                        : ""
                    }
                    aria-pressed={isSelected(option.value, "travel_distance")}
                    onClick={() =>
                      selectAnswer(option.value, "travel_distance", false)
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {q.kind === "timing" && (
            <>
              <div className="quiz-options timing-choices">
                {q.options?.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    className={isSelected(option.value) ? "selected" : ""}
                    aria-pressed={isSelected(option.value)}
                    onClick={() => selectAnswer(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {answers.travel_timing && (
                <div className="conditional-panel timing-panel">
                  {(answers.travel_timing === "exact_dates" ||
                    answers.travel_timing === "flexible") && (
                    <div className="date-grid">
                      <label>
                        {answers.travel_timing === "flexible" ? "Earliest check-in" : "Check-in"}
                        <Input
                          type="date"
                          min={new Date().toISOString().slice(0, 10)}
                          value={String(answers.check_in_date || "")}
                          onChange={(event) =>
                            updateDate("check_in_date", event.target.value)
                          }
                        />
                      </label>
                      <label>
                        {answers.travel_timing === "flexible" ? "Latest check-out" : "Check-out"}
                        <Input
                          type="date"
                          min={String(answers.check_in_date || "")}
                          value={String(answers.check_out_date || "")}
                          onChange={(event) =>
                            updateDate("check_out_date", event.target.value)
                          }
                        />
                      </label>
                    </div>
                  )}
                  {answers.travel_timing === "month_season" && (
                    <label className="period-field">
                      Month or season
                      <select
                        value={String(answers.travel_period || "")}
                        onChange={(event) =>
                          setTextAnswer("travel_period", event.target.value)
                        }
                      >
                        <option value="">Select one</option>
                        {travelPeriodOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <label className="nights-field">
                    {answers.travel_timing === "flexible" ? "Trip nights" : "Number of nights"}
                    <Input
                      type="number"
                      min="1"
                      max={
                        answers.travel_timing === "flexible"
                          ? String(
                              Math.max(
                                1,
                                getNightsBetween(
                                  String(answers.check_in_date || ""),
                                  String(answers.check_out_date || ""),
                                ) || 1,
                              ),
                            )
                          : undefined
                      }
                      inputMode="numeric"
                      value={String(answers.trip_nights || "")}
                      onChange={(event) =>
                        setTextAnswer("trip_nights", event.target.value)
                      }
                      placeholder="5"
                    />
                  </label>
                  {answers.travel_timing === "flexible" && (
                    <button
                      type="button"
                      className="recommend-dates-button"
                      onClick={() => void recommendTravelDates()}
                      disabled={dateRecommendationLoading}
                    >
                      {dateRecommendationLoading ? <><Loader2 className="spin" size={15} /> Finding dates…</> : <><Sparkles size={15} /> Recommend dates</>}
                    </button>
                  )}
                </div>
              )}
              {(dateRecommendations || dateRecommendationError) && (
                <section className="date-recommendations-panel" aria-live="polite">
                  <div className="date-recommendations-heading"><div><small>PERSONALIZED DATE OPTIONS</small><h2>Dates that fit your trip</h2></div>{dateRecommendations?.status && <span>{dateRecommendations.status.replaceAll("_", " ")}</span>}</div>
                  {dateRecommendationError ? <div className="date-recommendation-error"><p>{dateRecommendationError}</p><button type="button" onClick={() => void recommendTravelDates()}>Try again</button></div> : dateRecommendations && <><p className="date-recommendations-summary">{dateRecommendations.summary}</p>{dateRecommendations.window?.note && <p className="date-window-note">{dateRecommendations.window.note}</p>}<div className="date-recommendation-options">{[dateRecommendations.recommended, ...dateRecommendations.alternatives].map((option) => <article key={`${option.checkIn}-${option.checkOut}`} className={selectedRecommendedDate?.checkIn === option.checkIn ? "selected" : ""}><button type="button" className="date-option-choice" onClick={() => applyRecommendedDates(option)}><div><strong>{option.label}</strong>{option.matchScore != null && <span>{option.matchScore}% match</span>}</div><b>{option.checkInWeekday ? `${option.checkInWeekday}, ` : ""}{option.checkIn} → {option.checkOutWeekday ? `${option.checkOutWeekday}, ` : ""}{option.checkOut}</b><small>{option.nights} night{option.nights === 1 ? "" : "s"}</small>{selectedRecommendedDate?.checkIn === option.checkIn && <em>Selected — dates added above</em>}</button>{(option.reasons.length > 0 || option.considerations.length > 0) && <details><summary>Why this date works</summary>{option.reasons.length > 0 && <ul>{option.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>}{option.considerations.length > 0 && <p><strong>Consider:</strong> {option.considerations.join(" ")}</p>}</details>}</article>)}</div><p className="date-availability-note">{dateRecommendations.availabilityNote}</p></>}
                </section>
              )}
            </>
          )}

          {q.kind === "range" && (
            <div className="budget-field">
              <strong>
                {formatApiPrice(budget)}
                {budget >= 7000 ? "+" : ""}
              </strong>
              <input
                aria-label="Maximum lodging budget per night"
                type="range"
                min="100"
                max="7000"
                step="100"
                value={budget}
                onChange={(event) => setBudget(Number(event.target.value))}
              />
              <div>
                <span>$100</span>
                <span>$7,000+</span>
              </div>
              {Number(answers.party_rooms) > 1 && (
                <small>
                  For {answers.party_rooms} rooms, we’ll confirm the total
                  before booking.
                </small>
              )}
            </div>
          )}

          <aside
            className={`why-we-ask ${q.kind === "departure" ? "departure-why" : ""}`}
          >
            <Sparkles size={14} />
            <span>
              <strong>Why we ask</strong>
              {q.whyWeAsk}
            </span>
          </aside>
          {validationError && (
            <p className="quiz-error" role="alert">
              <AlertCircle size={14} />
              {validationError}
            </p>
          )}
        </div>
        <button className="quiz-continue" onClick={continueJourney}>
          {step === questions.length - 1 ? "See my matches" : "Continue"}{" "}
          <ArrowRight size={15} />
        </button>
      </section>
      {paymentOpen && (
        <div
          className="payment-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Payment"
        >
          {paymentLoading || status === "loading" ? (
            <div
              className="payment-card payment-skeleton"
              aria-label="Preparing secure payment"
            >
              <span className="skeleton-line title" />
              <span className="skeleton-line" />
              <span className="skeleton-box" />
              <span className="skeleton-line short" />
              <span className="skeleton-button" />
            </div>
          ) : paymentError ? (
            <div className="payment-card payment-state">
              <button
                className="payment-close"
                type="button"
                onClick={() => setPaymentOpen(false)}
                aria-label="Close payment"
              >
                ×
              </button>
              <AlertCircle size={34} />
              <h2>Payment couldn&apos;t load</h2>
              <p>{paymentError}</p>
              {paymentErrorSources.length > 0 && (
                <ul className="payment-error-sources">
                  {paymentErrorSources.map((source) => <li key={source}>{source}</li>)}
                </ul>
              )}
              <button
                className="payment-submit"
                type="button"
                onClick={() => void initializePayment()}
              >
                <RefreshCw size={15} /> Try again
              </button>
            </div>
          ) : intent && stripePromise ? (
            <Elements stripe={stripePromise}>
              <PaymentForm
                intent={intent}
                name={session?.user?.name}
                email={session?.user?.email}
                onClose={() => setPaymentOpen(false)}
              />
            </Elements>
          ) : null}
        </div>
      )}
    </main>
  );
}
