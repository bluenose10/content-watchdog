
import React, { useEffect } from 'react';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RateLimitMonitor } from '@/components/monitoring/RateLimitMonitor';
import { SearchAnalytics } from '@/components/monitoring/SearchAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCacheStats } from '@/lib/search-cache';
import { PreFetchManager } from '@/components/monitoring/PreFetchManager';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function Monitoring() {
  // Get cache statistics
  const cacheStats = getCacheStats();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check authentication
  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to access System Monitoring",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [user, loading, navigate, toast]);
  
  // Show loading state while checking auth
  if (loading) {
    return (
      <Layout>
        <div className="container py-8 max-w-7xl">
          <h1 className="text-2xl font-bold mb-8 text-gradient">System Monitoring</h1>
          <div className="flex justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container pt-24 pb-12 px-4 sm:px-6 max-w-7xl">
        <h1 className="text-2xl font-bold mb-8 text-gradient">System Monitoring</h1>
        
        <Tabs defaultValue="rate-limits">
          <TabsList className="mb-4">
            <TabsTrigger value="rate-limits">Rate Limits</TabsTrigger>
            <TabsTrigger value="cache">Cache Status</TabsTrigger>
            <TabsTrigger value="search-analytics">Search Analytics</TabsTrigger>
            <TabsTrigger value="api">API Usage</TabsTrigger>
            <TabsTrigger value="prefetch">Pre-Fetching</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rate-limits">
            <RateLimitMonitor />
          </TabsContent>
          
          <TabsContent value="cache">
            <Card>
              <CardHeader>
                <CardTitle className="text-gradient">Cache Statistics</CardTitle>
                <CardDescription>Performance metrics for the search cache</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium">Cache Size</h3>
                    <p className="text-2xl font-bold mt-2">{cacheStats.size} entries</p>
                  </div>
                  
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium">Hit Rate</h3>
                    <p className="text-2xl font-bold mt-2">{(cacheStats.hitRate * 100).toFixed(1)}%</p>
                  </div>
                  
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium">Average Hits</h3>
                    <p className="text-2xl font-bold mt-2">{cacheStats.averageHitCount.toFixed(1)} per entry</p>
                  </div>
                </div>
                
                {cacheStats.popularQueries.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">Popular Cached Queries</h3>
                    <ul className="space-y-2">
                      {cacheStats.popularQueries.map((query, index) => (
                        <li key={index} className="flex justify-between p-2 bg-muted/50 rounded">
                          <span className="truncate max-w-[70%]">{query.key}</span>
                          <span className="font-medium">{query.hits} hits</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="search-analytics">
            <SearchAnalytics />
          </TabsContent>
          
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle className="text-gradient">API Usage Statistics</CardTitle>
                <CardDescription>Track external API consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  API usage statistics coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="prefetch">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PreFetchManager />
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-gradient">How Pre-Fetching Works</CardTitle>
                  <CardDescription>Understanding the pre-caching system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <p>
                      Pre-fetching automatically caches results for common searches during low-traffic periods,
                      reducing response times for users and server load during peak hours.
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Benefits:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Faster search results for common queries</li>
                        <li>Reduced API costs by minimizing redundant searches</li>
                        <li>Lower server load during peak traffic hours</li>
                        <li>Improved user experience with instant results</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">How it works:</h4>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>System identifies popular searches from user history</li>
                        <li>During off-peak hours, these searches are automatically performed</li>
                        <li>Results are stored in the application cache</li>
                        <li>When users perform these searches, cached results are returned instantly</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
