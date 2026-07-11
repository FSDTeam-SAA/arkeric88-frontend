"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Eye, EyeOff, History, LockKeyhole, Trash2, UserRound } from "lucide-react";
import { NavbarSection } from "@/components/landing/sections/NavbarSection";
import { FooterSection } from "@/components/landing/sections/FooterSection";

type AccountSection = "history" | "personal" | "password";

const menu = [
  { id: "history", label: "Search History", href: "/account/search-history", icon: History },
  { id: "personal", label: "Personal Information", href: "/account/personal-information", icon: UserRound },
  { id: "password", label: "Change Password", href: "/account/change-password", icon: LockKeyhole },
] as const;

const initialHistory = [
  { id: 1, country: "Greece", length: "5 days" },
  { id: 2, country: "Japan", length: "4 days" },
  { id: 3, country: "USA", length: "2 days" },
  { id: 4, country: "United Kingdom", length: "4 days" },
];

export function AccountPage({ section }: { section: AccountSection }) {
  return <main className="account-page"><NavbarSection activePage="none" accountMode /><section className="account-area"><aside className="account-sidebar">{menu.map((item) => { const Icon = item.icon; return <Link key={item.id} href={item.href} className={section === item.id ? "active" : ""}><Icon size={17} /><span>{item.label}</span></Link>; })}</aside><div className="account-content">{section === "history" && <SearchHistory />}{section === "personal" && <PersonalInformation />}{section === "password" && <ChangePassword />}</div></section><FooterSection /></main>;
}

function SearchHistory() {
  const [rows, setRows] = useState(initialHistory);
  return <div className="history-panel"><div className="history-table"><div className="history-row head"><span>Country</span><span>Trip Length</span><span>Action</span></div>{rows.length ? rows.map((row) => <div className="history-row" key={row.id}><span>{row.country}</span><span>{row.length}</span><span className="history-actions"><Link href="/results" aria-label={`View ${row.country} result`}><Eye size={17} /></Link><button type="button" onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))} aria-label={`Delete ${row.country}`}><Trash2 size={17} /></button></span></div>) : <p className="empty-history">No search history found.</p>}</div><div className="history-meta"><span>Showing 1 to {rows.length} of {rows.length} results</span><div className="pagination"><button aria-label="Previous page">‹</button><button className="active">1</button><button>2</button><button>3</button><button>…</button><button>8</button><button aria-label="Next page">›</button></div></div></div>;
}

function PersonalInformation() {
  const [saved, setSaved] = useState(false);
  return <form className="account-card" onSubmit={(event) => { event.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2200); }}><div className="account-card-heading"><h1>Personal Information</h1><p>Manage your personal information and profile details.</p></div><div className="gender-row"><label>Male <input type="radio" name="gender" defaultChecked /></label><label>Female <input type="radio" name="gender" /></label></div><div className="form-grid"><Field label="First Name" defaultValue="Jenny" /><Field label="Last Name" defaultValue="Wilson" /><Field label="Email Address" type="email" defaultValue="example@example.com" /><Field label="Phone Number" type="tel" defaultValue="+1 (555) 123-4567" /><label className="field full">Bio<textarea defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et ante sed sem feugiat tristique ut sed mauris. Phasellus urna magna, cursus at mi eu, dapibus porta nisi." /></label><Field label="Street Address" className="full" defaultValue="1234 Oak Avenue, San Francisco, CA 94102A" /><Field label="Location" defaultValue="Florida, USA" /><Field label="Postal Code" defaultValue="30301" /></div><FormActions saved={saved} /></form>;
}

function ChangePassword() {
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [values, setValues] = useState({ current: "", next: "", confirm: "" });
  const [saved, setSaved] = useState(false);
  const rules = [
    ["Minimum 8–12 characters (recommend 12+ for stronger security).", values.next.length >= 8],
    ["At least one uppercase letter must.", /[A-Z]/.test(values.next)],
    ["At least one lowercase letter must.", /[a-z]/.test(values.next)],
    ["At least one number must (0–9).", /\d/.test(values.next)],
    ["At least special character (! @ # $ % ^ & * etc.).", /[^A-Za-z0-9]/.test(values.next)],
    ["No spaces allowed.", values.next.length > 0 && !/\s/.test(values.next)],
  ] as const;
  const mismatch = values.confirm.length > 0 && values.next !== values.confirm;
  const toggle = (name: string) => setVisible((current) => ({ ...current, [name]: !current[name] }));
  return <form className="account-card password-card" onSubmit={(event) => { event.preventDefault(); if (rules.every((rule) => rule[1]) && !mismatch && values.current) { setSaved(true); setTimeout(() => setSaved(false), 2200); } }}><div className="account-card-heading"><h1>Change Password</h1><p>Manage your account preferences, security settings, and privacy options.</p></div><div className="password-grid">{(["current", "next", "confirm"] as const).map((name) => <label className={`field password-field ${name === "confirm" ? "confirm" : ""}`} key={name}>{name === "current" ? "Current Password" : name === "next" ? "New Password" : "Confirm New Password"}<span><input type={visible[name] ? "text" : "password"} value={values[name]} onChange={(event) => setValues((current) => ({ ...current, [name]: event.target.value }))} className={name === "confirm" && mismatch ? "invalid" : ""} required /><button type="button" onClick={() => toggle(name)} aria-label={`${visible[name] ? "Hide" : "Show"} password`}>{visible[name] ? <EyeOff size={16} /> : <Eye size={16} />}</button></span></label>)}</div><div className="password-rules">{rules.map(([text, valid]) => <p className={values.next && !valid ? "invalid" : ""} key={text}><Check size={13} />{text}</p>)}{mismatch && <p className="invalid">× Passwords do not match.</p>}</div><FormActions saved={saved} /></form>;
}

function Field({ label, className = "", ...props }: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) { return <label className={`field ${className}`}>{label}<input {...props} /></label>; }

function FormActions({ saved }: { saved: boolean }) { return <div className="form-actions"><button type="reset" className="discard">Discard Changes</button><button type="submit" className="save">{saved ? "Saved ✓" : "Save Changes"}</button></div>; }
