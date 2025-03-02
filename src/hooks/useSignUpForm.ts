
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UseSignUpFormProps {
  onSignUpSuccess: (email: string) => void;
}

export const useSignUpForm = ({ onSignUpSuccess }: UseSignUpFormProps) => {
  const [formData, setFormData] = useState<SignUpFormData>({
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

  const validateForm = (): boolean => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Starting sign up process...");

    if (!validateForm()) {
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
        
        // Special handling for email rate limit errors
        if (error.message?.includes("rate limit exceeded") || error.code === "over_email_send_rate_limit") {
          toast({
            title: "Email rate limit exceeded",
            description: "Too many verification emails have been sent to this address. Please try again in a few minutes or use a different email.",
            variant: "destructive",
            duration: 8000,
          });
        } else {
          toast({
            title: "Sign up failed",
            description: error.message || "There was an error creating your account",
            variant: "destructive",
          });
        }
      } else {
        console.log("Sign up successful, redirecting user to success page");
        toast({
          title: "Sign up successful",
          description: "Please check your email for a confirmation link",
          duration: 6000,
        });
        
        // Always call onSignUpSuccess to redirect to the success screen
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

  return {
    formData,
    isLoading,
    handleChange,
    handleSubmit
  };
};
