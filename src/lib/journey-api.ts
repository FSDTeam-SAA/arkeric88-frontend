export const API_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1"
).replace(/\/$/, "");

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type QuestionnaireAnswers = {
  selected_archetype: import("@/lib/wellness-archetypes").WellnessArchetypeId;
  break_from: string;
  arrival_priority: string;
  retreat_structure: string;
  reset_style: string;
  physical_intensity: string;
  travel_party: string;
  party_details?: { adults?: number; children?: number; party_size?: number };
  spirituality: string;
  travel_timing: "flexible" | "specific";
  travel_months?: number[];
  planning_service: string;
  activity_restrictions: { text: string; codes: string[] };
  preferred_setting: string[];
  budget_per_night: number;
  budget_open_ended: boolean;
  trip_length: string;
  transform_focus: string[];
};

export type SuggestedCity = {
  propertyId?: string;
  cityName: string;
  countryName: string;
  cityImage: string[];
  latitude: number;
  longitude: number;
  numberOfDays: number;
  description: string;
  matchScore?: number;
  matchReasons?: string[];
  warnings?: string[];
  restrictionVerification?: string;
  nightlyPrice?: string;
  nightlyPriceIsLowerBound?: boolean;
  budgetTier?: string;
  packageType?: string;
  bestSeason?: string;
  settings?: string[];
};

export type TourActivity = {
  activityName: string;
  activityDescription: string;
  activityLocation: string;
  activityAddress: string;
  activityImage: string[];
  activityTime: string;
  activityCost: number;
  distanceFromPreviousKm?: number | null;
};

export type JourneyHistory = {
  _id: string;
  aiSessionId?: string;
  activitySessionId?: string;
  aiAnalysisStatus: "pending" | "suggested_cities_ready" | "completed" | "failed";
  suggestedCities: SuggestedCity[];
  selectedCity?: string;
  selectedPropertyId?: string;
  travelThemes?: string[];
  astroInsight?: string;
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
  stay?: {
    name: string;
    address: string;
    rating?: number;
    priceLevel?: string;
    photos: string[];
  };
  tourPlan?: { day: number; activities: TourActivity[] }[];
  totalCostEstimate?: number;
  packingTips?: string;
  travelTips?: string;
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
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function journeyApi<T>(
  path: string,
  token?: string,
  init?: RequestInit,
): Promise<T> {
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

  const result = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!response.ok || !result?.success) {
    throw new ApiError(result?.message || "Something went wrong. Please try again.", response.status);
  }
  return result.data;
}
