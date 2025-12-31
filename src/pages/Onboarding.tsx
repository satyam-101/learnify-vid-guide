import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClassSelector } from "@/components/ClassSelector";
import { SubjectSelector } from "@/components/SubjectSelector";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, ArrowRight, ArrowLeft, Check } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState<"11" | "12" | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    "Mathematics",
    "Physics",
    "Chemistry",
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleComplete = async () => {
    if (!selectedClass || selectedSubjects.length === 0) {
      toast({
        title: "Missing information",
        description: "Please select your class and at least one subject.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          class_level: selectedClass,
          subjects: selectedSubjects,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated! 🎉",
        description: "You're all set to start learning.",
      });

      navigate("/home");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-2 w-16 rounded-full transition-all duration-300 ${
                s <= step ? "bg-primary" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {step === 1 ? "Select Your Class" : "Choose Your Subjects"}
          </h1>
          <p className="text-muted-foreground">
            {step === 1
              ? "This helps us personalize your learning experience"
              : "Pick the subjects you want to focus on"}
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-primary-lg animate-scale-in">
          {step === 1 ? (
            <ClassSelector
              selectedClass={selectedClass}
              onSelect={setSelectedClass}
            />
          ) : (
            <SubjectSelector
              selectedSubjects={selectedSubjects}
              onToggle={handleSubjectToggle}
            />
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step === 1 ? (
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedClass}
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="hero"
                onClick={handleComplete}
                disabled={selectedSubjects.length === 0 || isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Complete Setup
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
