
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Image, Hash, AtSign } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createSearchQuery, uploadSearchImage } from "@/lib/db-service";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { SearchQuery } from "@/lib/db-types";

export function ContentSearchSection() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchType, setSearchType] = useState("name");
  const [nameQuery, setNameQuery] = useState("");
  const [hashtagQuery, setHashtagQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let searchData: SearchQuery = {
        user_id: user?.id || '00000000-0000-0000-0000-000000000000', // Anonymous user ID
        query_type: searchType as "name" | "hashtag" | "image",
      };

      if (searchType === "name" && nameQuery.trim()) {
        searchData.query_text = nameQuery.trim();
      } else if (searchType === "hashtag" && hashtagQuery.trim()) {
        searchData.query_text = hashtagQuery.trim();
      } else if (searchType === "image" && selectedFile) {
        if (!user) {
          toast({
            title: "Sign in required",
            description: "Please sign in to use image search",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }
        setIsUploading(true);
        const imageUrl = await uploadSearchImage(selectedFile, user.id);
        searchData.image_url = imageUrl;
      } else {
        toast({
          title: "Search input required",
          description: "Please enter a search term or select an image",
          variant: "destructive",
        });
        return;
      }

      let searchId;
      if (user) {
        // For registered users, create a permanent search query
        const newSearch = await createSearchQuery(searchData);
        if (newSearch && newSearch.id) {
          searchId = newSearch.id;
        } else {
          throw new Error("Failed to create search");
        }
      } else {
        // For anonymous users, create a temporary search ID
        searchId = crypto.randomUUID();
        // Store search data in session storage for anonymous users
        sessionStorage.setItem(`temp_search_${searchId}`, JSON.stringify(searchData));
      }

      // Navigate to results page
      navigate(`/results?id=${searchId}`);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "There was a problem with your search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section id="search" className="h-full">
      <div className="h-full">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Content Search</h2>
          <p className="text-sm text-muted-foreground">
            Find and protect your content
          </p>
        </div>

        <Card className="glass-card">
          <CardContent className="p-4 sm:p-6">
            <Tabs 
              defaultValue="name" 
              className="w-full"
              onValueChange={(value) => setSearchType(value)}
            >
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="name" className="text-xs sm:text-sm">
                  <AtSign className="h-3 w-3 mr-1" />
                  Name
                </TabsTrigger>
                <TabsTrigger value="hashtag" className="text-xs sm:text-sm">
                  <Hash className="h-3 w-3 mr-1" />
                  Hashtag
                </TabsTrigger>
                <TabsTrigger value="image" className="text-xs sm:text-sm">
                  <Image className="h-3 w-3 mr-1" />
                  Image
                </TabsTrigger>
              </TabsList>
              <form onSubmit={handleSearch}>
                <TabsContent value="name">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input 
                      placeholder="Enter your name or username" 
                      value={nameQuery}
                      onChange={(e) => setNameQuery(e.target.value)}
                      required
                    />
                    <Button type="submit" className="whitespace-nowrap">
                      Search
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    You can try a free preview without signing in
                  </p>
                </TabsContent>
                <TabsContent value="hashtag">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input 
                      placeholder="Enter a hashtag" 
                      value={hashtagQuery}
                      onChange={(e) => setHashtagQuery(e.target.value)}
                      required
                    />
                    <Button type="submit" className="whitespace-nowrap">
                      Search
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    You can try a free preview without signing in
                  </p>
                </TabsContent>
                <TabsContent value="image">
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
                      disabled={isUploading || !selectedFile}
                    >
                      {isUploading ? "Uploading..." : "Search"}
                      {!isUploading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      Image search requires <Link to="/login" className="text-primary hover:underline">signing in</Link>
                    </p>
                  </div>
                </TabsContent>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
