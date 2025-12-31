import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { VideoGrid } from "@/components/VideoGrid";
import { SubjectSelector } from "@/components/SubjectSelector";
import { ClassSelector } from "@/components/ClassSelector";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { Filter, SlidersHorizontal } from "lucide-react";

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

// Sample videos for demo
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
  },
  {
    id: "5",
    video_id: "maths2",
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
    video_id: "physics2",
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
    video_id: "chem2",
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
    video_id: "bio2",
    title: "Genetics and Evolution | Class 12 Biology Complete",
    channel_title: "NEET Prep",
    thumbnail_url: "https://images.unsplash.com/photo-1559757175-7b21e7afb4b6?w=640&q=80",
    view_count: 5400000,
    like_count: 310000,
    duration: "3:15:00",
    subject: "Biology",
  },
  {
    id: "9",
    video_id: "physics3",
    title: "Thermodynamics One Shot | Class 11 Physics",
    channel_title: "Physics Wallah",
    thumbnail_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=640&q=80",
    view_count: 10200000,
    like_count: 610000,
    duration: "2:30:00",
    subject: "Physics",
  },
  {
    id: "10",
    video_id: "maths3",
    title: "Matrices and Determinants | Class 12 Mathematics",
    channel_title: "Vedantu",
    thumbnail_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=640&q=80",
    view_count: 8100000,
    like_count: 480000,
    duration: "1:55:00",
    subject: "Mathematics",
  },
  {
    id: "11",
    video_id: "cs1",
    title: "Python Programming Complete Course | Class 11 Computer Science",
    channel_title: "Code With Harry",
    thumbnail_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=640&q=80",
    view_count: 25000000,
    like_count: 1500000,
    duration: "4:00:00",
    subject: "Computer Science",
  },
  {
    id: "12",
    video_id: "eng1",
    title: "English Grammar Complete | Class 11 & 12 CBSE",
    channel_title: "English Academy",
    thumbnail_url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=640&q=80",
    view_count: 4200000,
    like_count: 250000,
    duration: "2:20:00",
    subject: "English",
  },
];

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<"11" | "12" | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const filterVideos = useCallback(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      let filtered = [...allVideos];

      // Filter by search query
      if (query) {
        const lowerQuery = query.toLowerCase();
        filtered = filtered.filter(
          (v) =>
            v.title.toLowerCase().includes(lowerQuery) ||
            v.channel_title.toLowerCase().includes(lowerQuery) ||
            v.subject?.toLowerCase().includes(lowerQuery)
        );
      }

      // Filter by subjects
      if (selectedSubjects.length > 0) {
        filtered = filtered.filter((v) =>
          v.subject ? selectedSubjects.includes(v.subject) : false
        );
      }

      // Sort by view count
      filtered.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));

      setVideos(filtered);
      setIsLoading(false);
    }, 300);
  }, [query, selectedSubjects]);

  useEffect(() => {
    filterVideos();
  }, [filterVideos]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    if (newQuery) {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
    }
  };

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleVideoClick = (videoId: string) => {
    navigate(`/video/${videoId}`);
  };

  const clearFilters = () => {
    setSelectedSubjects([]);
    setSelectedClass(null);
  };

  const activeFiltersCount = selectedSubjects.length + (selectedClass ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Search Section */}
      <section className="bg-gradient-to-b from-secondary/50 to-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <SearchBar
                onSearch={handleSearch}
                initialValue={query}
                placeholder="Search videos, topics, or channels..."
              />
            </div>
            
            {/* Mobile Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden relative">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Class</h3>
                    <ClassSelector
                      selectedClass={selectedClass}
                      onSelect={setSelectedClass}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Subjects</h3>
                    <SubjectSelector
                      selectedSubjects={selectedSubjects}
                      onToggle={handleSubjectToggle}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="flex-1"
                    >
                      Clear All
                    </Button>
                    <Button
                      onClick={() => setIsFilterOpen(false)}
                      className="flex-1"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden md:block w-72 shrink-0">
              <div className="sticky top-24 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-foreground flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </h2>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-muted-foreground"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                <div className="p-4 bg-card rounded-xl border border-border/50 space-y-6">
                  <div>
                    <h3 className="font-medium text-sm mb-3">Class Level</h3>
                    <div className="flex gap-2">
                      {(["11", "12"] as const).map((level) => (
                        <Button
                          key={level}
                          variant={selectedClass === level ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            setSelectedClass((prev) =>
                              prev === level ? null : level
                            )
                          }
                        >
                          Class {level}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-3">Subjects</h3>
                    <SubjectSelector
                      selectedSubjects={selectedSubjects}
                      onToggle={handleSubjectToggle}
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* Results */}
            <main className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">
                  {query
                    ? `Results for "${query}"`
                    : selectedSubjects.length > 0
                    ? "Filtered Videos"
                    : "All Videos"}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {videos.length} videos
                </span>
              </div>

              <VideoGrid
                videos={videos}
                isLoading={isLoading}
                onVideoClick={handleVideoClick}
              />
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SearchPage;
