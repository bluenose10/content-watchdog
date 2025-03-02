
import { SearchEngines } from "./SearchEngines";

interface SearchHeaderProps {
  availableEngines: string[];
}

export function SearchHeader({ availableEngines }: SearchHeaderProps) {
  return (
    <div className="mb-6 text-center">
      <h2 className="text-2xl font-bold mb-2">Content Search</h2>
      <p className="text-sm text-muted-foreground">
        Find and protect your content
      </p>
      
      <SearchEngines availableEngines={availableEngines} />
    </div>
  );
}
