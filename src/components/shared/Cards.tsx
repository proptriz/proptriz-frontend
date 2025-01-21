import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ReviewCardProps } from "@/definitions";

// Enable the relativeTime plugin
dayjs.extend(relativeTime);

export const ReviewCard: React.FC<ReviewCardProps> = ({
    id,
    reviewer,
    text,
    ratings,
    image,
    reviewImages = [],
    reviewDate,
}) => {
    const [relativeTimeString, setRelativeTimeString] = useState("");

    useEffect(() => {
        // Update the relative time string every minute
        const updateRelativeTime = () => {
        setRelativeTimeString(dayjs(reviewDate).fromNow());
        };

        updateRelativeTime();
        const interval = setInterval(updateRelativeTime, 60000); // Update every 60 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [reviewDate]);

    return (
        <div className="flex flex-col space-y-3 card-bg p-3 text-sm rounded-xl mt-5" key={id}>
            <div className="flex items-start space-x-3">
                <img
                src={image}
                alt="Reviewer"
                className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold">{reviewer}</h3>
                        <div className="flex text-yellow-500">
                            {Array.from({ length: 5 }).map((_, index) =>
                                index < Math.floor(ratings) ? (
                                <FaStar key={index} />
                                ) : (
                                <FaRegStar key={index} />
                                )
                            )}
                        </div>
                    </div>
                    <p className="text-sm text-gray-500">{text}</p>

                    {/* Review Images */}
                    {reviewImages.length > 0 && (
                        <div className="flex space-x-3 mt-2">
                            {reviewImages.slice(0, 3).map((img, idx) => (
                                <img
                                key={idx}
                                src={img}
                                alt={`Review Image ${idx + 1}`}
                                className="w-16 h-16 rounded-lg object-cover"
                                />
                            ))}
                        </div>
                    )}

                    {/* Date-Time */}
                    <div className="text-xs text-gray-400 mt-4">
                        Reviewed {relativeTimeString}
                    </div>
                </div>
            </div>
            
            
        </div>
    );
};
