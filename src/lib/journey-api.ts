export const API_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1"
).replace(/\/$/, "");

type ApiEnvelope<T> = { success?: boolean; message?: string; data: T };
type ApiErrorResponse = {
  success: false;
  statusCode?: number;
  message?: string;
  errorSources?: ApiErrorSource[];
};

export type ApiErrorSource = { path: string | number; message: string };
export type Restriction =
  | "mobility_accessibility"
  | "food_dietary"
  | "no_long_drives"
  | "no_intense_activity"
  | "no_water_activities"
  | "avoid_extreme_heat"
  | "avoid_cold_weather"
  | "other";
export type RestrictionSeverity = "must_avoid" | "prefer_avoid";

export type VelariIntake = {
  recent_feelings: Array<"stretched_thin" | "stuck_in_routine" | "disconnected" | "curious" | "energized" | "turning_point" | "content_ready" | "something_else">;
  recent_feelings_other?: string;
  trip_goals: Array<"restoration" | "connection" | "discovery" | "adventure" | "inspiration" | "celebration" | "reflection" | "growth">;
  trip_prompt: "need_a_break" | "time_with_someone" | "celebrating" | "curious_to_explore" | "ready_for_change" | "change_of_scenery" | "no_particular_reason" | "something_else";
  trip_prompt_other?: string;
  preferred_moments: Array<"food_drinks" | "art_history_culture" | "nature_wildlife" | "beaches_water" | "movement_adventure" | "quiet_privacy" | "meeting_people" | "spa_wellness" | "music_nightlife" | "learning_making">;
  preferred_environments: Array<"coast" | "mountains" | "forest_jungle" | "desert" | "countryside" | "small_town" | "vibrant_city" | "surprise_me">;
  trip_pace: "mostly_open" | "one_highlight" | "balanced" | "full_days";
  travel_party: "solo" | "couple" | "group" | "family";
  party_adults?: number;
  party_children?: number;
  party_rooms?: number;
  party_child_ages?: number[];
  activity_restrictions?: Restriction[];
  restriction_severity?: Partial<Record<Restriction, RestrictionSeverity>>;
  restriction_notes?: string;
  departure_location: string;
  departure_latitude?: number;
  departure_longitude?: number;
  departure_country?: string;
  travel_distance: "nearby" | "manageable_flight" | "anywhere";
  travel_timing: "exact_dates" | "flexible" | "month_season";
  check_in_date?: string;
  check_out_date?: string;
  travel_period?: "spring" | "summer" | "autumn" | "winter" | "january" | "february" | "march" | "april" | "may" | "june" | "july" | "august" | "september" | "october" | "november" | "december";
  trip_nights?: number;
  budget_per_night: number;
  currency?: "USD";
};

export type VelariIntakeUpdate = Partial<VelariIntake>;

export type SuggestedCity = {
  destinationId: string;
  cityName: string;
  countryName: string;
  cityImage: string[];
  description: string;
  primaryFeeling?: string;
  matchScore?: number;
  matchReasons: string[];
  tradeoffs: string[];
  unresolvedFacts: string[];
};

export type TourActivity = {
  itemType?: "experience" | "meal" | "transfer" | "free_time";
  activityName: string;
  activityDescription: string;
  activityAddress: string;
  activityImage: string[];
  activityTime: string;
  whySelected?: string;
  travelMinutesFromPrevious?: number | null;
  travelFrom?: string;
  priceIndication?: string;
  rating?: number | null;
  openSlot?: boolean;
  transferMinutes?: number | null;
  transferBufferMinutes?: number | null;
  includesFerry?: boolean;
  viator?: {
    product_code?: string;
    title?: string;
    booking_url?: string;
    rating?: number;
    review_count?: number;
    from_price?: number;
    currency?: string;
  };
};

export type StayDetails = {
  name: string;
  address: string;
  rating?: number;
  priceLevel?: string;
  photos: string[];
  averageNightlyPrice?: number | string;
  whySelected?: string;
  estimateNote?: string;
};

export type FeelingBlock = {
  headline: string;
  primaryFeeling?: string;
  explanation?: string;
  markdown?: string;
};

export type Stop = {
  stop: number;
  baseArea: string;
  nights: number;
  firstDay: number;
  lastDay: number;
  stay?: StayDetails;
};

export type TourPlanDay = {
  day: number;
  stop?: number;
  dayType?: "standard" | "transfer";
  activities: TourActivity[];
};

export type PriceBreakdown = {
  currency?: string;
  appliesTo?: string;
  lines: Array<{
    category: string;
    label: string;
    amount: number | null;
    perPerson?: number | null;
    basis: string;
    details: string[];
  }>;
  total: number | null;
  totalLabel?: string;
  totalWithheldReason?: string | null;
  whatMayVary?: string;
};

export type DateRecommendation = {
  label: string;
  checkIn: string;
  checkOut: string;
  weekdays: string[];
  nights: number;
  reasons: string[];
  considerations: string[];
  checkInWeekday?: string;
  checkOutWeekday?: string;
  matchScore?: number;
};

export type TravelDateRecommendations = {
  recommended: DateRecommendation;
  alternatives: DateRecommendation[];
  summary: string;
  availabilityNote: string;
  status?: string;
  window?: {
    earliestCheckIn?: string;
    latestCheckOut?: string;
    note?: string;
  };
};

export type JourneyHistory = {
  _id: string;
  aiSessionId?: string;
  activitySessionId?: string;
  aiAnalysisStatus: "pending" | "suggested_cities_ready" | "completed" | "failed";
  matchStatus?: "matched" | "no_valid_result";
  suggestedCities: SuggestedCity[];
  noValidResult?: Record<string, unknown>;
  clarifications?: Record<string, unknown>[];
  selectedCity?: string;
  selectedDestinationId?: string;
  travelThemes?: string[];
  userProfile?: {
    wellnessArchetype?: string;
    wellnessNeeds?: string[];
    zodiacSign?: string;
    currentEnergy?: string;
    emotionalState?: string;
    seeking?: string;
    travelStyle?: string;
    preferredPace?: string;
    budget?: number;
    tripLengthDays?: number;
    preferredEnvironments?: string[];
  };
  // Intake is used only to request date recommendations; it must never be rendered.
  intake?: VelariIntake;
  feelingBlock?: FeelingBlock;
  bookingStatus?: { readyToBook: boolean; guestLabel: string };
  stops?: Stop[];
  tourPlan?: TourPlanDay[];
  priceBreakdown?: PriceBreakdown;
  guestNotes?: string[];
  validation?: { displayReady?: boolean; status?: string; issues?: Record<string, unknown>[] };
  // The original AI payload is deliberately preserved. It can contain optional
  // and newly-added fields that have not yet been normalized into history.
  aiResponse?: TourPlanAiResponse;
};

export type TourPlanAiResponse = {
  activity_session_id?: string;
  destination_id?: string;
  city?: string;
  feeling_block?: Record<string, unknown>;
  stay?: Record<string, unknown>;
  stops?: Array<Record<string, unknown>>;
  tour_plan?: Array<Record<string, unknown>>;
  booking_status?: Record<string, unknown>;
  price_breakdown?: Record<string, unknown>;
  budget_check?: Record<string, unknown>;
  validation?: {
    status?: string;
    display_ready?: boolean;
    issues?: Array<Record<string, unknown>>;
    [key: string]: unknown;
  };
  guest_notes?: string[];
  [key: string]: unknown;
};

export type TourPlanResult = {
  history: JourneyHistory;
  aiResponse: TourPlanAiResponse;
};

type UnknownRecord = Record<string, unknown>;

const asRecord = (value: unknown): UnknownRecord | undefined =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : undefined;
const asString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value : undefined;
const asNumber = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;
const asStringArray = (value: unknown): string[] | undefined =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : undefined;
const firstDefined = (...values: unknown[]) => values.find((value) => value !== undefined && value !== null);
const camelValue = (record: UnknownRecord, camel: string, snake: string) => firstDefined(record[camel], record[snake]);

function mapAiActivity(value: UnknownRecord): TourActivity {
  const viator = asRecord(value.viator);
  return {
    itemType: asString(camelValue(value, "itemType", "item_type")) as TourActivity["itemType"],
    activityName: asString(camelValue(value, "activityName", "activity_name")) || asString(value.name) || asString(value.title) || "Untitled activity",
    activityDescription: asString(camelValue(value, "activityDescription", "activity_description")) || asString(value.description) || "",
    activityAddress: asString(camelValue(value, "activityAddress", "activity_address")) || asString(value.address) || "",
    activityImage: asStringArray(camelValue(value, "activityImage", "activity_image")) || asStringArray(value.images) || [],
    activityTime: asString(camelValue(value, "activityTime", "activity_time")) || asString(value.time) || "",
    whySelected: asString(camelValue(value, "whySelected", "why_selected")),
    travelMinutesFromPrevious: asNumber(camelValue(value, "travelMinutesFromPrevious", "travel_minutes_from_previous")) ?? null,
    travelFrom: asString(camelValue(value, "travelFrom", "travel_from")),
    priceIndication: asString(camelValue(value, "priceIndication", "price_indication")),
    rating: asNumber(value.rating) ?? null,
    openSlot: firstDefined(value.openSlot, value.open_slot) === true,
    transferMinutes: asNumber(camelValue(value, "transferMinutes", "transfer_minutes")) ?? null,
    transferBufferMinutes: asNumber(camelValue(value, "transferBufferMinutes", "transfer_buffer_minutes")) ?? null,
    includesFerry: firstDefined(value.includesFerry, value.includes_ferry) === true,
    viator: viator
      ? {
          product_code: asString(viator.product_code), title: asString(viator.title), booking_url: asString(viator.booking_url),
          rating: asNumber(viator.rating), review_count: asNumber(viator.review_count), from_price: asNumber(viator.from_price), currency: asString(viator.currency),
        }
      : undefined,
  };
}

function mapAiTourPlan(value: unknown): TourPlanDay[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map(asRecord).filter((day): day is UnknownRecord => Boolean(day)).map((day, index) => ({
    day: asNumber(day.day) ?? index + 1,
    stop: asNumber(day.stop),
    dayType: asString(camelValue(day, "dayType", "day_type")) as TourPlanDay["dayType"],
    activities: Array.isArray(day.activities) ? day.activities.map(asRecord).filter((activity): activity is UnknownRecord => Boolean(activity)).map(mapAiActivity) : [],
  }));
}

function mapAiStay(value: unknown): StayDetails | undefined {
  const stay = asRecord(value);
  if (!stay) return undefined;
  const name = asString(stay.name) || asString(stay.hotel_name) || asString(stay.property_name);
  if (!name) return undefined;
  return {
    name,
    address: asString(stay.address) || "",
    rating: asNumber(stay.rating),
    priceLevel: asString(camelValue(stay, "priceLevel", "price_level")),
    photos: asStringArray(stay.photos) || asStringArray(stay.images) || [],
    averageNightlyPrice: firstDefined(stay.averageNightlyPrice, stay.average_nightly_price) as number | string | undefined,
    whySelected: asString(camelValue(stay, "whySelected", "why_selected")),
    estimateNote: asString(camelValue(stay, "estimateNote", "estimate_note")),
  };
}

function mapAiStops(value: unknown, defaultStay?: StayDetails): Stop[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map(asRecord).filter((stop): stop is UnknownRecord => Boolean(stop)).map((stop, index) => ({
    stop: asNumber(stop.stop) ?? index + 1,
    baseArea: asString(camelValue(stop, "baseArea", "base_area")) || asString(stop.area) || "Your base",
    nights: asNumber(stop.nights) ?? 0,
    firstDay: asNumber(camelValue(stop, "firstDay", "first_day")) ?? index + 1,
    lastDay: asNumber(camelValue(stop, "lastDay", "last_day")) ?? index + 1,
    stay: mapAiStay(stop.stay) || (index === 0 ? defaultStay : undefined),
  }));
}

function mapAiPriceBreakdown(value: unknown): PriceBreakdown | undefined {
  const breakdown = asRecord(value);
  if (!breakdown) return undefined;
  const lines = Array.isArray(breakdown.lines) ? breakdown.lines.map(asRecord).filter((line): line is UnknownRecord => Boolean(line)).map((line) => ({
    category: asString(line.category) || "other",
    label: asString(line.label) || "Estimate",
    amount: asNumber(line.amount) ?? null,
    perPerson: asNumber(camelValue(line, "perPerson", "per_person")) ?? null,
    basis: asString(line.basis) || "",
    details: asStringArray(line.details) || [],
  })) : [];
  return {
    currency: asString(breakdown.currency), appliesTo: asString(camelValue(breakdown, "appliesTo", "applies_to")), lines,
    total: asNumber(breakdown.total) ?? null,
    totalLabel: asString(camelValue(breakdown, "totalLabel", "total_label")),
    totalWithheldReason: asString(camelValue(breakdown, "totalWithheldReason", "total_withheld_reason")) ?? null,
    whatMayVary: asString(camelValue(breakdown, "whatMayVary", "what_may_vary")),
  };
}

/**
 * Applies the AI pass-through payload without requiring optional fields to be
 * present. The raw payload stays attached for future UI fields.
 */
export function withAiTourPlan(history: JourneyHistory, aiResponse?: TourPlanAiResponse): JourneyHistory {
  if (!aiResponse) return history;
  const feelingBlock = asRecord(aiResponse.feeling_block);
  const validation = asRecord(aiResponse.validation);
  const plan = mapAiTourPlan(aiResponse.tour_plan);
  const stay = mapAiStay(aiResponse.stay);
  return {
    ...history,
    aiResponse,
    activitySessionId: asString(aiResponse.activity_session_id) || history.activitySessionId,
    selectedDestinationId: asString(aiResponse.destination_id) || history.selectedDestinationId,
    selectedCity: asString(aiResponse.city) || history.selectedCity,
    tourPlan: plan ?? history.tourPlan,
    stops: mapAiStops(aiResponse.stops, stay) ?? history.stops,
    priceBreakdown: mapAiPriceBreakdown(aiResponse.price_breakdown) ?? history.priceBreakdown,
    bookingStatus: asRecord(aiResponse.booking_status)
      ? {
          readyToBook: firstDefined(asRecord(aiResponse.booking_status)?.readyToBook, asRecord(aiResponse.booking_status)?.ready_to_book) === true,
          guestLabel: asString(asRecord(aiResponse.booking_status)?.guestLabel) || asString(asRecord(aiResponse.booking_status)?.guest_label) || "",
        }
      : history.bookingStatus,
    feelingBlock: feelingBlock
      ? {
          headline: asString(feelingBlock.headline) || history.feelingBlock?.headline || "Your trip intention",
          primaryFeeling: asString(camelValue(feelingBlock, "primaryFeeling", "primary_feeling")),
          explanation: asString(feelingBlock.explanation), markdown: asString(feelingBlock.markdown),
        }
      : history.feelingBlock,
    guestNotes: asStringArray(aiResponse.guest_notes) ?? history.guestNotes,
    validation: validation
      ? {
          displayReady: firstDefined(validation.displayReady, validation.display_ready) as boolean | undefined,
          status: asString(validation.status),
          issues: Array.isArray(validation.issues) ? validation.issues.map(asRecord).filter((issue): issue is UnknownRecord => Boolean(issue)) : undefined,
        }
      : history.validation,
  };
}

const tourPlanStorageKey = (historyId: string) => `velari:tour-plan-ai-response:${historyId}`;

export function saveAiTourPlan(historyId: string, aiResponse: TourPlanAiResponse) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(tourPlanStorageKey(historyId), JSON.stringify(aiResponse));
  } catch {
    // Storage can be disabled or full. The caller still has the in-memory
    // response and a successful API result must not be treated as a failure.
  }
}

export function readAiTourPlan(historyId: string): TourPlanAiResponse | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const value = window.sessionStorage.getItem(tourPlanStorageKey(historyId));
    return value ? (JSON.parse(value) as TourPlanAiResponse) : undefined;
  } catch { return undefined; }
}

export type PaymentIntentData = {
  paymentId: string;
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  publishableKey: string;
};

export class ApiError extends Error {
  constructor(message: string, public status: number, public errorSources: ApiErrorSource[] = []) {
    super(message);
    this.name = "ApiError";
  }
}

export async function journeyApi<T>(path: string, token?: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers || {}),
      },
    });
  } catch {
    throw new ApiError("Unable to reach the server. Check your connection and try again.", 0);
  }
  const result = (await response.json().catch(() => null)) as ApiEnvelope<T> | ApiErrorResponse | null;
  // A 200 response remains successful even when its human-readable message
  // says the itinerary needs regeneration. Older wrappers may omit `success`.
  if (!response.ok || result?.success === false) {
    const error = result as ApiErrorResponse | null;
    throw new ApiError(
      error?.message || "Something went wrong. Please try again.",
      response.status,
      Array.isArray(error?.errorSources) ? error.errorSources : [],
    );
  }
  return (result as ApiEnvelope<T>).data;
}
