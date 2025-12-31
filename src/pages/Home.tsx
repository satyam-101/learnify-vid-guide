import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { VideoGrid } from "@/components/VideoGrid";
import { SubjectSelector, subjects } from "@/components/SubjectSelector";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, TrendingUp, BookOpen } from "lucide-react";

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

// Sample videos for demo (these would normally come from YouTube API)
const sampleVideos: Video[] = [
  {
    id: "1",
    video_id: "dQw4w9WgXcQ",
    title: "Complete Physics Chapter 1 - Physical World | Class 11 NCERT",
    channel_title: "Physics Wallah",
    thumbnail_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=640&q=80",
    view_count: 15400000,
    like_count: 890000,
    duration: "1:45:30",
    subject: "Physics",
  },
  {
    id: "2",
    video_id: "abc123",
    title: "Calculus Basics - Limits and Derivatives | Class 12 Mathematics",
    channel_title: "Vedantu",
    thumbnail_url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=640&q=80",
    view_count: 12300000,
    like_count: 720000,
    duration: "2:15:00",
    subject: "Mathematics",
  },
  {
    id: "3",
    video_id: "def456",
    title: "Organic Chemistry - Hydrocarbons Full Chapter | Class 11",
    channel_title: "Unacademy",
    thumbnail_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=640&q=80",
    view_count: 9800000,
    like_count: 560000,
    duration: "3:00:00",
    subject: "Chemistry",
  },
  {
    id: "4",
    video_id: "ghi789",
    title: "Cell Biology - Structure and Function | Class 11 Biology",
    channel_title: "Biology by Suman Ma'am",
    thumbnail_url: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=640&q=80",
    view_count: 7500000,
    like_count: 450000,
    duration: "1:30:00",
    subject: "Biology",
  },
  {
    id: "5",
    video_id: "jkl012",
    title: "Integration - Complete Chapter | Class 12 Maths CBSE",
    channel_title: "Maths By Aman Sir",
    thumbnail_url: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=640&q=80",
    view_count: 11200000,
    like_count: 680000,
    duration: "2:45:00",
    subject: "Mathematics",
  },
  {
    id: "6",
    video_id: "mno345",
    title: "Electromagnetic Induction | Class 12 Physics NCERT",
    channel_title: "Physics Galaxy",
    thumbnail_url: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=640&q=80",
    view_count: 8900000,
    like_count: 520000,
    duration: "2:00:00",
    subject: "Physics",
  },
  {
    id: "7",
    video_id: "pqr678",
    title: "Chemical Bonding and Molecular Structure | Class 11",
    channel_title: "Etoos Education",
    thumbnail_url: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=640&q=80",
    view_count: 6700000,
    like_count: 380000,
    duration: "2:30:00",
    subject: "Chemistry",
  },
  {
    id: "8",
    video_id: "stu901",
    title: "Genetics and Evolution | Class 12 Biology Complete",
    channel_title: "NEET Prep",
    thumbnail_url: "https://images.unsplash.com/photo-1559757175-7b21e7afb4b6?w=640&q=80",
    view_count: 5400000,
    like_count: 310000,
    duration: "3:15:00",
    subject: "Biology",
  },
];

const Home = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    // Simulate fetching videos (would normally call YouTube API via edge function)
    setIsLoading(true);
    setTimeout(() => {
      let filteredVideos = sampleVideos;
      if (selectedSubject) {
        filteredVideos = sampleVideos.filter((v) => v.subject === selectedSubject);
      }
      setVideos(filteredVideos);
      setIsLoading(false);
    }, 500);
  }, [selectedSubject]);

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
