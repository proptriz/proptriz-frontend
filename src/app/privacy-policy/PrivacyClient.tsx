"use client";

import { BackButton } from "@/components/shared/BackButton";
import { BrandLogo } from "@/components/shared/BrandLogo";
import Header from "@/components/shared/Header";
import NavMenu from "@/components/shared/NavMenu";
import { useLanguage } from "@/i18n/LanguageContext";
import { interpolate } from "@/i18n/translations";

export default function PrivacyClient() {
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
          {t("privacy_screen_title")}
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
        <PolicySection title={t("privacy_s1_title")}>
          <p>{t("privacy_s1_body1")}</p>
          <p className="mt-4">{t("privacy_s1_body2")}</p>
        </PolicySection>

        <PolicySection title={t("privacy_s2_title")}>
          <ul className="list-disc ml-6 space-y-2">
            <li>{t("privacy_s2_li1")}</li>
            <li>{t("privacy_s2_li2")}</li>
            <li>{t("privacy_s2_li3")}</li>
            <li>{t("privacy_s2_li4")}</li>
          </ul>
        </PolicySection>

        <PolicySection title={t("privacy_s3_title")}>
          <h3 className="font-semibold mt-4">{t("privacy_s3_h_account")}</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>{t("privacy_s3_account_li1")}</li>
            <li>{t("privacy_s3_account_li2")}</li>
            <li>{t("privacy_s3_account_li3")}</li>
            <li>{t("privacy_s3_account_li4")}</li>
          </ul>

          <h3 className="font-semibold mt-6">{t("privacy_s3_h_listing")}</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>{t("privacy_s3_listing_li1")}</li>
            <li>{t("privacy_s3_listing_li2")}</li>
            <li>{t("privacy_s3_listing_li3")}</li>
          </ul>

          <h3 className="font-semibold mt-6">{t("privacy_s3_h_tech")}</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>{t("privacy_s3_tech_li1")}</li>
            <li>{t("privacy_s3_tech_li2")}</li>
            <li>{t("privacy_s3_tech_li3")}</li>
          </ul>
        </PolicySection>

        <PolicySection title={t("privacy_s4_title")}>
          <ul className="list-disc ml-6 space-y-2">
            <li>{t("privacy_s4_li1")}</li>
            <li>{t("privacy_s4_li2")}</li>
            <li>{t("privacy_s4_li3")}</li>
            <li>{t("privacy_s4_li4")}</li>
            <li>{t("privacy_s4_li5")}</li>
          </ul>
        </PolicySection>

        <PolicySection title={t("privacy_s5_title")}>
          <p>{t("privacy_s5_intro")}</p>
          <ul className="list-disc ml-6 mt-3 space-y-2">
            <li>{t("privacy_s5_li1")}</li>
            <li>{t("privacy_s5_li2")}</li>
            <li>{t("privacy_s5_li3")}</li>
            <li>{t("privacy_s5_li4")}</li>
          </ul>
        </PolicySection>

        <PolicySection title={t("privacy_s6_title")}>
          <p>{t("privacy_s6_body")}</p>
        </PolicySection>

        <PolicySection title={t("privacy_s7_title")}>
          <ul className="list-disc ml-6 space-y-2">
            <li>{t("privacy_s7_li1")}</li>
            <li>{t("privacy_s7_li2")}</li>
            <li>{t("privacy_s7_li3")}</li>
            <li>{t("privacy_s7_li4")}</li>
            <li>{t("privacy_s7_li5")}</li>
          </ul>
        </PolicySection>

        <PolicySection title={t("privacy_s8_title")}>
          <p>{t("privacy_s8_body")}</p>
        </PolicySection>

        <PolicySection title={t("privacy_s9_title")}>
          <p>
            {t("terms_email_label")}:{" "}
            <a href="mailto:info@proptriz.com" className="text-blue-600 underline">
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
      <div className="space-y-4 leading-relaxed text-gray-700 text-lg">{children}</div>
    </section>
  );
}
