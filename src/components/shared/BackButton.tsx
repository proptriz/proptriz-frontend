"use client";

import { useRouter } from "next/navigation";

export const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    // window.history.length <= 1 means no previous page exists in session
    if (window.history.length <= 1) {
      router.push("/");
    } else {
      router.back();
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="w-9 h-9 rounded-full flex items-center justify-center
                 text-white text-sm cursor-pointer transition-colors
                 bg-white/15 border border-white/25 hover:bg-white/25"
    >
      ←
    </button>
  );
};
