import Link from "next/link";
import { ArrowLeft, CalendarDays, Mail } from "lucide-react";

export type LegalSection = {
  id: string;
  title: string;
  body: React.ReactNode;
};

type LegalPageProps = {
  title: string;
  eyebrow: string;
  description: string;
  updated: string;
  sections: LegalSection[];
};

export function LegalPage({ title, eyebrow, description, updated, sections }: LegalPageProps) {
  return (
    <main className="legal-page">
      <div className="legal-hero">
        <Link href="/" className="legal-back">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="legal-hero-shade" />
        <div className="legal-hero-content">
          <p className="legal-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="legal-hero-desc">{description}</p>
          <span className="legal-updated">
            <CalendarDays size={14} /> Last updated: {updated}
          </span>
        </div>
      </div>

      <div className="legal-layout">
        <aside className="legal-toc" aria-label="On this page">
          <div className="legal-toc-inner">
            <p>On this page</p>
            <ol>
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ol>
            <Link href="/" className="legal-toc-home">
              <ArrowLeft size={14} /> Return to Velari
            </Link>
          </div>
        </aside>

        <article className="legal-article">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="legal-section">
              <h2>{section.title}</h2>
              <div className="legal-section-body">{section.body}</div>
            </section>
          ))}
        </article>
      </div>

      <footer className="legal-foot">
        <span>
          Questions about this policy? Reach us anytime at{" "}
          <a href="mailto:help@velari.com">
            <Mail size={14} /> help@velari.com
          </a>
        </span>
      </footer>
    </main>
  );
}