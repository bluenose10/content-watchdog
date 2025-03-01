
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Info, Fingerprint, AlertCircle } from "lucide-react";
import { AuthenticityCheck } from "./PlagiarismChecker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthenticityDisplayProps {
  authenticityCheck: AuthenticityCheck | undefined;
}

export const AuthenticityDisplay: React.FC<AuthenticityDisplayProps> = ({ authenticityCheck }) => {
  if (!authenticityCheck) return null;

  const { 
    isAuthentic, 
    aiGeneratedProbability, 
    manipulationProbability, 
    originalityScore,
    detailsText,
    verificationMethod
  } = authenticityCheck;

  // Visual indicators based on the verification results
  const getAuthenticityStatusColor = () => {
    if (isAuthentic) return "bg-green-500";
    return "bg-red-500";
  };

  const getAuthenticityStatusText = () => {
    if (isAuthentic) return "Authentic Content";
    return "Suspicious Content";
  };

  const getAuthenticityStatusIcon = () => {
    if (isAuthentic) return <CheckCircle className="h-5 w-5 text-green-500" />;
    return <AlertTriangle className="h-5 w-5 text-red-500" />;
  };

  return (
    <Card className="border border-blue-200 mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Fingerprint className="h-5 w-5" />
          Content Authenticity Verification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {getAuthenticityStatusIcon()}
            <span className="font-medium">{getAuthenticityStatusText()}</span>
          </div>
          <Badge 
            variant={isAuthentic ? "outline" : "destructive"}
            className="px-2 py-1"
          >
            {isAuthentic ? "Verified" : "Suspicious"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">AI Generated Probability</p>
            <div className="flex justify-between mb-1">
              <span className="text-xs">Low</span>
              <span className="text-xs font-semibold">{Math.round(aiGeneratedProbability * 100)}%</span>
              <span className="text-xs">High</span>
            </div>
            <Progress value={aiGeneratedProbability * 100} className="h-2" />
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Manipulation Probability</p>
            <div className="flex justify-between mb-1">
              <span className="text-xs">Low</span>
              <span className="text-xs font-semibold">{Math.round(manipulationProbability * 100)}%</span>
              <span className="text-xs">High</span>
            </div>
            <Progress value={manipulationProbability * 100} className="h-2" />
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-1">Originality Score</p>
          <div className="flex justify-between mb-1">
            <span className="text-xs">Low</span>
            <span className="text-xs font-semibold">{Math.round(originalityScore * 100)}%</span>
            <span className="text-xs">High</span>
          </div>
          <Progress value={originalityScore * 100} className="h-2" />
        </div>

        {detailsText && (
          <Alert variant="default" className="mt-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Verification Details</AlertTitle>
            <AlertDescription>
              {detailsText}
              {verificationMethod && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Verification method: {verificationMethod}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
