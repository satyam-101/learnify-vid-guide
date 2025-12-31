import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export const SearchBar = ({
  onSearch,
  placeholder = "Search for topics, subjects, or concepts...",
  initialValue = "",
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        onSearch(query.trim());
      }
    },
    [query, onSearch]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    onSearch("");
  }, [onSearch]);

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-lg opacity-20 group-focus-within:opacity-40 transition-opacity" />
        <div className="relative flex items-center bg-card border-2 border-border/50 rounded-2xl overflow-hidden shadow-primary-md focus-within:border-primary focus-within:shadow-primary-lg transition-all duration-300">
          <div className="flex items-center justify-center w-14 h-14 text-muted-foreground">
            <Search className="h-5 w-5" />
          </div>
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 h-14 border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 text-base"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-10 w-10 mr-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="submit"
            className="h-10 mr-2 rounded-xl px-6"
          >
            Search
          </Button>
        </div>
      </div>
    </form>
  );
};
