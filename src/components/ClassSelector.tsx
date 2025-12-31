import { cn } from "@/lib/utils";
import { GraduationCap } from "lucide-react";

interface ClassSelectorProps {
  selectedClass: "11" | "12" | null;
  onSelect: (classLevel: "11" | "12") => void;
}

export const ClassSelector = ({ selectedClass, onSelect }: ClassSelectorProps) => {
  return (
    <div className="flex gap-4">
      {(["11", "12"] as const).map((level) => (
        <button
          key={level}
          onClick={() => onSelect(level)}
          className={cn(
            "flex-1 p-6 rounded-2xl border-2 transition-all duration-300 group",
            selectedClass === level
              ? "border-primary bg-primary/5 shadow-primary-lg"
              : "border-border bg-card hover:border-primary/50 hover:shadow-primary-md"
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className={cn(
                "h-16 w-16 rounded-xl flex items-center justify-center transition-all duration-300",
                selectedClass === level
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
              )}
            >
              <GraduationCap className="h-8 w-8" />
            </div>
            <div className="text-center">
              <h3
                className={cn(
                  "text-2xl font-bold transition-colors",
                  selectedClass === level ? "text-primary" : "text-foreground"
                )}
              >
                Class {level}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {level === "11" ? "Junior Year" : "Senior Year"}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
