import { notFound } from "next/navigation";
import { SampleItineraryPage } from "@/components/journey/SampleItineraryPage";
import { getSampleJourney, sampleJourneys } from "@/lib/sample-journeys";

export function generateStaticParams() {
  return Object.keys(sampleJourneys).map((slug) => ({ slug }));
}

export default function SampleJourneyRoute({ params }: { params: { slug: string } }) {
  const journey = getSampleJourney(params.slug.toLowerCase());
  if (!journey) notFound();
  return <SampleItineraryPage journey={journey} />;
}
