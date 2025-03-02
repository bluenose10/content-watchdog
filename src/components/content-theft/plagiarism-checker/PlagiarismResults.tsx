
import { PlagiarismResult } from "./PlagiarismChecker";
import { Badge } from "@/components/ui/badge";

interface PlagiarismResultsProps {
  results: PlagiarismResult | null;
}

export const PlagiarismResults = ({ results }: PlagiarismResultsProps) => {
  if (!results) return null;

  const getSeverityColor = (score: number) => {
    if (score < 20) return "bg-green-500";
    if (score < 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getSeverityText = (score: number) => {
    if (score < 20) return "Low";
    if (score < 50) return "Medium";
    return "High";
  };

  return (
    <div className="mt-6 p-4 border rounded-md bg-background">
      <h4 className="text-lg font-medium mb-2">Results</h4>
      <div className="flex items-center space-x-2 mb-4">
        <div className="text-sm font-medium">Similarity Score:</div>
        <div className="text-sm font-bold">
          {results.score.toFixed(1)}%
        </div>
        <Badge variant={results.score < 20 ? "outline" : "default"} className={`px-2 py-0.5 ${
          results.score < 20 
            ? "bg-green-100 text-green-800 border-green-300" 
            : results.score < 50 
              ? "bg-yellow-100 text-yellow-800 border-yellow-300" 
              : "bg-red-100 text-red-800 border-red-300"
        }`}>
          {getSeverityText(results.score)}
        </Badge>
      </div>
      
      {results.matches.length > 0 ? (
        <div className="space-y-4">
          <h5 className="text-sm font-medium">Potential Matches:</h5>
          {results.matches.map((match, index) => (
            <div key={index} className="p-3 bg-accent/40 rounded-md">
              <div className="text-sm italic mb-1">"{match.text}"</div>
              <div className="flex justify-between text-xs">
                <a 
                  href={match.source} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {match.source}
                </a>
                <span className="font-medium">
                  <span className={`inline-block w-2 h-2 rounded-full mr-1 ${getSeverityColor(match.similarity * 100)}`}></span>
                  {(match.similarity * 100).toFixed(1)}% similar
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No significant matches found.</p>
      )}
    </div>
  );
};
