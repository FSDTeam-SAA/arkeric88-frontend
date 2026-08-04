import { Suspense } from "react";
import { ResultsPage } from "@/components/journey/ResultsPage";

export default function Page() {
  return <Suspense fallback={<main className="results-page"><div className="analysis-state"><p>Preparing your results…</p></div></main>}><ResultsPage /></Suspense>;
}
