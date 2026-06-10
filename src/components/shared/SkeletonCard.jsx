const SkeletonCard = () => (
  <div className="card bg-base-100 shadow border border-base-300 overflow-hidden animate-pulse">
    <div className="h-48 bg-base-300" />
    <div className="card-body p-5 space-y-3">
      <div className="flex gap-2">
        <div className="h-5 w-20 bg-base-300 rounded-full" />
        <div className="h-5 w-12 bg-base-300 rounded-full" />
      </div>
      <div className="h-6 w-3/4 bg-base-300 rounded" />
      <div className="h-4 w-full bg-base-300 rounded" />
      <div className="h-4 w-2/3 bg-base-300 rounded" />
      <div className="flex justify-between mt-4">
        <div className="h-6 w-16 bg-base-300 rounded" />
        <div className="h-8 w-24 bg-base-300 rounded-lg" />
      </div>
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;
