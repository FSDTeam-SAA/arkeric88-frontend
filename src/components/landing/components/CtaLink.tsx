import { ArrowRight } from "lucide-react";
import Link from "next/link";

type CtaLinkProps = { children: React.ReactNode; href?: string };

export function CtaLink({ children, href = "#journeys" }: CtaLinkProps) {
  return <Link href={href} className="cta">{children}<ArrowRight size={16} /></Link>;
}
