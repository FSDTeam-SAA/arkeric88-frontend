"use client";

import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f1ea] px-5 text-center"><div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #aab7a2 0, transparent 28%), radial-gradient(circle at 80% 75%, #d8c9b4 0, transparent 32%)" }} /><div className="relative z-10 max-w-2xl"><div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#5e6755] text-white shadow-lg"><Compass size={30} /></div><p className="text-sm font-semibold uppercase tracking-[.3em] text-[#5e6755]">Destination not found</p><h1 className="mt-3 text-[clamp(7rem,22vw,13rem)] font-semibold leading-none text-[#34382f]">404</h1><h2 className="mt-4 text-3xl text-[#292824]">This path isn&apos;t on the itinerary.</h2><p className="mx-auto mt-4 max-w-lg text-[#716d66]">The page may have moved, or the journey you followed no longer exists. Let&apos;s guide you somewhere meaningful.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/" className="inline-flex h-12 items-center justify-center rounded-full bg-[#5e6755] px-7 font-medium text-white hover:bg-[#4d5746]">Return Home</Link><button onClick={() => router.back()} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#5e6755] px-7 font-medium text-[#5e6755] hover:bg-[#5e6755]/10"><ArrowLeft size={17} />Go Back</button></div></div></main>;
}
