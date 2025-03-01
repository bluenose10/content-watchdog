
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaginatedResults } from "@/components/ui/paginated-results";
import { AccessLevel } from "@/hooks/useProtectedRoute";

interface ResultsTabsProps {
  results: any[];
  accessLevel: AccessLevel;
  onUpgrade: () => void;
}

export function ResultsTabs({ results, accessLevel, onUpgrade }: ResultsTabsProps) {
  return (
    <Tabs defaultValue="all" className="mb-6">
      <TabsList>
        <TabsTrigger value="all">All Results</TabsTrigger>
        <TabsTrigger value="images">Images</TabsTrigger>
        <TabsTrigger value="websites">Websites</TabsTrigger>
        <TabsTrigger value="social">Social Media</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-4">
        <PaginatedResults
          results={results}
          itemsPerPage={8}
          accessLevel={accessLevel}
          onUpgrade={onUpgrade}
        />
      </TabsContent>
      
      <TabsContent value="images" className="mt-4">
        <PaginatedResults
          results={results.filter(r => r.type === 'image')}
          itemsPerPage={8}
          accessLevel={accessLevel}
          onUpgrade={onUpgrade}
        />
      </TabsContent>
      
      <TabsContent value="websites" className="mt-4">
        <PaginatedResults
          results={results.filter(r => r.type === 'website')}
          itemsPerPage={8}
          accessLevel={accessLevel}
          onUpgrade={onUpgrade}
        />
      </TabsContent>
      
      <TabsContent value="social" className="mt-4">
        <PaginatedResults
          results={results.filter(r => r.type === 'social')}
          itemsPerPage={8}
          accessLevel={accessLevel}
          onUpgrade={onUpgrade}
        />
      </TabsContent>
    </Tabs>
  );
}
