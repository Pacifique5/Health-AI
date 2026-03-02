export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}
    />
  );
}

export function MessageSkeleton() {
  return (
    <div className="flex items-start gap-3">
      <Skeleton className="h-10 w-10 rounded-2xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-20 w-3/4 rounded-2xl" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}
