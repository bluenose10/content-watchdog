
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import SignUpHeader from "./SignUpHeader";
import SignUpFormFields from "./SignUpFormFields";
import SignUpFooter from "./SignUpFooter";

interface SignUpFormProps {
  onSignUpSuccess: (email: string) => void;
}

const SignUpForm = ({ onSignUpSuccess }: SignUpFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Starting sign up process...");

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log("Calling Supabase signUp...");
      const { data, error } = await signUp(
        formData.email, 
        formData.password, 
        { data: { name: formData.name } }
      );
      console.log("Sign up response:", { data, error });
      
      if (error) {
        console.error("Supabase signup error:", error);
        toast({
          title: "Sign up failed",
          description: error.message || "There was an error creating your account",
          variant: "destructive",
        });
      } else {
        if (data?.user && !data.user.email_confirmed_at) {
          console.log("Email confirmation required, informing user to check their inbox");
          toast({
            title: "Check your email",
            description: "We've sent a confirmation link to your email. Please check your inbox and spam folder.",
            duration: 6000,
          });
        } else {
          console.log("User created successfully, no email confirmation needed");
          toast({
            title: "Success",
            description: "Your account has been created successfully.",
            variant: "default",
          });
        }
        
        onSignUpSuccess(formData.email);
      }
    } catch (error: any) {
      console.error("Exception during signup:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="w-full max-w-md animate-scale-in">
        <SignUpHeader />

        <Card className="glass-card">
          <CardContent className="pt-6">
            <SignUpFormFields 
              isLoading={isLoading}
              onSubmit={handleSubmit}
              formData={formData}
              onChange={handleChange}
            />
          </CardContent>
          <SignUpFooter />
        </Card>
      </div>
    </div>
  );
};

export default SignUpForm;
