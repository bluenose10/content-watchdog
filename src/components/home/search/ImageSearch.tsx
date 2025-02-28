
import { Button } from "@/components/ui/button";
import { ArrowRight, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface ImageSearchProps {
  onSearch: (file: File) => void;
  isLoading?: boolean;
}

export function ImageSearch({ onSearch, isLoading = false }: ImageSearchProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onSearch(selectedFile);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label 
          htmlFor="image-upload" 
          className="relative overflow-hidden bg-accent/30 hover:before:bg-gradient-to-r hover:before:from-purple-500 hover:before:via-purple-400 hover:before:to-purple-500 transition-all duration-300 rounded-lg p-4 text-center cursor-pointer
            before:absolute before:inset-0 before:rounded-lg before:p-[1px] before:bg-gradient-to-r before:from-purple-200 before:via-blue-200 before:to-indigo-200 dark:before:from-purple-900/30 dark:before:via-blue-900/30 dark:before:to-indigo-900/30 before:-z-10
            after:absolute after:inset-[1px] after:rounded-[calc(0.75rem-1px)] after:bg-white dark:after:bg-gray-900 after:-z-10"
        >
          {selectedFile ? (
            <>
              <div className="w-full h-32 relative mb-2">
                <img 
                  src={URL.createObjectURL(selectedFile)} 
                  alt="Preview" 
                  className="h-full mx-auto object-contain"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
              </p>
            </>
          ) : (
            <>
              <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Click to upload an image
              </p>
            </>
          )}
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />
        <Button 
          type="submit" 
          className="mt-2"
          disabled={isLoading || !selectedFile}
        >
          {isLoading ? "Uploading..." : "Search"}
          {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Image search requires <Link to="/login" className="text-primary hover:underline">signing in</Link>
        </p>
      </div>
    </form>
  );
}
