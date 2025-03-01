
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Lightbulb } from "lucide-react";

export function EmptyResults() {
  const navigate = useNavigate();
  
  return (
    <Card className="p-8 my-8 text-center">
      <h3 className="text-xl font-medium mb-2">No results found</h3>
      <p className="text-muted-foreground mb-6">
        We couldn't find any matches for your search. Try using different keywords or search parameters.
      </p>
      <Button onClick={() => navigate("/search")} className="mb-8">Try a New Search</Button>
      
      <div className="mt-8 pt-8 border-t border-border">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-3">
            <Lightbulb className="h-5 w-5 text-purple-700 dark:text-purple-400" />
          </div>
          <h4 className="text-lg font-medium">AI-Powered Analysis</h4>
        </div>
        <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
          Consider upgrading to our Pro plan for AI-powered content analysis. Our AI can detect subtle similarities and modifications that traditional search engines might miss.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto text-sm">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
            <p className="font-medium mb-1">Advanced Pattern Recognition</p>
            <p className="text-muted-foreground">AI detects content similarities even when text or images have been modified</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
            <p className="font-medium mb-1">Semantic Understanding</p>
            <p className="text-muted-foreground">Identifies plagiarism based on meaning, not just exact matches</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="mt-4 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          onClick={() => navigate("/#pricing")}
        >
          Learn about AI features
        </Button>
      </div>
    </Card>
  );
}
