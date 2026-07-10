import type { Metadata } from "next";
import { HowItWorksPage } from "@/components/how-it-works/HowItWorksPage";

export const metadata: Metadata = {
  title: "How Velari Works | Velari",
  description: "See how Velari transforms your emotions and preferences into meaningful travel experiences.",
};

export default function Page() {
  return <HowItWorksPage />;
}
