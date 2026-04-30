import type { Metadata } from "next";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
  title: "Terms of Service | Proptriz",
  description:
    "Read the Proptriz Terms of Service governing access and use of our property listing platform.",
};

export default function TermsPage() {
  return <TermsClient />;
}
