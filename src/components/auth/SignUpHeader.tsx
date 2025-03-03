
import { Link } from "react-router-dom";
import { APP_NAME } from "@/lib/constants";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SignUpHeader = () => {
  return (
    <>
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold">
          <img 
            src="/lovable-uploads/822ca5bd-71ae-4f2a-b354-b4182a9f42d7.png" 
            alt="Influence Guard Logo" 
            className="h-6 w-6" 
          />
          <span className="text-gradient">{APP_NAME}</span>
        </Link>
      </div>
      
      <CardHeader>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Get started with your free account
        </CardDescription>
      </CardHeader>
    </>
  );
};

export default SignUpHeader;
