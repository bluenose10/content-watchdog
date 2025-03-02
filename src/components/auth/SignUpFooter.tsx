
import { CardFooter } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const SignUpFooter = () => {
  return (
    <>
      <CardFooter className="flex flex-col items-center gap-4">
        <div className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </div>
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to home
        </Link>
      </CardFooter>
      
      <p className="text-xs text-center mt-8 text-muted-foreground">
        By signing up, you agree to our{" "}
        <Link to="/terms-of-service" className="underline hover:text-foreground">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy-policy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </p>
    </>
  );
};

export default SignUpFooter;
