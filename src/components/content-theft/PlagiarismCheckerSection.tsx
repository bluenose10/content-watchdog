
import React, { useState } from 'react';
import { FileUploader } from '@/components/content-theft/plagiarism-checker/FileUploader';
import { PlagiarismAnalyzer } from '@/components/content-theft/plagiarism-checker/PlagiarismAnalyzer';
import { PlagiarismResult } from '@/components/content-theft/plagiarism-checker/PlagiarismChecker';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';

export function PlagiarismCheckerSection() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [results, setResults] = useState<PlagiarismResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setResults(null);
  };

  const handleResultsGenerated = (analysisResults: PlagiarismResult) => {
    setResults(analysisResults);
  };

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
        <FileUploader onFileUpload={handleFileUpload} />
      ) : (
        <PlagiarismAnalyzer 
          file={uploadedFile} 
          onResultsGenerated={handleResultsGenerated}
          onResetFile={() => setUploadedFile(null)}
          isAnalyzing={isAnalyzing}
          setIsAnalyzing={setIsAnalyzing}
        />
      )}
    </div>
  );
}
