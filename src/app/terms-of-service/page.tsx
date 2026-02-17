import type { Metadata } from "next";
import { ScreenName } from "@/components/shared/LabelCards";

export const metadata: Metadata = {
  title: "Terms of Service | Proptriz",
  description:
    "Read the Proptriz Terms of Service governing access and use of our property listing platform.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <ScreenName title="Terms of Service" />

      <section className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-6">Proptriz - Terms of Service</h1>

        <p className="text-sm text-gray-500 mb-8">
          Last Updated: 16/02/2026 <br />
          Email Address: info@proptriz.com
        </p>

        <TermsSection title="1. Acceptance of Terms">
          <p>
            By accessing or using Proptriz, you agree to be bound by these
            Terms. If you do not agree, you must discontinue use immediately.
          </p>
        </TermsSection>

        <TermsSection title="2. Eligibility">
          <p>
            You must be at least 18 years old and legally capable of entering
            into binding agreements.
          </p>
        </TermsSection>

        <TermsSection title="3. Platform Nature">
          <p>
            Proptriz is a property listing and discovery marketplace. We do not
            own or manage listed properties and do not guarantee transaction
            outcomes.
          </p>
        </TermsSection>

        <TermsSection title="4. User Responsibilities">
          <ul className="list-disc ml-6 space-y-2">
            <li>Provide accurate information</li>
            <li>Only list properties you are authorized to list</li>
            <li>Do not post fraudulent or misleading content</li>
            <li>Do not harass or abuse other users</li>
          </ul>
        </TermsSection>

        <TermsSection title="5. Content License">
          <p>
            By posting content, you grant Proptriz a non-exclusive,
            royalty-free, worldwide license to use, display, and promote such
            content for operating the platform.
          </p>
        </TermsSection>

        <TermsSection title="6. Fees and Payments">
          <p>
            If paid features are introduced, fees will be disclosed clearly.
            Payments may be processed via approved third-party providers.
          </p>
        </TermsSection>

        <TermsSection title="7. Disclaimers">
          <p>
            The platform is provided “as is” without warranties of any kind.
            Proptriz is not responsible for user disputes or transaction
            outcomes.
          </p>
        </TermsSection>

        <TermsSection title="8. Limitation of Liability">
          <p>
            To the fullest extent permitted by law, Proptriz shall not be liable
            for indirect or consequential damages arising from use of the
            platform.
          </p>
        </TermsSection>

        <TermsSection title="9. Termination">
          <p>
            We may suspend or terminate accounts that violate these Terms. You
            may delete your account at any time.
          </p>
        </TermsSection>

        <TermsSection title="10. Governing Law">
          <p>
            These Terms are governed by the laws of the Federal Republic of
            Nigeria.
          </p>
        </TermsSection>

        <TermsSection title="11. Contact">
          <p>
            Email:{" "}
            <a
              href="mailto:info@proptriz.com"
              className="text-blue-600 underline"
            >
              info@proptriz.com
            </a>
          </p>
        </TermsSection>
      </section>
    </main>
  );
}

function TermsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4 leading-relaxed text-gray-700">
        {children}
      </div>
    </section>
  );
}
