
import React from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AgentSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      {/* Cover image */}
      <Skeleton className="w-full h-24" />
      
      {/* Content */}
      <div className="p-4 text-center -mt-12">
        {/* Avatar */}
        <Skeleton className="h-20 w-20 rounded-full mx-auto border-4 border-white" />
        
        {/* Name */}
        <Skeleton className="h-5 w-32 mx-auto mt-3" />
        
        {/* Company */}
        <Skeleton className="h-4 w-40 mx-auto mt-2" />
        
        {/* Rating */}
        <div className="flex justify-center mt-2">
          <Skeleton className="h-4 w-24" />
        </div>
        
        {/* Info list */}
        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5 mx-auto" />
        </div>
        
        {/* Buttons */}
        <div className="mt-4 flex justify-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </Card>
  );
};

export default AgentSkeleton;
