
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SEARCH_TYPES } from "@/lib/constants";
import { createSearchQuery, performGoogleSearch, uploadSearchImage, createSearchResults } from "@/lib/db-service";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Search, Upload } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function ContentSearchSection() {
  const [searchType, setSearchType] = useState(SEARCH_TYPES[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a valid image file (JPEG, PNG, GIF, or WEBP)",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (selectedFile.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setUploadProgress(0);

    try {
      // Check if user is logged in
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please log in to perform searches",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      let imageUrl;
      let searchData;
      let searchResults = [];

      // Create search query in database
      searchData = await createSearchQuery({
        user_id: user.id,
        query_text: searchType !== "image" ? searchQuery : undefined,
        query_type: searchType as any,
        image_url: undefined, // Will update this for image search
      });

      if (searchType === "image" && file) {
        // Show initial upload toast
        toast({
          title: "Uploading image...",
          description: "Please wait while we upload your image",
        });
        
        // Simulate progress updates (in a real app this would come from the upload API)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const newProgress = prev + 10;
            if (newProgress >= 90) {
              clearInterval(progressInterval);
            }
            return newProgress < 90 ? newProgress : 90;
          });
        }, 300);
        
        try {
          imageUrl = await uploadSearchImage(file, user.id);
          
          // Update the search query with the image URL
          await supabase
            .from('search_queries')
            .update({ image_url: imageUrl })
            .eq('id', searchData.id);
          
          // Clear interval and set progress to 100%
          clearInterval(progressInterval);
          setUploadProgress(100);
          
          // Show completion toast
          toast({
            title: "Upload complete",
            description: "Your image has been uploaded successfully",
          });
        } catch (error) {
          clearInterval(progressInterval);
          throw error;
        }
      } else if (searchType !== "image") {
        // For text-based searches, use Google Custom Search API
        toast({
          title: "Searching...",
          description: "Looking for content matches across the web",
        });
        
        try {
          // Perform the Google search
          const googleResults = await performGoogleSearch(searchQuery, user.id);
          
          if (googleResults && googleResults.items) {
            // Transform Google search results to our format
            searchResults = googleResults.items.map((item: any) => ({
              search_id: searchData.id,
              title: item.title,
              url: item.link,
              thumbnail: item.pagemap?.cse_image?.[0]?.src || '/placeholder.svg',
              source: new URL(item.link).hostname,
              match_level: item.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 'High' : 'Medium',
              found_at: new Date().toISOString(),
            }));
            
            // Save search results to the database
            await createSearchResults(searchResults);
            
            toast({
              title: "Search complete",
              description: `Found ${searchResults.length} potential matches`,
            });
          }
        } catch (error) {
          console.error("Google search error:", error);
          toast({
            title: "Search error",
            description: "There was a problem with your search. Please try again.",
            variant: "destructive",
          });
        }
      }

      // Navigate to results page with the search ID
      navigate(`/results?id=${searchData.id}`);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Error",
        description: "There was an error processing your search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-in-from-left">
            <h2 className="text-3xl font-bold">Search For Your Content</h2>
            <p className="text-muted-foreground">
              Our powerful search engine helps you find unauthorized uses of your content across the web. Try it out with your name, username, hashtag, or upload an image.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full bg-green-500"></div>
                <p className="text-sm">Find unauthorized image usage</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full bg-green-500"></div>
                <p className="text-sm">Discover content theft across platforms</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full bg-green-500"></div>
                <p className="text-sm">Track your brand mentions</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full bg-green-500"></div>
                <p className="text-sm">Get detailed violation reports</p>
              </div>
            </div>
          </div>

          <div className="animate-slide-in-from-right">
            <Card className="glass-card">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Label>Search Type</Label>
                    <RadioGroup
                      value={searchType}
                      onValueChange={setSearchType}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      {SEARCH_TYPES.map((type) => (
                        <Label
                          key={type.id}
                          htmlFor={type.id}
                          className="flex items-center justify-between space-x-2 rounded-md border border-border p-3 cursor-pointer hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={type.id} id={type.id} />
                            <span>{type.label}</span>
                          </div>
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>

                  {searchType === "image" ? (
                    <div className="space-y-2">
                      <Label htmlFor="image">Upload Image</Label>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="image"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-secondary/30 hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {uploadProgress > 0 && uploadProgress < 100 ? (
                              <div className="w-full max-w-xs">
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary" 
                                    style={{ width: `${uploadProgress}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-center mt-2">
                                  Uploading... {uploadProgress}%
                                </p>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  {file
                                    ? file.name
                                    : "Click to upload or drag and drop"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  (JPG, PNG, GIF, WEBP up to 10MB)
                                </p>
                              </>
                            )}
                          </div>
                          <input
                            id="image"
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={isLoading}
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="query">
                        {searchType === "name"
                          ? "Enter Name or Username"
                          : "Enter Hashtag"}
                      </Label>
                      <Input
                        id="query"
                        placeholder={
                          searchType === "name"
                            ? "@username or full name"
                            : "#hashtag"
                        }
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full button-animation" 
                    disabled={isLoading || (searchType === "image" && !file) || (searchType !== "image" && !searchQuery)}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    {isLoading ? "Searching..." : "Search Now"}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By using our search service, you agree to our{" "}
                    <Link to="#" className="underline hover:text-primary">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="#" className="underline hover:text-primary">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
