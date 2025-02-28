
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chart } from "@/components/ui/chart";
import { CircleDollarSign, Database, Search, Server } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

// Mock data for API usage
const apiUsageData = [
  { date: "2023-06", google: 350, supabase: 1200, other: 150 },
  { date: "2023-07", google: 420, supabase: 1350, other: 180 },
  { date: "2023-08", google: 380, supabase: 1400, other: 210 },
  { date: "2023-09", google: 450, supabase: 1500, other: 190 },
  { date: "2023-10", google: 520, supabase: 1650, other: 230 },
  { date: "2023-11", google: 580, supabase: 1800, other: 250 },
  { date: "2023-12", google: 620, supabase: 2000, other: 280 },
  { date: "2024-01", google: 580, supabase: 1950, other: 270 },
  { date: "2024-02", google: 650, supabase: 2100, other: 290 },
  { date: "2024-03", google: 700, supabase: 2300, other: 310 },
  { date: "2024-04", google: 750, supabase: 2400, other: 330 },
  { date: "2024-05", google: 800, supabase: 2600, other: 350 },
];

// Mock data for storage usage
const storageUsageData = [
  { date: "2023-06", images: 1.2, data: 0.3, backups: 0.1 },
  { date: "2023-07", images: 1.3, data: 0.4, backups: 0.1 },
  { date: "2023-08", images: 1.5, data: 0.5, backups: 0.2 },
  { date: "2023-09", images: 1.8, data: 0.6, backups: 0.2 },
  { date: "2023-10", images: 2.0, data: 0.8, backups: 0.3 },
  { date: "2023-11", images: 2.3, data: 0.9, backups: 0.3 },
  { date: "2023-12", images: 2.5, data: 1.0, backups: 0.4 },
  { date: "2024-01", images: 2.7, data: 1.1, backups: 0.4 },
  { date: "2024-02", images: 3.0, data: 1.2, backups: 0.5 },
  { date: "2024-03", images: 3.2, data: 1.3, backups: 0.5 },
  { date: "2024-04", images: 3.5, data: 1.5, backups: 0.6 },
  { date: "2024-05", images: 3.8, data: 1.7, backups: 0.7 },
];

// Mock data for cost breakdown
const costBreakdownData = [
  { name: "Google APIs", value: 350 },
  { name: "Supabase", value: 150 },
  { name: "Storage", value: 75 },
  { name: "Other", value: 25 },
];

export function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("monthly");

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
          value="28,429"
          icon={Server}
          description="This month"
          change={12}
        />
        <StatsCard
          title="Storage Used"
          value="6.2 GB"
          icon={Database}
          description="Total usage"
          change={8}
        />
        <StatsCard
          title="Search API Cost"
          value="$247.50"
          icon={Search}
          description="Monthly average"
          change={-3}
        />
        <StatsCard
          title="Total Monthly Cost"
          value="$598.75"
          icon={CircleDollarSign}
          description="Current month"
          change={5}
        />
      </div>

      <Tabs defaultValue="api-usage" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="api-usage">API Usage</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
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
              <Chart
                type="line"
                data={apiUsageData}
                dataKey="google"
                nameKey="date"
                height={350}
                title="Google API Calls"
                stroke="#8884d8"
              />
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
                <Chart
                  type="pie"
                  data={[
                    { name: "Search", value: 65 },
                    { name: "Images", value: 25 },
                    { name: "Custom Search", value: 10 },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  height={250}
                />
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
                <Chart
                  type="bar"
                  data={[
                    { operation: "Reads", count: 1850 },
                    { operation: "Writes", count: 430 },
                    { operation: "Deletes", count: 120 },
                    { operation: "Storage", count: 200 },
                  ]}
                  dataKey="count"
                  nameKey="operation"
                  height={250}
                  fill="#82ca9d"
                />
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
              <Chart
                type="area"
                data={storageUsageData}
                dataKey="images"
                nameKey="date"
                height={350}
                title="Images Storage (GB)"
                fill="rgba(136, 132, 216, 0.6)"
                stroke="#8884d8"
              />
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
                <Chart
                  type="pie"
                  data={[
                    { name: "Images", value: 3.8 },
                    { name: "Database", value: 1.7 },
                    { name: "Backups", value: 0.7 },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  height={250}
                />
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
                <Chart
                  type="bar"
                  data={[
                    { month: "Jan", growth: 0.2 },
                    { month: "Feb", growth: 0.3 },
                    { month: "Mar", growth: 0.2 },
                    { month: "Apr", growth: 0.3 },
                    { month: "May", growth: 0.3 },
                  ]}
                  dataKey="growth"
                  nameKey="month"
                  height={250}
                  fill="#82ca9d"
                />
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
              <Chart
                type="pie"
                data={costBreakdownData}
                dataKey="value"
                nameKey="name"
                height={350}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cost Trends</CardTitle>
                <CardDescription>
                  Monthly costs over the past year
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Chart
                  type="line"
                  data={[
                    { month: "Jun", cost: 510 },
                    { month: "Jul", cost: 525 },
                    { month: "Aug", cost: 540 },
                    { month: "Sep", cost: 550 },
                    { month: "Oct", cost: 565 },
                    { month: "Nov", cost: 580 },
                    { month: "Dec", cost: 590 },
                    { month: "Jan", cost: 575 },
                    { month: "Feb", cost: 585 },
                    { month: "Mar", cost: 595 },
                    { month: "Apr", cost: 590 },
                    { month: "May", cost: 600 },
                  ]}
                  dataKey="cost"
                  nameKey="month"
                  height={250}
                  stroke="#ff7300"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cost per User</CardTitle>
                <CardDescription>
                  Average monthly cost per active user
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Chart
                  type="bar"
                  data={[
                    { month: "Jan", cost: 1.25 },
                    { month: "Feb", cost: 1.22 },
                    { month: "Mar", cost: 1.15 },
                    { month: "Apr", cost: 1.10 },
                    { month: "May", cost: 1.05 },
                  ]}
                  dataKey="cost"
                  nameKey="month"
                  height={250}
                  fill="#8884d8"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
