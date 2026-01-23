"use client";

import { useState } from "react";
import { nativeShare, shareLinks } from "@/utils/share";
import { BiShareAlt } from "react-icons/bi";

type Props = {
  title: string;
  relativeURL: string;
};

export default function ShareButton({ title, relativeURL }: Props) {
  const [open, setOpen] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3400";
  const siteUrl = `${baseUrl}${relativeURL}`;

  const handleShare = async () => {
    const usedNative = await nativeShare({
      title,
      text: title,
      url: siteUrl,
    });

    if (!usedNative) {
      setOpen(true);
    }
  };

  return (
    <>
      <button className="relative p-2 hover:bg-gray-100 rounded-full shadow-md bg-white" onClick={handleShare} >
        <BiShareAlt />
      </button>

      {open && (
        <div
          className="share-modal absolute bg-white p-4 rounded shadow-lg top-10 right-0 z-50 flex flex-col space-y-2"
        >
          <button 
            onClick={() => setOpen(!open)} 
            className="py-1 px-2 ms-auto text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition"
          >
            X
          </button>

          <h3 className="text-sm ">Share via</h3>

          <a href={shareLinks.whatsapp(siteUrl, title)} target="_blank" className="hover:text-primary">
            WhatsApp
          </a>

          <a href={shareLinks.facebook(siteUrl)} target="_blank">
            Facebook
          </a>

          <a href={shareLinks.twitter(siteUrl, title)} target="_blank">
            X (Twitter)
          </a>

          <button
            onClick={() => {
              navigator.clipboard.writeText(siteUrl);
              setOpen(false);
            }}
          >
            Copy link
          </button>

          
        </div>
      )}
    </>
  );
}
