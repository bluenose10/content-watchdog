
import { APP_NAME } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="w-full max-w-md animate-scale-in">
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
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
