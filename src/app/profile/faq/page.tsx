'use client';

import { useState } from "react";

export default function FAQSupport() {
  const [selectedTab, setSelectedTab] = useState("Buyer");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (item: string) => {
    setOpenAccordion(openAccordion === item ? null : item);
  };

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center p-4">
      <div className="bg-gray-100 rounded-xl shadow-lg w-full max-w-md px-6 py-8 relative">
        {/* Back button */}
        <div className="absolute top-4 left-4 cursor-pointer">
          <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl">
            &larr;
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-1 text-gray-700">
          FAQ <span className="font-normal">& Support</span>
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Find answer to your problem using this app.
        </p>

        {/* Contact Links */}
        <div className="space-y-4 mb-4">
          {[
            { text: "Visit our website", icon: "🌐" },
            { text: "Email us", icon: "✉️" },
            { text: "Terms of service", icon: "📄" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-3 text-green-500"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-gray-700 hover:underline cursor-pointer">
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder='Try find "how to"'
            className="w-full px-4 py-2 rounded-full bg-gray-50 border text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <div className="absolute top-2 right-4 text-gray-400 text-xl">🔍</div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-around items-center bg-gray-300 rounded-full mb-6">
          {["Buyer", "Estate Agent"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`w-1/2 py-2 rounded-full text-center ${
                selectedTab === tab
                  ? "bg-green-500 text-white"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {/* FAQ Items */}
          {[
            { question: "What is ERH?", content: "Lorem ipsum dolor sit amet..." },
            {
              question: "Why choose buy in Rise?",
              content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
            },
          ].map((item) => (
            <div key={item.question}>
              <div
                className="flex justify-between items-center cursor-pointer text-gray-700 font-semibold"
                onClick={() => toggleAccordion(item.question)}
              >
                {item.question}
                <span>{openAccordion === item.question ? "−" : "+"}</span>
              </div>
              {openAccordion === item.question && (
                <div className="mt-2 text-gray-600 bg-gray-100 p-3 rounded">
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
