
import React from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PropertySkeleton = () => {
  return (
    <Card className="overflow-hidden">
      {/* Image placeholder */}
      <Skeleton className="w-full h-48" />
      
      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        
        {/* Title */}
        <Skeleton className="h-5 w-3/4 mb-2" />
        
        {/* Location */}
        <Skeleton className="h-4 w-full mb-3" />
        
        {/* Features */}
        <div className="flex justify-between mb-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        
        {/* Bottom section */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </Card>
  );
};

export default PropertySkeleton;
