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
  getQuizQuestions,
  QuizOption,
  QuizQuestion,
  travelPeriodOptions,
} from "@/lib/wellness-archetypes";

type Answer = string | string[];
const optionIcons = [Sparkles, Compass, Star, User, MapPin, Home];
const draftKey = "velari-journey-draft";
const draftVersion = 5;

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
    if (paymentIntent) {
      sessionStorage.setItem("velari-last-payment", intent.paymentIntentId);
      router.push(
        `/results?payment_intent=${encodeURIComponent(paymentIntent.id)}`,
      );
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
  const [intent, setIntent] = useState<PaymentIntentData | null>(null);
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
      return {
        ...current,
        [answerKey]: withoutExclusive.includes(value)
          ? withoutExclusive.filter((item) => item !== value)
          : [...withoutExclusive, value],
      };
    });
  };

  const setTextAnswer = (key: string, value: string) => {
    setValidationError("");
    setAnswers((current) => ({ ...current, [key]: value }));
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
      if (checkIn && checkOut) {
        const nights = Math.round(
          (new Date(`${checkOut}T00:00:00`).getTime() -
            new Date(`${checkIn}T00:00:00`).getTime()) /
            86400000,
        );
        if (nights > 0) next.trip_nights = String(nights);
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
      if (answers.travel_timing === "exact_dates") {
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

  const questionFor = useCallback(
    (key: string) => questions.find((question) => question.key === key),
    [questions],
  );
  const labelsFor = useCallback(
    (key: string) => {
      const question = questionFor(key);
      return selectedValues(key).map((value) =>
        answerLabel(question || {}, value),
      );
    },
    [questionFor, selectedValues],
  );

  const questionnaire = useMemo<QuestionnaireAnswers>(() => {
    const feelingLabels = labelsFor("recent_feelings").map((label) =>
      label === "Something else"
        ? String(answers.recent_feelings_other || "").trim()
        : label,
    );
    const goalLabels = labelsFor("trip_goals");
    const momentLabels = labelsFor("preferred_moments");
    const environmentLabels = labelsFor("preferred_environments");
    const promptQuestion = questionFor("trip_prompt");
    const promptLabel =
      answers.trip_prompt === "something_else"
        ? String(answers.trip_prompt_other || "").trim()
        : answerLabel(promptQuestion || {}, String(answers.trip_prompt || ""));
    const paceLabel = answerLabel(
      questionFor("trip_pace") || {},
      String(answers.trip_pace || ""),
    );
    const partyLabel = answerLabel(
      questionFor("travel_party") || {},
      String(answers.travel_party || ""),
    );
    const distanceLabel = answerLabel(
      questionFor("departure") || {},
      String(answers.travel_distance || ""),
    );
    const timingLabel = answerLabel(
      questionFor("travel_timing") || {},
      String(answers.travel_timing || ""),
    );
    const restrictionQuestion = questionFor("activity_restrictions");
    const restrictions = selectedValues("activity_restrictions").map(
      (value) => {
        const label =
          value === "other"
            ? String(answers.restriction_notes || "").trim()
            : answerLabel(restrictionQuestion || {}, value);
        const severity =
          answers[`restriction_severity_${value}`] === "must_avoid"
            ? "must avoid"
            : "prefer to avoid";
        return `${label} (${severity})`;
      },
    );
    const notes = String(answers.restriction_notes || "").trim();
    if (notes && !selectedValues("activity_restrictions").includes("other"))
      restrictions.push(`Additional note: ${notes}`);

    const isSolo = answers.travel_party === "solo";
    const adults = isSolo
      ? 1
      : Math.max(1, Number(answers.party_adults) || 1);
    const children = isSolo
      ? 0
      : Math.max(0, Number(answers.party_children) || 0);
    const rooms = isSolo ? 1 : Math.max(1, Number(answers.party_rooms) || 1);
    const nights = Math.max(1, Number(answers.trip_nights) || 1);

    return {
      recent_feelings: feelingLabels,
      trip_goals: goalLabels,
      trip_prompt: promptLabel,
      preferred_moments: momentLabels,
      preferred_environments: environmentLabels,
      trip_pace: paceLabel,
      travel_party: partyLabel,
      party_details: { adults, children, rooms },
      activity_restrictions: restrictions,
      restriction_notes: notes || undefined,
      departure_location: String(answers.departure_location || "").trim(),
      travel_distance: distanceLabel,
      travel_timing: timingLabel,
      check_in_date:
        answers.travel_timing === "exact_dates"
          ? String(answers.check_in_date || "")
          : undefined,
      check_out_date:
        answers.travel_timing === "exact_dates"
          ? String(answers.check_out_date || "")
          : undefined,
      travel_period:
        answers.travel_timing === "month_season"
          ? answerLabel(
              { options: travelPeriodOptions },
              String(answers.travel_period || ""),
            )
          : undefined,
      trip_length_days: nights,
      budget_per_night: budget,
      currency: "USD",
      todays_feeling: feelingLabels.join(", "),
      experience_kind: goalLabels.join(", "),
      travel_style: partyLabel,
      trip_organization: paceLabel,
      total_trip_budget: budget * rooms * nights,
    };
  }, [answers, budget, labelsFor, questionFor, selectedValues]);

  const formattedAnswer = useCallback(
    (question: QuizQuestion) => {
      if (question.kind === "range")
        return `${formatApiPrice(budget)} per room, per night`;
      if (question.kind === "party") {
        if (answers.travel_party === "solo") {
          return questionnaire.travel_party;
        }
        return `${questionnaire.travel_party}; ${questionnaire.party_details.adults} adults, ${questionnaire.party_details.children} children, ${questionnaire.party_details.rooms} rooms`;
      }
      if (question.kind === "restrictions") {
        return questionnaire.activity_restrictions.length
          ? questionnaire.activity_restrictions.join("; ")
          : "No restrictions provided";
      }
      if (question.kind === "departure") {
        return `${questionnaire.departure_location}; ${questionnaire.travel_distance}`;
      }
      if (question.kind === "timing") {
        return [
          questionnaire.travel_timing,
          questionnaire.check_in_date && questionnaire.check_out_date
            ? `${questionnaire.check_in_date} to ${questionnaire.check_out_date}`
            : "",
          questionnaire.travel_period || "",
          `${questionnaire.trip_length_days} nights`,
        ]
          .filter(Boolean)
          .join("; ");
      }
      const value = answers[question.key];
      if (Array.isArray(value)) {
        return value
          .map((item) =>
            item === question.otherOption
              ? String(answers[`${question.key}_other`] || "").trim()
              : answerLabel(question, item),
          )
          .join(", ");
      }
      if (value === question.otherOption)
        return String(answers[`${question.key}_other`] || "").trim();
      return answerLabel(question, String(value || ""));
    },
    [answers, budget, questionnaire],
  );

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
    setIntent(null);
    try {
      const price = await journeyApi<{ price: number }>("/price");
      const amount = Number(price?.price);
      if (!Number.isFinite(amount) || amount < 0.5)
        throw new Error("The journey price is currently unavailable.");
      const analysisPayload = { questions_answers: questionnaire };
      const data = await journeyApi<PaymentIntentData>("/payments", token, {
        method: "POST",
        body: JSON.stringify({
          amount,
          currency: "usd",
          description: "Velari™ personalized emotional journey",
          nameOnCard: session?.user?.name,
          email: session?.user?.email,
          quiz: questions.map((question) => ({
            question: question.title.replaceAll("\n", " "),
            answer: formattedAnswer(question),
          })),
          hope_of_this_trip: questionnaire.experience_kind,
          ...analysisPayload,
        }),
      });
      sessionStorage.setItem(
        `velari-analysis-${data.paymentIntentId}`,
        JSON.stringify(analysisPayload),
      );
      setIntent(data);
      setStripePromise(loadStripe(data.publishableKey));
    } catch (error) {
      setPaymentError(
        error instanceof Error ? error.message : "Unable to prepare payment.",
      );
    } finally {
      setPaymentLoading(false);
    }
  }, [
    formattedAnswer,
    questionnaire,
    questions,
    session?.user?.email,
    session?.user?.name,
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
                        inputMode="numeric"
                        value={String(answers.party_rooms || 1)}
                        onChange={(event) =>
                          setTextAnswer("party_rooms", event.target.value)
                        }
                      />
                    </label>
                  </div>
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
              <div className="departure-field">
                <Input
                  className="quiz-text-input"
                  aria-label="Departure city or airport"
                  value={String(answers.departure_location || "")}
                  onChange={(event) =>
                    setTextAnswer("departure_location", event.target.value)
                  }
                  placeholder="Search your city or departure airport"
                  autoComplete="off"
                />
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
                  {answers.travel_timing === "exact_dates" && (
                    <div className="date-grid">
                      <label>
                        Check-in
                        <Input
                          type="date"
                          value={String(answers.check_in_date || "")}
                          onChange={(event) =>
                            updateDate("check_in_date", event.target.value)
                          }
                        />
                      </label>
                      <label>
                        Check-out
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
                    Number of nights
                    <Input
                      type="number"
                      min="1"
                      inputMode="numeric"
                      value={String(answers.trip_nights || "")}
                      onChange={(event) =>
                        setTextAnswer("trip_nights", event.target.value)
                      }
                      placeholder="5"
                    />
                  </label>
                </div>
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
