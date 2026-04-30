import type { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | Proptriz",
  description:
    "Read the Proptriz Privacy Policy explaining how we collect, use, and protect your personal data in compliance with NDPR and international standards.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyClient />;
}
