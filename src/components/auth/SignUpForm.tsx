
import { Card, CardContent } from "@/components/ui/card";
import { useSignUpForm } from "@/hooks/useSignUpForm";
import SignUpHeader from "./SignUpHeader";
import SignUpFormFields from "./SignUpFormFields";
import SignUpFooter from "./SignUpFooter";

interface SignUpFormProps {
  onSignUpSuccess: (email: string) => void;
}

const SignUpForm = ({ onSignUpSuccess }: SignUpFormProps) => {
  const { formData, isLoading, handleChange, handleSubmit } = useSignUpForm({
    onSignUpSuccess
  });

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
