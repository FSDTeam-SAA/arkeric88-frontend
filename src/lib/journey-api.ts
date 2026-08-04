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
  todays_feeling: string;
  experience_kind: string;
  energy_level: string;
  travel_style: string;
  trip_organization: string;
  activity_restrictions: string[];
  life_season: string;
  preferred_environments: string[];
  birthdate: string;
  total_trip_budget: number;
  trip_length_days: number;
};

export type SuggestedCity = {
  cityName: string;
  countryName: string;
  cityImage: string[];
  latitude: number;
  longitude: number;
  numberOfDays: number;
  description: string;
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
  aiAnalysisStatus: "pending" | "suggested_cities_ready" | "completed" | "failed";
  suggestedCities: SuggestedCity[];
  selectedCity?: string;
  travelThemes?: string[];
  astroInsight?: string;
  userProfile?: {
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
