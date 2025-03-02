
import React, { useState } from 'react';
import { FileUploader } from '@/components/content-theft/plagiarism-checker/FileUploader';
import { usePlagiarismAnalyzer } from '@/components/content-theft/plagiarism-checker/PlagiarismAnalyzer';
import { PlagiarismResult } from '@/components/content-theft/plagiarism-checker/PlagiarismChecker';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';

export function PlagiarismCheckerSection() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [results, setResults] = useState<PlagiarismResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);

  const handleFileChange = (file: File | null) => {
    setUploadedFile(file);
    setResults(null);
  };

  const { uploadAndCheckPlagiarism } = usePlagiarismAnalyzer({
    file: uploadedFile,
    setResults,
    setIsUploading,
    isUploading,
    setSaveError,
    setLastCheckTime
  });

  return (
    <div className="w-full">
      <div className="mb-6">
        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle>AI-Powered Matching</AlertTitle>
          <AlertDescription>
            Our plagiarism checker uses advanced machine learning algorithms to analyze text similarity. 
            The system evaluates TF-IDF patterns, phrase matches, and content distribution to deliver 
            higher accuracy than traditional keyword matching.
          </AlertDescription>
        </Alert>
      </div>

      {!uploadedFile ? (
        <FileUploader 
          file={null}
          setFile={handleFileChange}
          isUploading={isUploading}
          onSubmit={() => {}}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)}MB
              </p>
            </div>
            <button
              onClick={() => setUploadedFile(null)}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
          
          <FileUploader 
            file={uploadedFile}
            setFile={handleFileChange}
            isUploading={isUploading}
            onSubmit={uploadAndCheckPlagiarism}
          />
          
          {results && (
            <div className="mt-8 p-4 border rounded-lg">
              <h3 className="text-xl font-bold mb-4">Plagiarism Analysis Results</h3>
              <div className="mb-4">
                <p className="mb-2">Similarity Score:</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full ${
                      results.score > 70 ? 'bg-red-500' : 
                      results.score > 40 ? 'bg-yellow-500' : 'bg-green-500'
                    }`} 
                    style={{ width: `${results.score}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-right font-medium">{results.score}%</p>
              </div>
              
              {results.matches.length > 0 ? (
                <div>
                  <h4 className="font-semibold mb-2">Potential Matches:</h4>
                  <ul className="space-y-4">
                    {results.matches.map((match, index) => (
                      <li key={index} className="p-3 border rounded">
                        <p className="text-sm mb-2">"{match.text}"</p>
                        <div className="flex items-center justify-between text-xs">
                          <a 
                            href={match.source} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {match.source}
                          </a>
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {Math.round(match.similarity * 100)}% similar
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No matches found. Your content appears to be original.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
