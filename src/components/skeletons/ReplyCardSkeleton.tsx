export const ReplyCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col space-y-3 card-bg p-3 text-sm rounded-xl mt-5 animate-pulse">
      <div className="flex items-start space-x-3">
        
        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-gray-200" />

        <div className="flex-1 space-y-2">
          {/* Sender */}
          <div className="h-4 bg-gray-200 rounded w-32" />

          {/* Comment */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-4/5" />
          </div>

          {/* Date */}
          <div className="h-3 bg-gray-200 rounded w-24 mt-3" />
        </div>
      </div>
    </div>
  );
};
