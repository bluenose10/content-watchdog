
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function GuestBanner() {
  const navigate = useNavigate();
  
  return (
    <Card className="mb-6 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
      <CardContent className="p-4">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
          <div className="flex-1">
            <h3 className="font-medium text-purple-800 dark:text-purple-300">Free Preview</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You're viewing limited results as a guest. Sign up for free to save your searches and access more features.
            </p>
          </div>
          <div>
            <Button 
              onClick={() => navigate("/signup")}
              variant="default"
              className="bg-purple-600 hover:bg-purple-700 w-full md:w-auto"
            >
              Sign Up Free
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
