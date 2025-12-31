import { Play, Eye, ThumbsUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VideoCardProps {
  id: string;
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  viewCount: number;
  likeCount: number;
  duration?: string;
  subject?: string;
  onClick?: () => void;
}

const formatViews = (views: number): string => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
};

const calculateRating = (likes: number, views: number): number => {
  if (views === 0) return 0;
  const ratio = likes / views;
  return Math.min(5, Math.round(ratio * 100 * 10) / 10);
};

export const VideoCard = ({
  title,
  channelTitle,
  thumbnailUrl,
  viewCount,
  likeCount,
  duration,
  subject,
  onClick,
}: VideoCardProps) => {
  const rating = calculateRating(likeCount, viewCount);

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-0 bg-card shadow-primary-sm hover:shadow-primary-lg transition-all duration-300 hover:-translate-y-2"
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnailUrl || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center shadow-glow animate-pulse-soft">
            <Play className="h-6 w-6 text-primary-foreground fill-current" />
          </div>
        </div>
        {duration && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-foreground/80 text-background text-xs font-medium rounded-md flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {duration}
          </div>
        )}
        {subject && (
          <Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground border-0">
            {subject}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 truncate">{channelTitle}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {formatViews(viewCount)}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3.5 w-3.5" />
              {formatViews(likeCount)}
            </span>
          </div>
          {rating > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-gold/20 text-gold rounded-full">
              <span className="text-xs">⭐</span>
              <span className="font-medium">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
