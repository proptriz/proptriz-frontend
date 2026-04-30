"use client";

import Header from "@/components/shared/Header";
import { ScreenName } from "@/components/shared/LabelCards";
import { useLanguage } from "@/i18n/LanguageContext";

export default function TermsClient() {
  const { t } = useLanguage();

  return (
    <main 
      className="w-full h-full md:max-w-[650px] mx-auto page-scroll pb-10"
      style={{ background: "#f5f7f9", fontFamily: "'DM Sans', sans-serif" }}
    >
      <Header />

      {/* ── Hero header ─────────────────────────────────────────────────── */}
      <div
        className="px-5 pt-14 pb-5"
        style={{ background: "linear-gradient(160deg,#143d4d 0%,#1e5f74 100%)" }}
      >
        <p className="text-white/75 text-xs mb-1">{t("home_good_day")}</p>
        <h2
          className="text-white text-[22px] font-extrabold leading-tight mb-4"
          style={{ fontFamily: "'Raleway', sans-serif" }}
        >
          {t("terms_screen_title")}
        </h2>
        <p className="text-sm text-gray-100 mb-5">
          {t("terms_last_updated")} <br />
          {t("terms_email_label")}:{" "}
          <a href="mailto:info@proptriz.com" className="underline">
            info@proptriz.com
          </a>
        </p>
      </div>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <TermsSection title={t("terms_s1_title")}>
          <p>{t("terms_s1_body")}</p>
        </TermsSection>

        <TermsSection title={t("terms_s2_title")}>
          <p>{t("terms_s2_body")}</p>
        </TermsSection>

        <TermsSection title={t("terms_s3_title")}>
          <p>{t("terms_s3_body")}</p>
        </TermsSection>

        <TermsSection title={t("terms_s4_title")}>
          <ul className="list-disc ml-6 space-y-2">
            <li>{t("terms_s4_li1")}</li>
            <li>{t("terms_s4_li2")}</li>
            <li>{t("terms_s4_li3")}</li>
            <li>{t("terms_s4_li4")}</li>
          </ul>
        </TermsSection>

        <TermsSection title={t("terms_s5_title")}>
          <p>{t("terms_s5_body")}</p>
        </TermsSection>

        <TermsSection title={t("terms_s6_title")}>
          <p>{t("terms_s6_body")}</p>
        </TermsSection>

        <TermsSection title={t("terms_s7_title")}>
          <p>{t("terms_s7_body")}</p>
        </TermsSection>

        <TermsSection title={t("terms_s8_title")}>
          <p>{t("terms_s8_body")}</p>
        </TermsSection>

        <TermsSection title={t("terms_s9_title")}>
          <p>{t("terms_s9_body")}</p>
        </TermsSection>

        <TermsSection title={t("terms_s10_title")}>
          <p>{t("terms_s10_body")}</p>
        </TermsSection>

        <TermsSection title={t("terms_s11_title")}>
          <p>
            {t("terms_email_label")}:{" "}
            <a href="mailto:info@proptriz.com" className="text-blue-600 underline">
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
      <div className="space-y-4 leading-relaxed text-gray-700 text-lg">{children}</div>
    </section>
  );
}
