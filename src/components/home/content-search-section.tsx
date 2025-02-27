
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Image, Hash, AtSign } from "lucide-react";
import { Link } from "react-router-dom";

export function ContentSearchSection() {
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
            <Tabs defaultValue="name" className="w-full">
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
              <TabsContent value="name">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input placeholder="Enter your name or username" />
                  <Button asChild className="whitespace-nowrap">
                    <Link to="/search">
                      Search
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="hashtag">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input placeholder="Enter a hashtag" />
                  <Button asChild className="whitespace-nowrap">
                    <Link to="/search">
                      Search
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="image">
                <div className="flex flex-col gap-2">
                  <div className="bg-accent/30 border border-dashed border-accent hover:border-primary transition-colors rounded-lg p-4 text-center cursor-pointer">
                    <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Click to upload an image
                    </p>
                  </div>
                  <Button asChild className="mt-2">
                    <Link to="/search">
                      Search
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
