
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function EmptyResults() {
  const navigate = useNavigate();
  
  return (
    <Card className="p-8 my-8 text-center">
      <h3 className="text-xl font-medium mb-2">No results found</h3>
      <p className="text-muted-foreground mb-6">
        We couldn't find any matches for your search. Try using different keywords or search parameters.
      </p>
      <Button onClick={() => navigate("/search")}>Try a New Search</Button>
    </Card>
  );
}
