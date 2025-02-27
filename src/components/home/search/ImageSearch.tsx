
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
          className="bg-accent/30 border border-dashed border-accent hover:border-primary transition-colors rounded-lg p-4 text-center cursor-pointer"
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
