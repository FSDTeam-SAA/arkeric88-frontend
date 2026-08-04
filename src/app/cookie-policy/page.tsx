import { LegalPage } from "@/components/legal/LegalPage";

export default function Page() {
  return (
    <LegalPage
      title="Cookie Policy"
      eyebrow="Legal"
      description="How Velari uses cookies and similar technologies to keep your journey secure, remember your preferences, and make your experience smoother."
      updated="August 4, 2026"
      sections={[
        {
          id: "what-are-cookies",
          title: "What Are Cookies?",
          body: (
            <>
              <p>
                Cookies are small text files stored on your device when you visit a website. They
                help the site remember information about your visit — such as whether you are signed
                in — so your experience feels seamless and personal.
              </p>
              <p>
                Alongside cookies, we may use similar technologies such as local storage and
                device identifiers for the same purposes described below.
              </p>
            </>
          ),
        },
        {
          id: "how-we-use",
          title: "How Velari Uses Cookies",
          body: (
            <>
              <p>We use cookies to support the way Velari works for you:</p>
              <ul>
                <li>
                  <strong>Authentication &amp; security.</strong> Keeping you signed in across pages
                  and protecting your account from unauthorized access.
                </li>
                <li>
                  <strong>Session continuity.</strong> Preserving your progress through the
                  Emotional Journey questionnaire so you never lose your answers.
                </li>
                <li>
                  <strong>Preferences.</strong> Remembering your choices, such as your language or
                  display preferences.
                </li>
                <li>
                  <strong>Payments.</strong> Enabling our payment partners to securely process your
                  journey purchases.
                </li>
                <li>
                  <strong>Analytics.</strong> Helping us understand how visitors use Velari so we
                  can improve the experience.
                </li>
              </ul>
              <div className="legal-callout">
                Essential cookies are required for the platform to function — for example, keeping
                you signed in during a payment. These cannot be disabled while using Velari.
              </div>
            </>
          ),
        },
        {
          id: "types",
          title: "Types of Cookies We Use",
          body: (
            <>
              <p>
                <strong>Strictly necessary cookies</strong> are essential for basic functions such
                as login, security, and checkout. The platform cannot work properly without them.
              </p>
              <p>
                <strong>Analytics cookies</strong> let us count visits and see how sections of the
                site are used, in aggregate. This data helps us refine our content and
                recommendations.
              </p>
              <p>
                <strong>Third-party cookies</strong> may be set by trusted partners who provide
                services on our behalf — for instance, payment processing or analytics tools. These
                partners have their own privacy and cookie policies.
              </p>
            </>
          ),
        },
        {
          id: "manage",
          title: "Managing Cookies",
          body: (
            <>
              <p>
                You can control non-essential cookies through your browser settings. Most browsers
                let you block or delete cookies, or prompt you before a new cookie is set.
              </p>
              <ul>
                <li>
                  In most browsers, look for the &ldquo;Privacy&rdquo; or &ldquo;Settings&rdquo;
                  section to review cookie options.
                </li>
                <li>
                  Blocking strictly necessary cookies may prevent you from signing in or completing
                  a purchase on Velari.
                </li>
                <li>
                  Deleting cookies will not affect the security of your account, but you may need to
                  sign in again.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "privacy-relationship",
          title: "Relationship to Our Privacy Policy",
          body: (
            <>
              <p>
                Cookies help us make Velari more personal — from remembering where you left off to
                shaping the journeys we suggest. To learn how we handle the information collected
                about you, please read our{" "}
                <a href="/privacy-policy">Privacy Policy</a>.
              </p>
              <p>
                We do not sell personal information collected through cookies, and we never use
                cookies to track you across unrelated websites for advertising purposes.
              </p>
            </>
          ),
        },
        {
          id: "changes",
          title: "Changes to This Policy",
          body: (
            <>
              <p>
                We may update this Cookie Policy as our platform or the technologies we rely on
                evolve. Any changes will be reflected on this page with an updated date.
              </p>
              <p>
                If you have questions about cookies or your privacy on Velari, we&rsquo;re happy to
                help — reach us anytime at <a href="mailto:help@velari.com">help@velari.com</a>.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}