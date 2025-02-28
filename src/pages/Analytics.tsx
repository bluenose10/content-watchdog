
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, BarChartHorizontal, LineChart, PieChart } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { useProtectedRoute, AccessLevel } from "@/hooks/useProtectedRoute";
import { Chart } from "@/components/ui/chart";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// Sample data for charts - in a real app this would come from an API
const searchData = [
  { name: "Jan", searches: 20 },
  { name: "Feb", searches: 35 },
  { name: "Mar", searches: 25 },
  { name: "Apr", searches: 40 },
  { name: "May", searches: 30 },
  { name: "Jun", searches: 55 },
];

const resultsData = [
  { name: "Jan", results: 120 },
  { name: "Feb", results: 210 },
  { name: "Mar", results: 150 },
  { name: "Apr", results: 240 },
  { name: "May", results: 180 },
  { name: "Jun", results: 330 },
];

const sourceDistribution = [
  { name: "Social Media", value: 40 },
  { name: "Forums", value: 30 },
  { name: "News", value: 15 },
  { name: "Blogs", value: 10 },
  { name: "Other", value: 5 },
];

const matchLevelDistribution = [
  { name: "High", value: 45 },
  { name: "Medium", value: 35 },
  { name: "Low", value: 20 },
];

const Analytics = () => {
  const { accessLevel, loading } = useProtectedRoute(true, false);
  const [searchesGrowth, setSearchesGrowth] = useState(0);
  const [resultsGrowth, setResultsGrowth] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Calculate sample growth percentages
    setSearchesGrowth(15.3);
    setResultsGrowth(22.7);
    
    if (accessLevel !== AccessLevel.ANONYMOUS && !loading) {
      toast({
        title: "Analytics Loaded",
        description: "Displaying analytics data for your searches and results.",
      });
    }
  }, [accessLevel, loading, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container max-w-7xl mx-auto py-12 px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-6 text-gradient">Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard 
            title="Total Searches" 
            value="205" 
            icon={BarChart}
            change={searchesGrowth}
            duration="vs last month" 
          />
          <StatsCard 
            title="Total Results" 
            value="1,230" 
            icon={BarChartHorizontal}
            change={resultsGrowth}
            duration="vs last month" 
          />
          <StatsCard 
            title="Avg. Results per Search" 
            value="6.0" 
            icon={PieChart}
            change={5.8}
            duration="vs last month" 
          />
          <StatsCard 
            title="High Match Results" 
            value="553" 
            icon={LineChart}
            change={-2.4}
            duration="vs last month" 
          />
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="searches">Searches</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Search Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <Chart 
                    type="line"
                    data={searchData}
                    dataKey="searches"
                    nameKey="name"
                    height={300}
                    title="Searches"
                    stroke="#8884d8"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Results Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <Chart 
                    type="line"
                    data={resultsData}
                    dataKey="results"
                    nameKey="name"
                    height={300}
                    title="Results"
                    stroke="#82ca9d"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="searches" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Search Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart 
                  type="bar"
                  data={searchData}
                  dataKey="searches"
                  nameKey="name"
                  height={400}
                  title="Searches"
                  fill="#8884d8"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Results Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart 
                  type="area"
                  data={resultsData}
                  dataKey="results"
                  nameKey="name"
                  height={400}
                  title="Results"
                  fill="#82ca9d"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="distribution" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Results by Source</CardTitle>
                </CardHeader>
                <CardContent>
                  <Chart 
                    type="pie"
                    data={sourceDistribution}
                    dataKey="value"
                    nameKey="name"
                    height={300}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Results by Match Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <Chart 
                    type="pie"
                    data={matchLevelDistribution}
                    dataKey="value"
                    nameKey="name"
                    height={300}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;
