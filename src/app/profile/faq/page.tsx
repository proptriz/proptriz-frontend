'use client';

import { BackButton } from "@/components/shared/buttons";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import Header from "@/components/shared/Header";

export default function FAQSupport() {
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<"buyer" | "agent">("buyer");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (item: string) => {
    setOpenAccordion(openAccordion === item ? null : item);
  };

  const contactLinks = [
    { textKey: "faq_visit_website" as const, icon: "🌐", link: "#" },
    { textKey: "faq_email_us"      as const, icon: "✉️", link: "mailto:info@proptriz.com" },
    { textKey: "faq_privacy"       as const, icon: "📄", link: "/privacy-policy" },
    { textKey: "faq_terms"         as const, icon: "📄", link: "/terms-of-service" },
  ];

  const tabs = [
    { key: "buyer" as const,  label: t("faq_tab_buyer") },
    { key: "agent" as const,  label: t("faq_tab_agent") },
  ];

  const faqItems = selectedTab === "buyer"
    ? [
        { question: t("faq_b_q1"), content: t("faq_b_a1") },
        { question: t("faq_b_q2"), content: t("faq_b_a2") },
      ]
    : [
        { question: t("faq_a_q1"), content: t("faq_a_a1") },
        { question: t("faq_a_q2"), content: t("faq_a_a2") },
      ];

  return (
    <main 
      className="w-full h-full md:max-w-[650px] mx-auto page-scroll pb-10"
      style={{ background: "#f5f7f9", fontFamily: "'DM Sans', sans-serif" }}
    >
      <Header />

      {/* ── Hero header ─────────────────────────────────────────────────── */}
      <div
        className="px-5 pt-14 pb-5 mb-8"
        style={{ background: "linear-gradient(160deg,#143d4d 0%,#1e5f74 100%)" }}
      >
        <p className="text-white/75 text-xs mb-1">{t("home_good_day")}</p>
        <h2
          className="text-white text-[22px] font-extrabold leading-tight mb-4"
          style={{ fontFamily: "'Raleway', sans-serif" }}
        >
          {t("faq_title_bold")}{" "}
          <span className="font-normal">{t("faq_title_light")}</span>
        </h2>
        <p className="text-sm text-gray-100 mb-5">
          {t("faq_subtitle")}
        </p>
      </div>


      <div className="w-full max-w-md px-7 relative mb-7">
        {/* Contact Links */}
        <div className="space-y-4 mb-4">
          {contactLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              className="flex items-center space-x-3 pb-2 text-green-500 cursor-pointer
                         border-b border-gray-300 hover:border-gray-700 w-full group"
            >
              <span className="text-2xl bg-green p-3 rounded-full">{item.icon}</span>
              <span className="text-gray-800 hover:text-green group">
                {t(item.textKey)}
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="md:mx-16">
        {/* Tab Navigation */}
        <div className="flex justify-around items-center bg-gray-300 rounded-full mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`w-1/2 py-2 rounded-full text-center ${
                selectedTab === tab.key ? "bg-green text-white" : "text-gray-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqItems.map((item) => (
            <div key={item.question}>
              <div
                className="flex justify-between items-center cursor-pointer
                           text-gray-700 font-semibold"
                onClick={() => toggleAccordion(item.question)}
              >
                {item.question}
                <span>{openAccordion === item.question ? "−" : "+"}</span>
              </div>
              {openAccordion === item.question && (
                <div className="mt-2 card-bg p-3 rounded-xl">{item.content}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
