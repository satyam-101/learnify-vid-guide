import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { VideoGrid } from "@/components/VideoGrid";
import { SubjectSelector, subjects } from "@/components/SubjectSelector";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, TrendingUp, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface Profile {
  class_level: "11" | "12";
  subjects: string[];
  full_name: string | null;
}

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileData) {
        setProfile({
          class_level: profileData.class_level as "11" | "12",
          subjects: profileData.subjects as string[] || [],
          full_name: profileData.full_name,
        });
      }
    };

    fetchProfile();
  }, [navigate]);

  const fetchVideos = useCallback(async (subject: string | null) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('youtube-search', {
        body: { 
          subject: subject || 'education',
          maxResults: 12
        }
      });

      if (error) {
        console.error('Error fetching videos:', error);
        toast({
          title: "Error loading videos",
          description: "Please try again later",
          variant: "destructive"
        });
        return;
      }

      if (data?.videos) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error loading videos",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchVideos(selectedSubject);
  }, [selectedSubject, fetchVideos]);

  const handleSearch = (query: string) => {
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleVideoClick = (videoId: string) => {
    navigate(`/video/${videoId}`);
  };

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubject((prev) => (prev === subject ? null : subject));
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-secondary/50 to-background py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4 animate-bounce-in">
              <Sparkles className="h-4 w-4" />
              <span>Class {profile?.class_level || "11 & 12"} Content</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {greeting()}, {profile?.full_name?.split(" ")[0] || "Student"}! 👋
            </h1>
            <p className="text-muted-foreground mb-8">
              Continue your learning journey with top-rated videos
            </p>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Quick Filters */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Browse by Subject</h2>
            </div>
            <SubjectSelector
              selectedSubjects={selectedSubject ? [selectedSubject] : []}
              onToggle={handleSubjectToggle}
              multiSelect={false}
            />
          </div>

          {/* Trending Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  {selectedSubject ? `${selectedSubject} Videos` : "Trending Now"}
                </h2>
              </div>
              <Button
                variant="ghost"
                onClick={() => navigate("/search")}
                className="text-primary"
              >
                View All
              </Button>
            </div>
            <VideoGrid
              videos={videos}
              isLoading={isLoading}
              onVideoClick={handleVideoClick}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
