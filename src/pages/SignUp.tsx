
import { useState } from "react";
import SignUpForm from "@/components/auth/SignUpForm";
import SuccessScreen from "@/components/auth/SuccessScreen";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSearchParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

const SignUp = () => {
  const [signupSuccessful, setSignupSuccessful] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [searchParams] = useSearchParams();
  const errorParam = searchParams.get("error");

  const handleSignUpSuccess = (email: string) => {
    setUserEmail(email);
    setSignupSuccessful(true);
  };

  if (signupSuccessful) {
    return <SuccessScreen email={userEmail} />;
  }

  return (
    <AuthLayout>
      {errorParam && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {errorParam === "rate_limit" 
                ? "Too many email requests. Please try again later or use a different email." 
                : "There was an error with your sign up request. Please try again."}
            </AlertDescription>
          </Alert>
        </div>
      )}
      <SignUpForm onSignUpSuccess={handleSignUpSuccess} />
    </AuthLayout>
  );
};

export default SignUp;
