import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { VideoGrid } from "@/components/VideoGrid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Eye,
  ThumbsUp,
  Calendar,
  ExternalLink,
  Heart,
  Share2,
} from "lucide-react";

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
  description?: string;
}

// Sample data
const allVideos: Video[] = [
  {
    id: "1",
    video_id: "physics1",
    title: "Complete Physics Chapter 1 - Physical World | Class 11 NCERT",
    channel_title: "Physics Wallah",
    thumbnail_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=640&q=80",
    view_count: 15400000,
    like_count: 890000,
    duration: "1:45:30",
    subject: "Physics",
    description: "In this comprehensive video, we cover the complete Chapter 1 - Physical World from Class 11 Physics NCERT. This includes the scope and excitement of physics, physics technology and society, fundamental forces in nature, and nature of physical laws.",
  },
  {
    id: "2",
    video_id: "maths1",
    title: "Calculus Basics - Limits and Derivatives | Class 12 Mathematics",
    channel_title: "Vedantu",
    thumbnail_url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=640&q=80",
    view_count: 12300000,
    like_count: 720000,
    duration: "2:15:00",
    subject: "Mathematics",
    description: "Master the fundamentals of calculus with this in-depth tutorial on limits and derivatives. Perfect for Class 12 students preparing for board exams and JEE.",
  },
  {
    id: "3",
    video_id: "chem1",
    title: "Organic Chemistry - Hydrocarbons Full Chapter | Class 11",
    channel_title: "Unacademy",
    thumbnail_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=640&q=80",
    view_count: 9800000,
    like_count: 560000,
    duration: "3:00:00",
    subject: "Chemistry",
    description: "Complete coverage of hydrocarbons including alkanes, alkenes, alkynes, and aromatic compounds. Covers nomenclature, preparation methods, and chemical reactions.",
  },
  {
    id: "4",
    video_id: "bio1",
    title: "Cell Biology - Structure and Function | Class 11 Biology",
    channel_title: "Biology by Suman Ma'am",
    thumbnail_url: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=640&q=80",
    view_count: 7500000,
    like_count: 450000,
    duration: "1:30:00",
    subject: "Biology",
    description: "Understand the fundamental unit of life - the cell. Learn about cell structure, organelles, and their functions in this detailed biology lecture.",
  },
];

const formatViews = (views: number): string => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
};

const VideoDetail = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Simulate fetching video details
    setIsLoading(true);
    setTimeout(() => {
      const foundVideo = allVideos.find((v) => v.video_id === videoId);
      setVideo(foundVideo || null);

      // Get related videos (same subject, different video)
      if (foundVideo) {
        const related = allVideos
          .filter((v) => v.subject === foundVideo.subject && v.video_id !== videoId)
          .slice(0, 4);
        setRelatedVideos(related);
      }

      setIsLoading(false);
    }, 300);
  }, [videoId]);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites ❤️",
      description: isFavorite
        ? "This video has been removed from your favorites."
        : "You can find this video in your favorites list.",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: video?.title,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied! 📋",
        description: "Video link has been copied to your clipboard.",
      });
    }
  };

  const handleVideoClick = (newVideoId: string) => {
    navigate(`/video/${newVideoId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="aspect-video w-full max-w-4xl bg-muted rounded-xl" />
            <div className="h-8 w-3/4 bg-muted rounded" />
            <div className="h-4 w-1/2 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Video not found</h1>
          <p className="text-muted-foreground mb-8">
            The video you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/home")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Embed */}
            <div className="aspect-video w-full bg-card rounded-2xl overflow-hidden shadow-primary-lg border border-border/50">
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <div className="text-center p-8">
                  <img
                    src={video.thumbnail_url || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  <div className="relative z-10 bg-background/80 backdrop-blur-sm rounded-2xl p-8">
                    <p className="text-muted-foreground mb-4">
                      Video player would embed YouTube video here
                    </p>
                    <Button
                      variant="hero"
                      onClick={() =>
                        window.open(
                          `https://www.youtube.com/watch?v=${video.video_id}`,
                          "_blank"
                        )
                      }
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Watch on YouTube
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Badge className="mb-2">{video.subject}</Badge>
                  <h1 className="text-2xl font-bold text-foreground">
                    {video.title}
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {formatViews(video.view_count || 0)} views
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  {formatViews(video.like_count || 0)} likes
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {video.duration}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={isFavorite ? "default" : "outline"}
                  onClick={handleFavorite}
                >
                  <Heart
                    className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`}
                  />
                  {isFavorite ? "Saved" : "Save"}
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* Channel Info */}
              <div className="p-4 bg-card rounded-xl border border-border/50">
                <h3 className="font-semibold text-foreground mb-1">
                  {video.channel_title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {video.description}
                </p>
              </div>
            </div>
          </div>

          {/* Related Videos */}
          <aside className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">
              Related Videos
            </h2>
            <div className="space-y-4">
              {relatedVideos.map((relatedVideo) => (
                <div
                  key={relatedVideo.id}
                  className="group cursor-pointer"
                  onClick={() => handleVideoClick(relatedVideo.video_id)}
                >
                  <div className="flex gap-3">
                    <div className="w-40 shrink-0 aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={relatedVideo.thumbnail_url || "/placeholder.svg"}
                        alt={relatedVideo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedVideo.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {relatedVideo.channel_title}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Eye className="h-3 w-3" />
                        {formatViews(relatedVideo.view_count || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default VideoDetail;
