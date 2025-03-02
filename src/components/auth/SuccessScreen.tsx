
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { APP_NAME } from "@/lib/constants";
import { ArrowLeft, Shield, Check, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface SuccessScreenProps {
  email: string;
}

const SuccessScreen = ({ email }: SuccessScreenProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <Shield className="h-6 w-6" />
            <span className="text-gradient">{APP_NAME}</span>
          </Link>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl">Registration Complete</CardTitle>
            <CardDescription>
              Your account has been created successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="success" className="border-green-500 bg-green-500/10">
              <Check className="h-4 w-4 text-green-500" />
              <AlertTitle>Account Created!</AlertTitle>
              <AlertDescription>
                We've sent a confirmation email to <span className="font-semibold">{email}</span>.
              </AlertDescription>
            </Alert>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Next Steps</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>1. Check your inbox (and spam folder) for the confirmation email</p>
                <p>2. Click the link in the email to verify your account</p>
                <p>3. Return here to log in to your account</p>
              </AlertDescription>
            </Alert>

            <div className="mt-6 pt-4">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Try logging in anyway
                </Link>{" "}
                or contact support.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4">
            <Button 
              variant="default" 
              className="w-full"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to home
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SuccessScreen;
