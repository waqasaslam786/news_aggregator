import { Skeleton } from "@/components/ui/skeleton";

const NewsSkeleton = () => {
  return (
    <div className="flex items-center space-x-4">
      <div className="space-y-2 w-full">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    </div>
  );
};

export default NewsSkeleton;
