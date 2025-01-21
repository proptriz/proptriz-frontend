import React from "react";

interface TagProps {
  tags: string[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
}

const TagSelector: React.FC<TagProps> = ({ tags, selectedTags, onToggle }) => {
  return (
    <div className="flex flex-wrap gap-3 my-4">
      {tags.map((tag) => (
        <button
          key={tag}
          className={`px-4 py-2 rounded-md shadow-md ${
            selectedTags.includes(tag)
              ? "bg-green text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => onToggle(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagSelector;
