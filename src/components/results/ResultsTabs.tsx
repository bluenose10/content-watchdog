
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccessLevel } from "@/hooks/useProtectedRoute";
import { TabContent } from "./TabContent";

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
        <TabContent 
          results={results}
          accessLevel={accessLevel}
          onUpgrade={onUpgrade}
        />
      </TabsContent>
      
      <TabsContent value="images" className="mt-4">
        <TabContent 
          results={results}
          filterType="image"
          accessLevel={accessLevel}
          onUpgrade={onUpgrade}
        />
      </TabsContent>
      
      <TabsContent value="websites" className="mt-4">
        <TabContent 
          results={results}
          filterType="website"
          accessLevel={accessLevel}
          onUpgrade={onUpgrade}
        />
      </TabsContent>
      
      <TabsContent value="social" className="mt-4">
        <TabContent 
          results={results}
          filterType="social"
          accessLevel={accessLevel}
          onUpgrade={onUpgrade}
        />
      </TabsContent>
    </Tabs>
  );
}
