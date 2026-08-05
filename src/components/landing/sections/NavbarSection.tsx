"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CtaLink } from "../components/CtaLink";

type NavbarSectionProps = {
  activePage?: "home" | "how-it-works" | "none";
  accountMode?: boolean;
};

const API = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1"
).replace(/\/$/, "");

export function NavbarSection({ activePage = "home", accountMode = false }: NavbarSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const [profilePicture, setProfilePicture] = useState<string | undefined>(session?.user?.profilePicture);
  const closeMenu = () => setMenuOpen(false);
  const token = (session?.user as { accessToken?: string } | undefined)?.accessToken;

  useEffect(() => {
    const applyFromEvent = (event: Event) => {
      setProfilePicture((event as CustomEvent<string | undefined>).detail);
    };
    window.addEventListener("velari:profile-updated", applyFromEvent);

    if (status === "authenticated" && token) {
      fetch(`${API}/user/profile`, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => response.json())
        .then((result) => {
          if (result?.data?.profilePicture) setProfilePicture(result.data.profilePicture);
        })
        .catch(() => {});
    }

    return () => window.removeEventListener("velari:profile-updated", applyFromEvent);
  }, [status, token]);

  useEffect(() => {
    if (session?.user?.profilePicture) setProfilePicture(session.user.profilePicture);
  }, [session?.user?.profilePicture]);

  return (
    <header className="navbar">
      <div className="navbar-container mx-auto">
        <Link href="/" className="logo-panel" aria-label="Velari home"><Image src="/images/logo.png" alt="Velari" width={180} height={59} className="logo" priority /></Link>
        <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Main navigation">
          <Link href="/" className={activePage === "home" ? "active" : ""} onClick={closeMenu}>Home</Link><Link href="/how-it-works" className={activePage === "how-it-works" ? "active" : ""} onClick={closeMenu}>How It Works</Link>
        </nav>
        <div className="nav-actions">{accountMode || status === "authenticated" ? <Link href="/account/personal-information" className="account-button" aria-label="My account">{profilePicture ? <img src={profilePicture} alt="" className="account-avatar" /> : <UserRound />}</Link> : <Link href="/login" className="login">Log In</Link>}<CtaLink>Begin Your Emotional Journey</CtaLink></div>
        <button className="menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </header>
  );
}
