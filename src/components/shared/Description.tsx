"use client";

import { useMemo, useState } from "react";

interface PropertyDescriptionProps {
  description?: string;
  wordLimit?: number;
}

export default function PropertyDescription({
  description = "",
  wordLimit = 30,
}: PropertyDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  const { previewText, hasMore } = useMemo(() => {
    const words = description.trim().split(/\s+/);

    if (words.length <= wordLimit) {
      return {
        previewText: description,
        hasMore: false,
      };
    }

    return {
      previewText: words.slice(0, wordLimit).join(" "),
      hasMore: true,
    };
  }, [description, wordLimit]);

  return (
    <div className="relative">
      <div
        className={`
          w-full
          rounded-md
          border
          border-gray-300
          bg-gray-100
          p-3
          pb-10
          text-md
          text-gray-500
          whitespace-pre-wrap
          leading-relaxed
          cursor-text
          ${expanded ? "" : "max-h-40 overflow-hidden"} // 4 lines approx
        `}
      >
        {expanded ? description : previewText}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="
            absolute
            bottom-2
            right-3
            text-xs
            font-medium
            text-primary
            hover:underline
            bg-gray-50
            px-1
          "
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
}
