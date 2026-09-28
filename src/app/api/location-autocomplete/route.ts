import { NextRequest, NextResponse } from "next/server";

type GoogleSuggestion = {
  placePrediction?: {
    placeId?: string;
    text?: { text?: string };
    structuredFormat?: {
      mainText?: { text?: string };
      secondaryText?: { text?: string };
    };
  };
};

type GoogleAutocompleteResponse = {
  suggestions?: GoogleSuggestion[];
  error?: { message?: string };
};

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() || "";

  if (query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  if (query.length > 100) {
    return NextResponse.json(
      { error: "The location search is too long." },
      { status: 400 },
    );
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Location search is not configured yet." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat.mainText.text,suggestions.placePrediction.structuredFormat.secondaryText.text",
        },
        body: JSON.stringify({
          input: query,
          includedPrimaryTypes: [
            "locality",
            "administrative_area_level_1",
            "country",
            "airport",
          ],
          languageCode: "en",
        }),
      },
    );

    const data = (await response.json().catch(() => null)) as
      | GoogleAutocompleteResponse
      | null;

    if (!response.ok) {
      console.error(
        "Google Places autocomplete failed:",
        response.status,
        data?.error?.message,
      );
      return NextResponse.json(
        { error: "Location suggestions are temporarily unavailable." },
        { status: 502 },
      );
    }

    const suggestions = (data?.suggestions || [])
      .map(({ placePrediction }) => {
        const label = placePrediction?.text?.text?.trim() || "";
        const mainText =
          placePrediction?.structuredFormat?.mainText?.text?.trim() || label;
        const secondaryText =
          placePrediction?.structuredFormat?.secondaryText?.text?.trim() || "";

        return {
          id: placePrediction?.placeId || label,
          label,
          mainText,
          secondaryText,
        };
      })
      .filter((suggestion) => suggestion.id && suggestion.label)
      .slice(0, 6);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Google Places autocomplete request failed:", error);
    return NextResponse.json(
      { error: "Unable to load locations. Please try again." },
      { status: 502 },
    );
  }
}
