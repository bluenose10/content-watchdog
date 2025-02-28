
import React from 'react';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RateLimitMonitor } from '@/components/monitoring/RateLimitMonitor';
import { SearchAnalytics } from '@/components/monitoring/SearchAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCacheStats } from '@/lib/search-cache';

export default function Monitoring() {
  // Get cache statistics
  const cacheStats = getCacheStats();
  
  return (
    <Layout>
      <div className="container py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">System Monitoring</h1>
        
        <Tabs defaultValue="rate-limits">
          <TabsList className="mb-4">
            <TabsTrigger value="rate-limits">Rate Limits</TabsTrigger>
            <TabsTrigger value="cache">Cache Status</TabsTrigger>
            <TabsTrigger value="search-analytics">Search Analytics</TabsTrigger>
            <TabsTrigger value="api">API Usage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rate-limits">
            <RateLimitMonitor />
          </TabsContent>
          
          <TabsContent value="cache">
            <Card>
              <CardHeader>
                <CardTitle>Cache Statistics</CardTitle>
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
                <CardTitle>API Usage Statistics</CardTitle>
                <CardDescription>Track external API consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  API usage statistics coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
