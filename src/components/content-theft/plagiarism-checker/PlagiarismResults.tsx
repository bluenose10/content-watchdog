
import { PlagiarismResult } from "./PlagiarismChecker";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, AlertTriangle, Check, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PlagiarismResultsProps {
  results: PlagiarismResult | null;
}

export const PlagiarismResults = ({ results }: PlagiarismResultsProps) => {
  if (!results) return null;

  const { score, matches, aiAnalysis, aiConfidenceScore } = results;

  // Determine severity level based on score
  let severity: 'low' | 'medium' | 'high' = 'low';
  if (score > 60) {
    severity = 'high';
  } else if (score > 30) {
    severity = 'medium';
  }

  // Style classes based on severity
  const severityClasses = {
    low: {
      text: 'text-green-600 dark:text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      progress: 'bg-green-500'
    },
    medium: {
      text: 'text-yellow-600 dark:text-yellow-500',
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      progress: 'bg-yellow-500'
    },
    high: {
      text: 'text-red-600 dark:text-red-500',
      bg: 'bg-red-100 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      progress: 'bg-red-500'
    }
  };

  const severityText = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk'
  };

  return (
    <div className="space-y-6 mt-4">
      {/* Overall Score Section */}
      <div>
        <h4 className="text-lg font-semibold mb-2">Plagiarism Analysis</h4>
        <div className="flex items-center space-x-4 mb-2">
          <Progress 
            value={score} 
            className="h-2 flex-1"
            indicatorClassName={severityClasses[severity].progress}
          />
          <span className="font-semibold text-lg">{score}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            variant="outline" 
            className={`${severityClasses[severity].bg} ${severityClasses[severity].border} ${severityClasses[severity].text}`}
          >
            {severityText[severity]}
          </Badge>
          
          {/* AI Badge if AI analysis was used */}
          {aiAnalysis && (
            <Badge 
              variant="outline" 
              className="bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center gap-1"
            >
              <Bot size={12} />
              AI Enhanced
            </Badge>
          )}
        </div>
      </div>

      {/* AI Analysis Section */}
      {aiAnalysis && (
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Bot size={16} className="text-purple-600 dark:text-purple-400" />
            <h4 className="font-semibold">AI Analysis</h4>
            {aiConfidenceScore !== undefined && (
              <Badge variant="outline" className="ml-auto">
                Confidence: {aiConfidenceScore}%
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {aiAnalysis}
          </p>
        </div>
      )}

      {/* Matched Content Section */}
      {matches.length > 0 ? (
        <div>
          <h4 className="text-lg font-semibold mb-2">Potential Matches</h4>
          <div className="space-y-3">
            {matches.map((match, i) => (
              <Card key={i} className="p-3 text-sm">
                <p className="mb-2">&quot;{match.text}&quot;</p>
                <div className="flex justify-between items-center">
                  <a 
                    href={match.source} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {new URL(match.source).hostname}
                  </a>
                  <Badge>
                    {Math.round(match.similarity * 100)}% match
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        score === 0 && (
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription>
              No significant matches found. The content appears to be original.
            </AlertDescription>
          </Alert>
        )
      )}

      {/* Disclaimer */}
      <div className="text-xs text-muted-foreground border-t pt-4">
        <div className="flex items-center gap-1 mb-1">
          <AlertTriangle size={12} />
          <span className="font-medium">Disclaimer:</span>
        </div>
        <p>
          This tool provides an automated assessment and may not catch all instances of plagiarism or may falsely identify 
          content as plagiarized. Results should be verified manually. The AI analysis is provided for informational 
          purposes only and should not be considered definitive.
        </p>
      </div>
    </div>
  );
};
