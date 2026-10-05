export const API_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1"
).replace(/\/$/, "");

type ApiEnvelope<T> = { success: boolean; message?: string; data: T };
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
  validation?: { displayReady: boolean };
};

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
  if (!response.ok || !result?.success) {
    const error = result as ApiErrorResponse | null;
    throw new ApiError(
      error?.message || "Something went wrong. Please try again.",
      response.status,
      Array.isArray(error?.errorSources) ? error.errorSources : [],
    );
  }
  return (result as ApiEnvelope<T>).data;
}
