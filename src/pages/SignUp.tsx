
import { useState } from "react";
import SignUpForm from "@/components/auth/SignUpForm";
import SuccessScreen from "@/components/auth/SuccessScreen";

const SignUp = () => {
  const [signupSuccessful, setSignupSuccessful] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleSignUpSuccess = (email: string) => {
    setUserEmail(email);
    setSignupSuccessful(true);
  };

  if (signupSuccessful) {
    return <SuccessScreen email={userEmail} />;
  }

  return <SignUpForm onSignUpSuccess={handleSignUpSuccess} />;
};

export default SignUp;
