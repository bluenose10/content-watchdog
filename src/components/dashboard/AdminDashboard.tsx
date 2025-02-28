
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chart } from "@/components/ui/chart";
import { CircleDollarSign, Database, BarChart, Server, Activity, AlertTriangle, Clock } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { getApiCallStats, getApiCostEstimates, getStorageStats, getRealTimeMetrics } from "@/lib/api-usage-service";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("monthly");
  const [isLoading, setIsLoading] = useState(true);
  const [apiCallData, setApiCallData] = useState<any[]>([]);
  const [costData, setCostData] = useState<any>({
    costBreakdown: [],
    totalMonthlyCost: 0,
    googleApiCost: 0,
    storageCost: 0,
    supabaseCost: 0,
    monthlyCostData: [],
    costChange: 0
  });
  const [storageData, setStorageData] = useState<any>({
    storageUsage: [],
    totalStorageGB: 0,
    imagesStorageGB: 0,
    databaseStorageGB: 0,
    backupsStorageGB: 0,
    storageGrowthRate: 0
  });
  const [realTimeData, setRealTimeData] = useState<any>({
    timestamps: [],
    apiLoad: [],
    responseTime: [],
    errorRate: [],
    currentLoad: 0,
    avgResponseTime: 0,
    currentErrorRate: '0.00'
  });
  const [totalApiCalls, setTotalApiCalls] = useState(0);
  const [googleApiDistribution, setGoogleApiDistribution] = useState<any[]>([]);
  const [supabaseUsage, setSupabaseUsage] = useState<any[]>([]);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch API call statistics
        const apiStats = await getApiCallStats(timeRange);
        setApiCallData(apiStats.apiCalls);
        setTotalApiCalls(apiStats.totalCalls);
        
        // Set Google API distribution
        setGoogleApiDistribution([
          { name: "Search", value: apiStats.googleApiCalls * 0.8 }, // 80% search
          { name: "Images", value: apiStats.imageApiCalls },
          { name: "Custom Search", value: apiStats.googleApiCalls * 0.2 }, // 20% custom search
        ]);
        
        // Set Supabase usage distribution (rough estimate)
        const readOps = apiStats.totalCalls * 3; // Assuming 3 read ops per search
        const writeOps = apiStats.totalCalls * 0.5; // Assuming 1 write op every 2 searches
        const deleteOps = apiStats.totalCalls * 0.1; // Assuming 1 delete every 10 searches
        const storageOps = apiStats.imageApiCalls;
        
        setSupabaseUsage([
          { operation: "Reads", count: Math.round(readOps) },
          { operation: "Writes", count: Math.round(writeOps) },
          { operation: "Deletes", count: Math.round(deleteOps) },
          { operation: "Storage", count: storageOps },
        ]);
        
        // Fetch cost estimates
        const costEstimates = await getApiCostEstimates();
        setCostData(costEstimates);
        
        // Fetch storage statistics
        const storageStats = await getStorageStats();
        setStorageData(storageStats);
        
        // Fetch real-time metrics
        const metrics = await getRealTimeMetrics();
        setRealTimeData(metrics);
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
    
    // Set up automatic refresh on the real-time tab
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
    
    // Only set up interval if on real-time tab
    if (timeRange === "realtime") {
      const interval = window.setInterval(async () => {
        try {
          const metrics = await getRealTimeMetrics();
          setRealTimeData(metrics);
        } catch (error) {
          console.error("Error refreshing real-time metrics:", error);
        }
      }, 30000); // Refresh every 30 seconds
      
      setRefreshInterval(interval);
    }
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [timeRange]);

  // Helper function to render skeleton or content
  const renderContent = (content: React.ReactNode) => {
    return isLoading ? (
      <div className="space-y-4">
        <Skeleton className="h-[350px] w-full" />
      </div>
    ) : content;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-4">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Monitoring system resource usage and costs. This data is visible only to administrators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total API Calls"
          value={isLoading ? "Loading..." : totalApiCalls.toLocaleString()}
          icon={Server}
          description="All time"
          change={12} // This would be calculated in a real application
        />
        <StatsCard
          title="Storage Used"
          value={isLoading ? "Loading..." : `${storageData.totalStorageGB} GB`}
          icon={Database}
          description="Total usage"
          change={storageData.storageGrowthRate}
        />
        <StatsCard
          title="Search API Cost"
          value={isLoading ? "Loading..." : `$${costData.googleApiCost.toLocaleString()}`}
          icon={BarChart}
          description="Estimated total"
          change={-3} // This would be calculated in a real application
        />
        <StatsCard
          title="Total Monthly Cost"
          value={isLoading ? "Loading..." : `$${costData.totalMonthlyCost.toLocaleString()}`}
          icon={CircleDollarSign}
          description="Estimated"
          change={costData.costChange}
        />
      </div>

      <Tabs defaultValue="api-usage" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="w-fit">
            <TabsTrigger value="api-usage">API Usage</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
          </TabsList>
          <div>
            <select
              className="p-2 border rounded-md bg-background"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="realtime">Real-time</option>
            </select>
          </div>
        </div>

        <TabsContent value="api-usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Calls by Service</CardTitle>
              <CardDescription>
                Number of API calls to different services over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              {renderContent(
                <Chart
                  type="line"
                  data={apiCallData}
                  dataKey="google"
                  nameKey="date"
                  height={350}
                  title="Google API Calls"
                  stroke="#8884d8"
                />
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Google API Distribution</CardTitle>
                <CardDescription>
                  Breakdown of Google API calls by endpoint
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {renderContent(
                  <Chart
                    type="pie"
                    data={googleApiDistribution}
                    dataKey="value"
                    nameKey="name"
                    height={250}
                  />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Supabase API Usage</CardTitle>
                <CardDescription>
                  Distribution of Supabase operations
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {renderContent(
                  <Chart
                    type="bar"
                    data={supabaseUsage}
                    dataKey="count"
                    nameKey="operation"
                    height={250}
                    fill="#82ca9d"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Storage Usage Over Time</CardTitle>
              <CardDescription>
                Storage consumption in GB across different categories
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              {renderContent(
                <Chart
                  type="area"
                  data={storageData.storageUsage}
                  dataKey="images"
                  nameKey="date"
                  height={350}
                  title="Images Storage (GB)"
                  fill="rgba(136, 132, 216, 0.6)"
                  stroke="#8884d8"
                />
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Storage Distribution</CardTitle>
                <CardDescription>
                  Current storage usage by category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {renderContent(
                  <Chart
                    type="pie"
                    data={[
                      { name: "Images", value: storageData.imagesStorageGB },
                      { name: "Database", value: storageData.databaseStorageGB },
                      { name: "Backups", value: storageData.backupsStorageGB },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    height={250}
                  />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Storage Growth Rate</CardTitle>
                <CardDescription>
                  Monthly increase in storage (GB)
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {renderContent(
                  <Chart
                    type="bar"
                    data={storageData.storageUsage
                      .slice(-5)
                      .map((entry: any, index: number, array: any[]) => {
                        const prevMonth = index > 0 ? array[index - 1].images : 0;
                        return {
                          month: entry.date.split('-')[1], // Extract month
                          growth: +(entry.images - prevMonth).toFixed(1)
                        };
                      })}
                    dataKey="growth"
                    nameKey="month"
                    height={250}
                    fill="#82ca9d"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Cost Breakdown</CardTitle>
              <CardDescription>
                Analysis of costs by service category
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              {renderContent(
                <Chart
                  type="pie"
                  data={costData.costBreakdown}
                  dataKey="value"
                  nameKey="name"
                  height={350}
                />
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cost Trends</CardTitle>
                <CardDescription>
                  Monthly costs over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {renderContent(
                  <Chart
                    type="line"
                    data={costData.monthlyCostData}
                    dataKey="cost"
                    nameKey="month"
                    height={250}
                    stroke="#ff7300"
                  />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cost Per Service</CardTitle>
                <CardDescription>
                  Breakdown of costs by service type
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {renderContent(
                  <Chart
                    type="bar"
                    data={[
                      { service: "Google APIs", cost: costData.googleApiCost },
                      { service: "Supabase", cost: costData.supabaseCost },
                      { service: "Storage", cost: costData.storageCost },
                    ]}
                    dataKey="cost"
                    nameKey="service"
                    height={250}
                    fill="#8884d8"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <StatsCard
              title="Current API Load"
              value={`${realTimeData.currentLoad}%`}
              icon={Activity}
              description="Live metric"
            />
            <StatsCard
              title="Avg Response Time"
              value={`${realTimeData.avgResponseTime} ms`}
              icon={Clock}
              description="Last 24 hours"
            />
            <StatsCard
              title="Error Rate"
              value={`${realTimeData.currentErrorRate}%`}
              icon={AlertTriangle}
              description="Current"
            />
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>API Load (Last 24 Hours)</CardTitle>
                  <CardDescription>
                    Percentage of API capacity utilized
                  </CardDescription>
                </div>
                <Badge variant="outline" className="ml-2">
                  Auto-refreshes every 30s
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="h-80">
              {renderContent(
                <Chart
                  type="area"
                  data={realTimeData.timestamps.map((timestamp: string, index: number) => ({
                    time: new Date(timestamp).toLocaleTimeString(),
                    load: realTimeData.apiLoad[index]
                  }))}
                  dataKey="load"
                  nameKey="time"
                  height={300}
                  fill="rgba(130, 202, 157, 0.5)"
                  stroke="#82ca9d"
                />
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Response Time (ms)</CardTitle>
                <CardDescription>
                  API response times over the last 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {renderContent(
                  <Chart
                    type="line"
                    data={realTimeData.timestamps.map((timestamp: string, index: number) => ({
                      time: new Date(timestamp).toLocaleTimeString(),
                      response: realTimeData.responseTime[index]
                    }))}
                    dataKey="response"
                    nameKey="time"
                    height={250}
                    stroke="#8884d8"
                  />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Error Rate (%)</CardTitle>
                <CardDescription>
                  Percentage of API calls resulting in errors
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {renderContent(
                  <Chart
                    type="line"
                    data={realTimeData.timestamps.map((timestamp: string, index: number) => ({
                      time: new Date(timestamp).toLocaleTimeString(),
                      error: realTimeData.errorRate[index]
                    }))}
                    dataKey="error"
                    nameKey="time"
                    height={250}
                    stroke="#ff7300"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
