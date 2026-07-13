"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type CtaLinkProps = { children: React.ReactNode; href?: string };

export function CtaLink({ children, href = "/journey" }: CtaLinkProps) {
  const { status } = useSession();
  const router = useRouter();
  const destination = status === "authenticated" ? href : `/login?callbackUrl=${encodeURIComponent(href)}`;
  return <Link href={destination} className="cta" onClick={(event) => {
    if (status === "authenticated") return;
    event.preventDefault();
    if (status === "loading") {
      toast.loading("Checking your account...", { id: "journey-auth", duration: 800 });
      return;
    }
    toast.info("Please sign in to start your journey", { id: "journey-auth", duration: 1800 });
    window.setTimeout(() => router.push(destination), 650);
  }}>{children}<ArrowRight size={16} /></Link>;
}
