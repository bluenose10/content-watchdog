
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";

interface SuccessScreenProps {
  email: string;
}

const SuccessScreen = ({ email }: SuccessScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="glass-card overflow-hidden">
          <div className="bg-green-500/10 py-6 flex flex-col items-center justify-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
            <CardTitle className="text-2xl text-center">Sign Up Successful!</CardTitle>
          </div>
          
          <CardContent className="pt-6 pb-8">
            <CardDescription className="text-center mb-6 text-base">
              Thank you for signing up with InfluenceGuard
            </CardDescription>
            
            <Alert variant="success" className="mb-6">
              <Mail className="h-4 w-4 mr-2" />
              <AlertDescription>
                A confirmation email has been sent to <span className="font-medium">{email}</span>. 
                Please check your inbox and click the confirmation link to activate your account.
              </AlertDescription>
            </Alert>
            
            <div className="text-sm text-muted-foreground mb-6">
              <p className="mb-2">If you don't see the email:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Check your spam or junk folder</li>
                <li>Make sure you entered the correct email address</li>
                <li>Wait a few minutes as email delivery might be delayed</li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button asChild variant="default" className="w-full">
                <Link to="/login">Go to Login</Link>
              </Button>
              
              <Button asChild variant="outline">
                <Link to="/">Return to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuccessScreen;
