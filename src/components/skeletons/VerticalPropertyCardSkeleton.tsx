export const VerticalPropertyCardSkeleton = () => {
  return (
    <div className="bg-white p-3 rounded-2xl shadow-md animate-pulse">
      {/* Image */}
      <div className="w-full h-48 rounded-xl bg-gray-200 relative">
        <div className="absolute top-2 left-2 h-5 w-20 bg-gray-300 rounded-lg" />
        <div className="absolute bottom-2 left-2 h-5 w-32 bg-gray-300 rounded-lg" />
      </div>

      <div className="mt-3 space-y-2">
        {/* Price */}
        <div className="flex items-center">
          <div className="h-5 w-28 bg-gray-200 rounded" />
          <div className="ms-auto h-5 w-16 bg-gray-200 rounded" />
        </div>

        {/* Name */}
        <div className="h-4 w-3/4 bg-gray-200 rounded" />

        {/* Address */}
        <div className="h-3 w-full bg-gray-200 rounded" />
      </div>
    </div>
  );
};
