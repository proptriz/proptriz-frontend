export const HorizontalPropertyCardSkeleton = () => {
  return (
    <div className="flex items-center bg-white p-3 rounded-2xl shadow-md space-x-4 min-w-[70%] md:min-w-[40%] max-w-lg animate-pulse">
      
      {/* Image */}
      <div className="relative w-32 h-32 rounded-lg bg-gray-200">
        <div className="absolute top-2 left-2 h-5 w-20 bg-gray-300 rounded-lg" />
        <div className="absolute bottom-2 left-2 h-5 w-24 bg-gray-300 rounded-lg" />
      </div>

      {/* Details */}
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-3 w-full bg-gray-200 rounded" />

        <div className="flex items-center mt-2">
          <div className="h-5 w-28 bg-gray-200 rounded" />
          <div className="ms-auto h-5 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};
