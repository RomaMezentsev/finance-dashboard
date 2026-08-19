type LoadingSkeletonProps = {
  className?: string;
};

export function LoadingSkeleton({ className = "" }: LoadingSkeletonProps) {
  return <div className={`animate-pulse rounded-2xl bg-white/5 ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="space-y-4 rounded-3xl border border-card-border bg-card/80 p-6 backdrop-blur-xl">
      <LoadingSkeleton className="h-4 w-32" />
      <LoadingSkeleton className="h-8 w-48" />
      <LoadingSkeleton className="h-20 w-full" />
      <div className="space-y-2">
        <LoadingSkeleton className="h-12 w-full" />
        <LoadingSkeleton className="h-12 w-full" />
        <LoadingSkeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
