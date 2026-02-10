export const ReviewCardSkeleton: React.FC<{
  showPropDetails?: boolean;
}> = ({ showPropDetails = false }) => {
  return (
    <div className="border border-[#DCDFD9] rounded-2xl animate-pulse">
      
      {/* Property details skeleton */}
      {showPropDetails && (
        <div className="p-3 rounded-lg flex items-center h-16 bg-white">
          <div className="w-12 h-12 rounded-lg bg-gray-200" />

          <div className="ml-3 space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-3 card-bg p-3 rounded-xl mt-3">
        <div className="flex items-start space-x-3">
          
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-200" />

          <div className="flex-1 space-y-2">
            {/* Username + rating */}
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 bg-gray-200 rounded"
                  />
                ))}
              </div>
            </div>

            {/* Comment lines */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
            </div>

            {/* Image placeholder */}
            <div className="flex space-x-3 mt-2">
              <div className="w-16 h-16 rounded-lg bg-gray-200" />
            </div>

            {/* Footer */}
            <div className="flex items-center mt-4">
              <div className="h-3 bg-gray-200 rounded w-24" />
              <div className="ms-auto h-3 bg-gray-200 rounded w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
