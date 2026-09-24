import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";

const sections: LegalSection[] = [
  {
    id: "what-are-cookies",
    title: "1. What Are Cookies?",
    body: (
      <>
        <p>Cookies are small text files placed on your device when you visit a website. Cookies and similar technologies help websites function properly, remember user preferences, understand how visitors interact with a website, and, where applicable, support analytics and marketing activities.</p>
        <p>Cookies may be:</p>
        <ul>
          <li>Session cookies, which are deleted when you close your browser; or</li>
          <li>Persistent cookies, which remain on your device for a defined period or until you delete them.</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-velari-uses-cookies",
    title: "2. How Velari™ Uses Cookies",
    body: (
      <>
        <p>Velari™ may use cookies and similar technologies for the following purposes:</p>
        <h3>Strictly Necessary Cookies</h3>
        <p>These cookies are required for Velari™ to operate properly. They may support functions such as account login, authentication, security, session management, form completion, and protecting the website against fraudulent or unauthorized activity.</p>
        <p>Because these cookies are necessary for the website to function, they generally cannot be disabled through our cookie preference tools.</p>
        <h3>Functional Cookies</h3>
        <p>These cookies allow Velari™ to remember choices you make and provide a more personalized experience. This may include preferences related to your account, travel interests, assessment activity, or website settings.</p>
        <h3>Analytics and Performance Cookies</h3>
        <p>These cookies help us understand how visitors use Velari™, including which pages are visited, how users navigate the website, how long users interact with certain features, and whether errors occur.</p>
        <p>We may use this information to improve the Emotional Travel™ Assessment, recommendation experience, website performance, and overall customer experience.</p>
        <h3>Advertising and Marketing Cookies</h3>
        <p>If used, these cookies may help us measure marketing campaigns, understand how visitors discovered Velari™, and deliver more relevant advertising on Velari™ or third-party platforms.</p>
        <p>Velari™ will request consent for non-essential advertising or marketing cookies where required by law.</p>
      </>
    ),
  },
  {
    id: "similar-technologies",
    title: "3. Similar Technologies",
    body: (
      <>
        <p>In addition to cookies, Velari™ may use similar technologies such as pixels, tags, local storage, software development kits, or other tracking technologies.</p>
        <p>These technologies may be used for purposes such as website functionality, analytics, security, performance measurement, and marketing attribution.</p>
        <p>References to &quot;cookies&quot; in this policy generally include these similar technologies.</p>
      </>
    ),
  },
  {
    id: "cookies-and-the-emotional-travel-experience",
    title: "4. Cookies and the Emotional Travel™ Experience",
    body: (
      <>
        <p>Velari™ may use cookies or related technologies to maintain your session and support your interaction with the Emotional Travel™ Assessment and other personalized features.</p>
        <p>Your assessment responses, Emotional Travel™ profile, travel preferences, account information, or other personal information are handled in accordance with our <a href="/privacy-policy">Privacy Policy</a>.</p>
        <p>Cookies themselves are not intended to provide medical, psychological, or diagnostic assessments.</p>
      </>
    ),
  },
  {
    id: "third-party-services",
    title: "5. Third-Party Services",
    body: (
      <>
        <p>Velari™ may use third-party service providers to operate, analyze, secure, or improve our website.</p>
        <p>These providers may place or access cookies or similar technologies on your device when permitted.</p>
        <p>Depending on the technologies implemented on our website, these services may include providers related to:</p>
        <ul>
          <li>Website hosting and infrastructure</li>
          <li>Account authentication and security</li>
          <li>Website analytics</li>
          <li>Payment processing</li>
          <li>Customer communications</li>
          <li>Advertising and marketing measurement</li>
          <li>Performance monitoring</li>
        </ul>
        <p>Third-party providers process information according to their own privacy and cookie policies in addition to any contractual obligations they have to Velari™.</p>
      </>
    ),
  },
  {
    id: "your-cookie-choices",
    title: "6. Your Cookie Choices",
    body: (
      <>
        <p>When you visit Velari™, you may be provided with options to accept, reject, or manage certain categories of non-essential cookies.</p>
        <p>You may change your preferences through the cookie settings or consent management tool available on our website, where provided.</p>
        <p>Strictly necessary cookies may continue to operate because they are required for essential website functionality.</p>
        <p>You may also control cookies through your browser settings. Most browsers allow you to view, delete, block, or restrict cookies.</p>
        <p>Disabling certain cookies may affect the functionality or personalization of the Velari™ experience.</p>
      </>
    ),
  },
  {
    id: "do-not-track-and-global-privacy-control",
    title: "7. Do Not Track and Global Privacy Control",
    body: (
      <>
        <p>Some browsers and devices offer privacy signals such as &quot;Do Not Track&quot; or Global Privacy Control (&quot;GPC&quot;).</p>
        <p>Where applicable law requires Velari™ to recognize a legally valid browser-based privacy preference signal, we will process that signal in accordance with applicable law.</p>
        <p>Browser-based Do Not Track signals are not currently governed by a single industry standard, and our response to such signals may vary unless required by law.</p>
      </>
    ),
  },
  {
    id: "selling-or-sharing-personal-information",
    title: "8. Selling or Sharing Personal Information",
    body: (
      <>
        <p>Velari™ does not sell personal information in exchange for money.</p>
        <p>Certain advertising or analytics technologies may be considered a &quot;sale,&quot; &quot;sharing,&quot; or use of personal information for targeted advertising under some U.S. state privacy laws, depending on how those technologies are configured.</p>
        <p>Where legally required, Velari™ will provide users with the ability to opt out of those activities.</p>
      </>
    ),
  },
  {
    id: "how-long-cookies-remain-on-your-device",
    title: "9. How Long Cookies Remain on Your Device",
    body: (
      <>
        <p>The length of time a cookie remains on your device depends on the type of cookie.</p>
        <p>Session cookies generally expire when your browser session ends.</p>
        <p>Persistent cookies may remain for a longer period based on their intended purpose, unless you delete them sooner through your browser or device settings.</p>
        <p>Velari™ seeks to retain cookies only for as long as reasonably necessary for their intended purpose.</p>
      </>
    ),
  },
  {
    id: "updates-to-this-cookie-policy",
    title: "10. Updates to This Cookie Policy",
    body: (
      <>
        <p>We may update this Cookie Policy periodically as Velari™ evolves, new technologies are introduced, or legal requirements change.</p>
        <p>When we make material changes, we may update the effective date at the top of this policy and provide additional notice where appropriate.</p>
        <p>We encourage you to review this policy periodically.</p>
      </>
    ),
  },
  {
    id: "contact-us",
    title: "11. Contact Us",
    body: (
      <>
        <p>If you have questions about this Cookie Policy, our privacy practices, or the technologies used on Velari™, please contact us:</p>
        <p>Velari™</p>
        <p>Email: <a href="mailto:hello@velaritravel.com">hello@velaritravel.com</a></p>
        <p>Phone: (830) 433-7323</p>
        <p>For additional information about how Velari™ collects, uses, stores, and protects personal information, please review our <a href="/privacy-policy">Privacy Policy</a>.</p>
      </>
    ),
  },
];

export default function CookiePolicyContainer() {
  return (
    <LegalPage
      title="Cookie Policy"
      eyebrow="Legal"
      description="How Velari™ uses cookies and similar technologies."
      updated="September 20, 2026"
      dateLabel="Effective Date"
      stickyHero
      contactEmail="hello@velaritravel.com"
      contactLabel="this Cookie Policy"
      introduction={
        <>
          <p>This Cookie Policy explains how Velari™ (&quot;Velari™,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) uses cookies and similar technologies when you visit or use velaritravel.com and related Velari™ services.</p>
          <p>This Cookie Policy should be read together with our <a href="/privacy-policy">Privacy Policy</a> and <a href="/terms-of-service">Terms of Service</a>.</p>
        </>
      }
      sections={sections}
    />
  );
}
