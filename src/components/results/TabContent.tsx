
import { PaginatedResults } from "@/components/ui/paginated-results";
import { AccessLevel } from "@/hooks/useProtectedRoute";

interface TabContentProps {
  results: any[];
  filterType?: string;
  accessLevel: AccessLevel;
  onUpgrade: () => void;
  itemsPerPage?: number;
}

export function TabContent({ 
  results, 
  filterType,
  accessLevel,
  onUpgrade,
  itemsPerPage = 8
}: TabContentProps) {
  // If filterType is provided, filter results; otherwise, show all
  const filteredResults = filterType 
    ? results.filter(r => r.type === filterType) 
    : results;
    
  return (
    <PaginatedResults
      results={filteredResults}
      itemsPerPage={itemsPerPage}
      accessLevel={accessLevel}
      onUpgrade={onUpgrade}
    />
  );
}
