
import { PlagiarismResult } from "./PlagiarismChecker";

interface PlagiarismResultsProps {
  results: PlagiarismResult | null;
}

export const PlagiarismResults = ({ results }: PlagiarismResultsProps) => {
  if (!results) return null;

  return (
    <div className="mt-6 p-4 border rounded-md bg-background">
      <h4 className="text-lg font-medium mb-2">Results</h4>
      <div className="flex items-center space-x-2 mb-4">
        <div className="text-sm font-medium">Similarity Score:</div>
        <div className="text-sm font-bold">
          {results.score.toFixed(1)}%
        </div>
        <div 
          className={`w-2 h-2 rounded-full ${
            results.score < 20 
              ? "bg-green-500" 
              : results.score < 50 
                ? "bg-yellow-500" 
                : "bg-red-500"
          }`}
        />
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
