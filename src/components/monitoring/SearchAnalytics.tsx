
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RefreshCw, Filter, BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - in a real implementation, this would come from your analytics service
const getMockSearchData = () => {
  return {
    totalSearches: 1285,
    uniqueSearchTerms: 342,
    averageResultsPerSearch: 24.6,
    successRate: 94.2,
    searchGrowth: 18.4,
    
    searchTypes: [
      { name: 'Name Searches', value: 680 },
      { name: 'Hashtag Searches', value: 425 },
      { name: 'Image Searches', value: 180 },
    ],
    
    popularTerms: [
      { term: 'netflix', count: 78, type: 'name' },
      { term: 'marvel', count: 65, type: 'name' },
      { term: '#gaming', count: 54, type: 'hashtag' },
      { term: '#travel', count: 48, type: 'hashtag' },
      { term: 'disney', count: 42, type: 'name' },
      { term: 'profile.jpg', count: 39, type: 'image' },
      { term: 'apple', count: 36, type: 'name' },
      { term: '#food', count: 33, type: 'hashtag' },
      { term: 'product-photo.png', count: 31, type: 'image' },
      { term: 'facebook', count: 29, type: 'name' },
    ],
    
    searchesByDay: [
      { date: '2023-05-01', searches: 38 },
      { date: '2023-05-02', searches: 42 },
      { date: '2023-05-03', searches: 35 },
      { date: '2023-05-04', searches: 29 },
      { date: '2023-05-05', searches: 45 },
      { date: '2023-05-06', searches: 53 },
      { date: '2023-05-07', searches: 64 },
      { date: '2023-05-08', searches: 71 },
      { date: '2023-05-09', searches: 82 },
      { date: '2023-05-10', searches: 76 },
      { date: '2023-05-11', searches: 68 },
      { date: '2023-05-12', searches: 74 },
      { date: '2023-05-13', searches: 79 },
      { date: '2023-05-14', searches: 85 },
    ],
    
    apiUsage: [
      { api: 'Google Search API', cost: 142.50, calls: 680, avgResponse: 220 },
      { api: 'Image Recognition API', cost: 95.20, calls: 180, avgResponse: 450 },
      { api: 'Social Media API', cost: 77.80, calls: 425, avgResponse: 310 },
    ]
  };
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

export function SearchAnalytics() {
  const [data] = useState(getMockSearchData());
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Search Analytics Dashboard</h2>
        <Button variant="outline" size="sm" className="gap-1">
          <RefreshCw className="h-4 w-4" /> Refresh Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Searches" 
          value={data.totalSearches} 
          icon={BarChart3}
          change={data.searchGrowth}
          duration="vs. last month"
        />
        <StatsCard 
          title="Unique Search Terms" 
          value={data.uniqueSearchTerms} 
          icon={Filter}
          description="Across all search types"
        />
        <StatsCard 
          title="Avg. Results" 
          value={data.averageResultsPerSearch} 
          icon={TrendingUp}
          description="Per search"
        />
        <StatsCard 
          title="Success Rate" 
          value={`${data.successRate}%`} 
          icon={PieChartIcon}
          description="Searches with results"
        />
      </div>
      
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Search Trends</TabsTrigger>
          <TabsTrigger value="api-usage">API Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Search Types Distribution</CardTitle>
                <CardDescription>Breakdown of different search methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.searchTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.searchTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip 
                        formatter={(value) => [`${value} searches`, 'Count']} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Search Terms</CardTitle>
                <CardDescription>Top 10 most searched terms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Term</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.popularTerms.map((term, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{term.term}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              term.type === 'name' 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                                : term.type === 'hashtag' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                            }`}>
                              {term.type}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{term.count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Volume Over Time</CardTitle>
              <CardDescription>Daily search activity for the past 14 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.searchesByDay}>
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth()+1}/${date.getDate()}`;
                      }} 
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return `Date: ${date.toLocaleDateString()}`;
                      }}
                      formatter={(value) => [`${value} searches`, 'Volume']} 
                    />
                    <Bar dataKey="searches" fill="#8884d8" name="Searches" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api-usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Usage & Cost Analysis</CardTitle>
              <CardDescription>Breakdown of API usage across search types</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>API Service</TableHead>
                    <TableHead className="text-right">API Calls</TableHead>
                    <TableHead className="text-right">Avg Response (ms)</TableHead>
                    <TableHead className="text-right">Cost ($)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.apiUsage.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.api}</TableCell>
                      <TableCell className="text-right">{item.calls.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.avgResponse}ms</TableCell>
                      <TableCell className="text-right">${item.cost.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="text-right font-bold">
                      {data.apiUsage.reduce((acc, item) => acc + item.calls, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {Math.round(data.apiUsage.reduce((acc, item) => acc + (item.avgResponse * item.calls), 0) / 
                        data.apiUsage.reduce((acc, item) => acc + item.calls, 0))}ms
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      ${data.apiUsage.reduce((acc, item) => acc + item.cost, 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
