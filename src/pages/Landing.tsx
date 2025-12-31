import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import {
  GraduationCap,
  Search,
  BookOpen,
  TrendingUp,
  Users,
  Play,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Search,
      title: "Smart Discovery",
      description: "Find the best educational videos curated for CBSE & ISC curriculum",
    },
    {
      icon: TrendingUp,
      title: "Top Rated Content",
      description: "Videos ranked by views and ratings from millions of students",
    },
    {
      icon: BookOpen,
      title: "All Subjects",
      description: "Physics, Chemistry, Maths, Biology, and more - all in one place",
    },
    {
      icon: Users,
      title: "Class 11 & 12",
      description: "Tailored content for senior secondary students preparing for boards & JEE",
    },
  ];

  const popularSubjects = [
    { name: "Physics", emoji: "⚛️", videos: "12K+" },
    { name: "Mathematics", emoji: "📐", videos: "15K+" },
    { name: "Chemistry", emoji: "🧪", videos: "10K+" },
    { name: "Biology", emoji: "🧬", videos: "8K+" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-float-delayed" />

        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-bounce-in">
              <Sparkles className="h-4 w-4" />
              <span>The #1 Learning Platform for Indian Students</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight animate-slide-up">
              Learn Smarter with{" "}
              <span className="text-gradient-primary">Top-Rated</span> Videos
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "100ms" }}>
              Discover the highest-viewed educational videos for Class 11 & 12.
              Curated from YouTube, ranked by quality, tailored for CBSE & ISC.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Button
                variant="hero"
                size="xl"
                onClick={() => navigate("/auth?mode=signup")}
                className="group"
              >
                Start Learning Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="hero-outline"
                size="xl"
                onClick={() => navigate("/auth")}
              >
                <Play className="h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-16 animate-fade-in" style={{ animationDelay: "400ms" }}>
              {[
                { value: "50K+", label: "Videos" },
                { value: "100K+", label: "Students" },
                { value: "15+", label: "Subjects" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-gradient-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Subjects */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Popular Subjects</h2>
            <p className="text-muted-foreground">Explore content across all major subjects</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {popularSubjects.map((subject, index) => (
              <div
                key={subject.name}
                className="group p-6 bg-card rounded-2xl border border-border/50 hover:border-primary/50 hover:shadow-primary-lg transition-all duration-300 cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => navigate("/auth?mode=signup")}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {subject.emoji}
                </div>
                <h3 className="font-semibold text-foreground mb-1">{subject.name}</h3>
                <p className="text-sm text-muted-foreground">{subject.videos} videos</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Students Love Learnify
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We curate the best educational content so you can focus on learning
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group p-6 bg-card rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-primary-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="h-14 w-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow">
                    <Icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="h-20 w-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
              <GraduationCap className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Ace Your Exams?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of students already learning with Learnify
            </p>
            <Button
              variant="hero"
              size="xl"
              onClick={() => navigate("/auth?mode=signup")}
              className="group"
            >
              Get Started - It's Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Learnify</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Learnify. Made with ❤️ for Indian Students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
