import { VideoCard } from "@/components/VideoCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Video {
  id: string;
  video_id: string;
  title: string;
  channel_title: string;
  thumbnail_url: string | null;
  view_count: number | null;
  like_count: number | null;
  duration: string | null;
  subject: string | null;
}

interface VideoGridProps {
  videos: Video[];
  isLoading?: boolean;
  onVideoClick?: (videoId: string) => void;
}

export const VideoGrid = ({ videos, isLoading, onVideoClick }: VideoGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center mb-4">
          <span className="text-4xl">📚</span>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No videos found</h3>
        <p className="text-muted-foreground max-w-md">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video, index) => (
        <div
          key={video.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <VideoCard
            id={video.id}
            videoId={video.video_id}
            title={video.title}
            channelTitle={video.channel_title}
            thumbnailUrl={video.thumbnail_url || "/placeholder.svg"}
            viewCount={video.view_count || 0}
            likeCount={video.like_count || 0}
            duration={video.duration || undefined}
            subject={video.subject || undefined}
            onClick={() => onVideoClick?.(video.video_id)}
          />
        </div>
      ))}
    </div>
  );
};
