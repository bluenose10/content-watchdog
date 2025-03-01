
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { PlagiarismResult } from "./PlagiarismChecker";
import { Clipboard, ExternalLink } from "lucide-react";
import { AuthenticityDisplay } from "./AuthenticityDisplay";

interface PlagiarismResultsProps {
  results: PlagiarismResult | null;
}

export const PlagiarismResults: React.FC<PlagiarismResultsProps> = ({ results }) => {
  if (!results) return null;

  const getScoreColorClass = (score: number) => {
    if (score < 20) return "bg-green-500";
    if (score < 40) return "bg-yellow-500";
    if (score < 60) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score < 20) return "Original";
    if (score < 40) return "Minor Similarities";
    if (score < 60) return "Moderate Similarities";
    return "Significant Plagiarism";
  };

  const copyTextToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 shadow-sm border">
        <h3 className="text-xl font-semibold mb-4">Plagiarism Score</h3>
        <div className="space-y-4">
          <div className="flex justify-between mb-2">
            <span>{getScoreLabel(results.score)}:</span>
            <span className="font-bold">{results.score}%</span>
          </div>
          
          <Progress 
            value={results.score} 
            className="h-2 w-full" 
          />
          
          <div className="flex justify-between">
            <span className="text-xs text-green-500">Original</span>
            <span className="text-xs text-red-500">Plagiarized</span>
          </div>
        </div>
      </div>

      {/* Add the new authenticity verification display */}
      {results.authenticityCheck && (
        <AuthenticityDisplay authenticityCheck={results.authenticityCheck} />
      )}

      {results.aiAnalysis && (
        <div className="bg-card rounded-lg p-6 shadow-sm border border-blue-200">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span>AI Analysis</span>
            {results.aiConfidenceScore !== undefined && (
              <span className="text-sm ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                {Math.round(results.aiConfidenceScore)}% Confidence
              </span>
            )}
          </h3>
          <p className="text-muted-foreground whitespace-pre-line">{results.aiAnalysis}</p>
        </div>
      )}

      {results.matches.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Potential Matches ({results.matches.length})</h3>
          {results.matches.map((match, index) => (
            <div key={index} className="bg-card rounded-lg p-4 shadow-sm border">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-lg">Match #{index + 1}</h4>
                <span className="text-sm px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                  {Math.round(match.similarity * 100)}% Similar
                </span>
              </div>
              
              <div className="mt-2 relative group">
                <p className="text-sm my-2 p-3 bg-muted rounded-md">
                  "{match.text}"
                </p>
                <button 
                  onClick={() => copyTextToClipboard(match.text)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy text"
                >
                  <Clipboard size={16} />
                </button>
              </div>
              
              <div className="flex items-center mt-2 text-sm">
                <span className="text-muted-foreground mr-2">Source:</span>
                <a 
                  href={match.source} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:text-blue-700 flex items-center truncate"
                >
                  {new URL(match.source).hostname}
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        results && (
          <Alert>
            <AlertTitle>No significant matches found</AlertTitle>
            <AlertDescription>
              Our search didn't find any significant matches to existing online content. This suggests the text is likely original.
              {results.aiAnalysis ? " However, you should still review the AI analysis above." : ""}
            </AlertDescription>
          </Alert>
        )
      )}
    </div>
  );
};
