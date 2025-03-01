
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserPlus, Lock } from "lucide-react";

export function SignUpPrompt() {
  return (
    <>
      <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">Sign Up Required</h3>
        </div>
        <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">
          You need to create an account to use our content search features. 
          Our free plan includes 3 searches per month.
        </p>
      </div>
      
      <div>
        <div className="flex justify-center">
          <Button 
            type="button" 
            className="whitespace-nowrap cursor-pointer bg-purple-600 hover:bg-purple-700" 
            asChild
          >
            <Link to="/signup">
              Sign Up
              <UserPlus className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Sign up for a free account to access our search features. Our free plan includes 3 searches per month.
        </p>
      </div>
    </>
  );
}
