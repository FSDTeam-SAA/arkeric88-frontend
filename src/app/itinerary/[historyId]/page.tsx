import { ItineraryPage } from "@/components/journey/ItineraryPage";

export default function Page({ params }: { params: { historyId: string } }) {
  return <ItineraryPage historyId={params.historyId} />;
}
