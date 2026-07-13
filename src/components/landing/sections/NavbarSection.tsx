"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { CtaLink } from "../components/CtaLink";

type NavbarSectionProps = {
  activePage?: "home" | "how-it-works" | "none";
  accountMode?: boolean;
};

export function NavbarSection({ activePage = "home", accountMode = false }: NavbarSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { status } = useSession();
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <Link href="/" className="logo-panel" aria-label="Velari home"><Image src="/images/logo.png" alt="Velari" width={180} height={59} className="logo" priority /></Link>
      <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Main navigation">
        <Link href="/" className={activePage === "home" ? "active" : ""} onClick={closeMenu}>Home</Link><Link href="/how-it-works" className={activePage === "how-it-works" ? "active" : ""} onClick={closeMenu}>How It Works</Link>
      </nav>
      <div className="nav-actions">{accountMode || status === "authenticated" ? <Link href="/account/personal-information" className="account-button" aria-label="My account"><UserRound /></Link> : <Link href="/login" className="login">Log In</Link>}<CtaLink>Begin Your Emotional Journey</CtaLink></div>
      <button className="menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
    </header>
  );
}
