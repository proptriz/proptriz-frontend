'use client';

import { BackButton } from "@/components/shared/buttons";
import SearchBar from "@/components/shared/SearchBar";
import { useState } from "react";

export default function FAQSupport() {
  const [selectedTab, setSelectedTab] = useState("Buyer");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (item: string) => {
    setOpenAccordion(openAccordion === item ? null : item);
  };

  return (
    <div className="p-6 pb-16">
      {/* Back button */}
      <BackButton />
      <div className="w-full max-w-md px-7 relative mb-7">       

        {/* Title */}
        <div className="mx-auto w-[60%] py-10">
          <h1 className="mb-1 text-3xl font-bold">
            FAQ <span className="font-normal">& Support</span>
          </h1>
          <h4 className="">
            Find answer to your problem using this app.
          </h4>
        </div>
        
        {/* Contact Links */}
        <div className="space-y-4 mb-4">
          {[
            { text: "Visit our website", icon: "🌐", link: "#" },
            { text: "Email us", icon: "✉️", link: "#" },
            { text: "Terms of service", icon: "📄", link: "#" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-3 pb-2 text-green-500 cursor-pointer border-b border-gray-300 hover:border-gray-700 w-full group"
            >
              <span className="text-2xl bg-green p-3 rounded-full">{item.icon}</span>
              <span className="text-gray-800 hover:text-green group">
                {item.text} 
                {/* <div className="flex-grow h-px bg-gray-300 "></div> */}
              </span>
            </div>
          ))}
        </div>        
      </div>
      
        
        <div className="md:mx-16">
          {/* Search Input */}
          <div className="mb-4 mx-auto w-full">
            <SearchBar />
          </div> 

          {/* Tab Navigation */}
          <div className="flex justify-around items-center bg-gray-300 rounded-full mb-6">
            {["Buyer", "Estate Agent"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`w-1/2 py-2 rounded-full text-center ${
                  selectedTab === tab
                    ? "bg-green text-white"
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
                  <div className="mt-2 card-bg p-3 rounded-xl">
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
