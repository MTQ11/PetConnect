import { Skeleton } from "@/components/ui/skeleton"

export function PostSkeleton() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        {/* Avatar */}
        <Skeleton className="w-10 h-10 rounded-full" />
        
        {/* User info */}
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Menu button */}
        <Skeleton className="w-6 h-6" />
      </div>

      {/* Content */}
      <div className="mb-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Image placeholder */}
      <Skeleton className="w-full h-64 rounded-lg mb-4" />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-8" />
          <Skeleton className="w-16 h-8" />
          <Skeleton className="w-16 h-8" />
        </div>
        <Skeleton className="w-20 h-8" />
      </div>
    </div>
  )
}

export function PostSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  )
}