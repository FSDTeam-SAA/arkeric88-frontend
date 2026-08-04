import { LegalPage } from "@/components/legal/LegalPage";

export default function Page() {
  return (
    <LegalPage
      title="Terms of Service"
      eyebrow="Legal"
      description="The terms that govern your use of Velari, our emotional-intelligence travel platform, and the personalized journeys we craft around you."
      updated="August 4, 2026"
      sections={[
        {
          id: "acceptance",
          title: "Acceptance of These Terms",
          body: (
            <>
              <p>
                Welcome to Velari. These Terms of Service (&ldquo;Terms&rdquo;) form a binding
                agreement between you and Velari when you access our website, create an account, or
                use our personalized travel planning services.
              </p>
              <p>
                By creating an account, completing the Emotional Journey questionnaire, or otherwise
                using Velari, you confirm that you are at least 18 years old and that you accept
                these Terms. If you do not agree, please discontinue use of the platform.
              </p>
            </>
          ),
        },
        {
          id: "account",
          title: "Your Account &amp; Responsibilities",
          body: (
            <>
              <p>
                To begin your journey you must create an account. You agree to provide accurate and
                up-to-date information, including your name, contact details, and any preferences
                you share through the questionnaire.
              </p>
              <p>You are responsible for:</p>
              <ul>
                <li>Keeping your login credentials confidential and secure.</li>
                <li>
                  All activity that occurs under your account, so please notify us immediately of
                  any unauthorized use.
                </li>
                <li>
                  Ensuring that the information you provide is lawful and does not infringe the
                  rights of any third party.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "recommendations",
          title: "AI-Powered Recommendations",
          body: (
            <>
              <p>
                Velari uses emotional intelligence, zodiac insights, and artificial intelligence to
                suggest destinations, stays, and itineraries that may resonate with how you feel.
                These recommendations are advisory in nature and are not a guarantee of enjoyment,
                suitability, or availability.
              </p>
              <p>
                Travel conditions change frequently. Before booking, we encourage you to verify all
                details — including pricing, availability, visa requirements, and health
                advisories — directly with the relevant airlines, hotels, and destination
                authorities.
              </p>
            </>
          ),
        },
        {
          id: "bookings",
          title: "Bookings &amp; Payments",
          body: (
            <>
              <p>
                When you purchase a journey or itinerary through Velari, your payment is processed
                securely through our payment partners. All prices are shown in the applicable
                currency and may include taxes and fees unless stated otherwise.
              </p>
              <ul>
                <li>
                  You agree to pay all charges associated with your selected journey.
                </li>
                <li>
                  Third-party suppliers (airlines, hotels, tour operators) may apply their own
                  cancellation and change policies, which are outside Velari&rsquo;s control.
                </li>
                <li>
                  Any refunds are handled in accordance with the applicable supplier policy and the
                  payment method used.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "acceptable-use",
          title: "Acceptable Use",
          body: (
            <>
              <p>You agree not to misuse the Velari platform, including by:</p>
              <ul>
                <li>Attempting to access, alter, or disrupt the platform or its data.</li>
                <li>
                  Using the service for unlawful purposes or in ways that violate the rights of
                  others.
                </li>
                <li>
                  Scraping, reselling, or redistributing Velari&rsquo;s content or recommendations
                  without written permission.
                </li>
                <li>
                  Uploading malicious code or interfering with other users&rsquo; ability to enjoy
                  the service.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "ip",
          title: "Intellectual Property",
          body: (
            <>
              <p>
                All content on Velari — including the Velari name and logo, website design,
                recommendations, itineraries, and written materials — is the property of Velari or
                its licensors and is protected by applicable intellectual property laws.
              </p>
              <p>
                We grant you a limited, personal, non-transferable license to use the platform for
                your own journey planning. You may not reproduce or commercialize our content
                without prior written consent.
              </p>
            </>
          ),
        },
        {
          id: "privacy",
          title: "Privacy &amp; Data",
          body: (
            <>
              <p>
                Your privacy matters to us. We collect and use your information to personalize your
                journeys, manage your account, and process payments. We do not sell your personal
                information.
              </p>
              <p>
                Please review our{" "}
                <a href="/privacy-policy">Privacy Policy</a> and{" "}
                <a href="/cookie-policy">Cookie Policy</a> to understand how we handle your data and
                how cookies help us improve your experience.
              </p>
            </>
          ),
        },
        {
          id: "liability",
          title: "Limitation of Liability",
          body: (
            <>
              <p>
                Velari acts as a planning and recommendation platform. To the maximum extent
                permitted by law, we are not liable for indirect, incidental, or consequential
                damages arising from your use of the service, your travels, or any third-party
                provider you engage.
              </p>
              <p>
                While we work hard to keep the platform reliable, we do not guarantee that the
                service will be uninterrupted or error-free at all times.
              </p>
            </>
          ),
        },
        {
          id: "termination",
          title: "Termination",
          body: (
            <>
              <p>
                You may stop using Velari at any time by closing your account. We may suspend or
                terminate your access if we reasonably believe you have breached these Terms or
                misused the platform.
              </p>
              <p>
                Sections concerning liability, intellectual property, and any accrued payment
                obligations will survive termination of your account.
              </p>
            </>
          ),
        },
        {
          id: "changes",
          title: "Changes to These Terms",
          body: (
            <>
              <p>
                We may update these Terms from time to time to reflect changes in our services or
                legal requirements. The &ldquo;Last updated&rdquo; date above will always reflect
                the most recent revision.
              </p>
              <p>
                Material changes will be highlighted on this page, and your continued use of Velari
                after changes take effect constitutes acceptance of the updated Terms.
              </p>
              <div className="legal-callout">
                By using Velari, you acknowledge that travel always carries some risk, and you
                travel with destinations, providers, and experiences you choose based on your own
                judgment. Journey well.
              </div>
            </>
          ),
        },
      ]}
    />
  );
}