export function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-stone-200 rounded-sm" />
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-stone-200 rounded w-3/4" />
        <div className="h-3 bg-stone-200 rounded w-1/3" />
      </div>
    </div>
  );
}
