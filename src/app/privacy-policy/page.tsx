import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Proptriz",
  description:
    "Read the Proptriz Privacy Policy explaining how we collect, use, and protect your personal data in compliance with NDPR and international standards.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <ScreenName title="Privacy Policy" />
      
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-6">Proptriz - Privacy Policy</h1>

        <p className="text-sm text-gray-500 mb-8">
          Last Updated: 16/02/2026 <br />
          Email Address: info@proptriz.com
        </p>

        <PolicySection title="1. Introduction">
          <p>
            Proptriz Hub (“Proptriz,” “we,” “our,” or “us”) is committed to
            protecting your personal data. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you use
            our mobile application, website, and related services.
          </p>
          <p className="mt-4">
            This Policy complies with the Nigeria Data Protection Regulation
            (NDPR) and international data protection standards.
          </p>
        </PolicySection>

        <PolicySection title="2. Lawful Basis for Processing">
          <ul className="list-disc ml-6 space-y-2">
            <li>Consent provided by you</li>
            <li>Performance of a contract</li>
            <li>Compliance with legal obligations</li>
            <li>Legitimate business interests</li>
          </ul>
        </PolicySection>

        <PolicySection title="3. Information We Collect">
          <h3 className="font-semibold mt-4">Account Information</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>Full name</li>
            <li>Email address</li>
            <li>Username</li>
            <li>Phone/WhatsApp number</li>
          </ul>

          <h3 className="font-semibold mt-6">Property Listing Information</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>Property title, category, location</li>
            <li>Price and description</li>
            <li>Images and media uploads</li>
          </ul>

          <h3 className="font-semibold mt-6">Technical Information</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>Device type and OS</li>
            <li>IP address</li>
            <li>App usage analytics</li>
          </ul>
        </PolicySection>

        <PolicySection title="4. How We Use Your Data">
          <ul className="list-disc ml-6 space-y-2">
            <li>Provide and manage accounts</li>
            <li>Enable property listings and searches</li>
            <li>Facilitate communication between users</li>
            <li>Improve platform performance</li>
            <li>Prevent fraud and abuse</li>
          </ul>
        </PolicySection>

        <PolicySection title="5. Data Sharing">
          <p>
            We do not sell your personal data. We may share information with:
          </p>
          <ul className="list-disc ml-6 mt-3 space-y-2">
            <li>Interested property seekers (contact details only)</li>
            <li>Cloud hosting and analytics providers</li>
            <li>Payment processors (if applicable)</li>
            <li>Authorities where required by law</li>
          </ul>
        </PolicySection>

        <PolicySection title="6. Data Retention">
          <p>
            We retain personal data only as long as necessary to fulfill
            legitimate business or legal purposes. Data is securely deleted or
            anonymized when no longer required.
          </p>
        </PolicySection>

        <PolicySection title="7. Your Rights">
          <ul className="list-disc ml-6 space-y-2">
            <li>Access your personal data</li>
            <li>Request correction</li>
            <li>Request deletion</li>
            <li>Withdraw consent</li>
            <li>Lodge complaints with relevant authorities</li>
          </ul>
        </PolicySection>

        <PolicySection title="8. Security">
          <p>
            We implement technical and organizational safeguards including
            encryption, secure hosting, and access controls. However, no system
            is completely secure.
          </p>
        </PolicySection>

        <PolicySection title="9. Contact Us">
          <p>
            Email:{" "}
            <a
              href="mailto:info@proptriz.com"
              className="text-blue-600 underline"
            >
              info@proptriz.com
            </a>
          </p>
        </PolicySection>
      </section>
    </main>
  );
}

function PolicySection({
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
