import { RatingScaleEnum } from "@/types";
import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

type StarRatingSelectorProps = {
  value?: RatingScaleEnum;
  onChange: (rating: RatingScaleEnum) => void;
  size?: number;
};

const STAR_TO_RATING: Record<number, RatingScaleEnum> = {
  1: RatingScaleEnum.DESPAIR,
  2: RatingScaleEnum.SAD,
  3: RatingScaleEnum.OKAY,
  4: RatingScaleEnum.HAPPY,
  5: RatingScaleEnum.DELIGHT
};

const RATING_TO_STAR: Record<RatingScaleEnum, number> = {
  [RatingScaleEnum.DESPAIR]: 1,
  [RatingScaleEnum.SAD]: 2,
  [RatingScaleEnum.OKAY]: 3,
  [RatingScaleEnum.HAPPY]: 4,
  [RatingScaleEnum.DELIGHT]: 5
};

export function StarRatingSelector({
  value = RatingScaleEnum.HAPPY, // ⭐ default = 4 stars
  onChange,
  size = 24
}: StarRatingSelectorProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const activeStars =
    hoveredStar ?? RATING_TO_STAR[value];

  return (
    <div className="flex items-center gap-2 text-yellow-500">
      {Array.from({ length: 5 }).map((_, index) => {
        const star = index + 1;
        const isActive = star <= activeStars;

        return (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(null)}
            onClick={() => onChange(STAR_TO_RATING[star])}
            className="cursor-pointer focus:outline-none"
            aria-label={`Rate ${star} star`}
          >
            {isActive ? (
              <FaStar size={size} />
            ) : (
              <FaRegStar size={size} />
            )}
          </button>
        );
      })}
    </div>
  );
}
