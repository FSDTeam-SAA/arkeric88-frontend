import { LegalPage } from "@/components/legal/LegalPage";

export default function Page() {
  return (
    <LegalPage
      title="Privacy Policy"
      eyebrow="Legal"
      description="How Velari collects, uses, and protects the personal information you share while crafting journeys designed around you."
      updated="August 4, 2026"
      sections={[
        {
          id: "information-we-collect",
          title: "Information We Collect",
          body: (
            <>
              <p>
                To personalize your journeys, we collect information you provide directly — such as
                your name, contact details, and the preferences you share through the Emotional
                Journey questionnaire.
              </p>
              <p>
                When you make a purchase, our payment partners process your payment details. We do
                not store full card numbers on our servers.
              </p>
            </>
          ),
        },
        {
          id: "how-we-use",
          title: "How We Use Your Information",
          body: (
            <>
              <p>We use your information to:</p>
              <ul>
                <li>Personalize destinations, stays, and itineraries based on how you feel.</li>
                <li>Manage your account and keep you signed in securely.</li>
                <li>Process payments and fulfill your bookings.</li>
                <li>Improve Velari&rsquo;s recommendations and overall experience.</li>
                <li>Communicate with you about your journeys when necessary.</li>
              </ul>
            </>
          ),
        },
        {
          id: "sharing",
          title: "Sharing &amp; Selling",
          body: (
            <>
              <p>
                We do <strong>not</strong> sell your personal information. We only share data with
                trusted partners who help us operate the platform — such as payment processors and
                travel suppliers — and only to the extent needed to provide the service.
              </p>
            </>
          ),
        },
        {
          id: "security",
          title: "How We Protect Your Data",
          body: (
            <>
              <p>
                We use industry-standard safeguards to protect your information, including
                encrypted connections and access controls. While no method is perfectly secure, we
                work continuously to keep your data safe.
              </p>
            </>
          ),
        },
        {
          id: "your-rights",
          title: "Your Rights",
          body: (
            <>
              <p>
                You may request access to, correction of, or deletion of your personal information
                at any time. You can also ask us to limit how we use your data.
              </p>
              <p>
                To make a request, contact us at{" "}
                <a href="mailto:help@velari.com">help@velari.com</a> and we will respond promptly.
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
                We may update this Privacy Policy from time to time. The latest version will always
                be available on this page with an updated date, and we encourage you to review it
                periodically.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}