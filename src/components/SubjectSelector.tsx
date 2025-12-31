import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Calculator,
  Atom,
  FlaskConical,
  Leaf,
  BookOpen,
  Globe,
  Briefcase,
  DollarSign,
  Landmark,
  Code,
} from "lucide-react";

const subjects = [
  { id: "Mathematics", label: "Mathematics", icon: Calculator, color: "bg-coral/10 text-coral border-coral/30" },
  { id: "Physics", label: "Physics", icon: Atom, color: "bg-teal/10 text-teal border-teal/30" },
  { id: "Chemistry", label: "Chemistry", icon: FlaskConical, color: "bg-gold/10 text-gold border-gold/30" },
  { id: "Biology", label: "Biology", icon: Leaf, color: "bg-accent/10 text-accent border-accent/30" },
  { id: "English", label: "English", icon: BookOpen, color: "bg-primary/10 text-primary border-primary/30" },
  { id: "Hindi", label: "Hindi", icon: Globe, color: "bg-coral-light/10 text-coral-light border-coral-light/30" },
  { id: "Computer Science", label: "Computer Science", icon: Code, color: "bg-teal-light/10 text-teal-light border-teal-light/30" },
  { id: "Accountancy", label: "Accountancy", icon: DollarSign, color: "bg-gold/10 text-gold border-gold/30" },
  { id: "Business Studies", label: "Business Studies", icon: Briefcase, color: "bg-primary/10 text-primary border-primary/30" },
  { id: "Economics", label: "Economics", icon: Landmark, color: "bg-accent/10 text-accent border-accent/30" },
];

interface SubjectSelectorProps {
  selectedSubjects: string[];
  onToggle: (subject: string) => void;
  multiSelect?: boolean;
}

export const SubjectSelector = ({
  selectedSubjects,
  onToggle,
  multiSelect = true,
}: SubjectSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {subjects.map((subject) => {
        const Icon = subject.icon;
        const isSelected = selectedSubjects.includes(subject.id);
        
        return (
          <Badge
            key={subject.id}
            variant="outline"
            className={cn(
              "cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105",
              isSelected
                ? "bg-primary text-primary-foreground border-primary shadow-primary-sm"
                : subject.color
            )}
            onClick={() => onToggle(subject.id)}
          >
            <Icon className="h-4 w-4 mr-2" />
            {subject.label}
          </Badge>
        );
      })}
    </div>
  );
};

export { subjects };
