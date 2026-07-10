"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { CtaLink } from "../components/CtaLink";

export function NavbarSection() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <Link href="#home" aria-label="Velari home"><Image src="/images/logo.png" alt="Velari" width={133} height={44} className="logo" priority /></Link>
      <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Main navigation">
        <Link href="#home" onClick={closeMenu}>Home</Link><Link href="#how-it-works" onClick={closeMenu}>How It Works</Link>
      </nav>
      <div className="nav-actions"><Link href="#footer" className="login">Log In</Link><CtaLink>Begin Your Emotional Journey</CtaLink></div>
      <button className="menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
    </header>
  );
}
