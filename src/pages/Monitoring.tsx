
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProtectedRoute, PremiumFeature } from "@/hooks/useProtectedRoute";
import { Chart } from "@/components/ui/chart";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";

// Mock data for charts
const contentOccurrenceData = [
  { month: "Jan", count: 15 },
  { month: "Feb", count: 22 },
  { month: "Mar", count: 18 },
  { month: "Apr", count: 25 },
  { month: "May", count: 30 },
  { month: "Jun", count: 28 },
];

const platformDistributionData = [
  { name: "Social Media", value: 35 },
  { name: "Blogs", value: 25 },
  { name: "News Sites", value: 20 },
  { name: "Forums", value: 15 },
  { name: "Other", value: 5 },
];

export default function Monitoring() {
  const { isReady, hasPremiumFeature, isAdmin } = useProtectedRoute(true, true, PremiumFeature.ADVANCED_MONITORING);
  const [timeRange, setTimeRange] = useState("6months");

  if (!isReady) {
    return <LoadingState />;
  }

  // If user is an admin, show the admin dashboard at the top
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-8 max-w-7xl mx-auto">
        {isAdmin && (
          <div className="mb-12 border-b pb-8">
            <AdminDashboard />
          </div>
        )}
        
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Content Monitoring</h2>
            <p className="text-muted-foreground mb-6">
              Track where your content appears across the web and analyze trends over time.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Tabs defaultValue="overview" className="w-full">
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
                  <TabsTrigger value="alerts">Alerts</TabsTrigger>
                </TabsList>
                
                <select
                  className="p-2 border rounded-md"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="30days">Last 30 Days</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="1year">Last Year</option>
                </select>
              </div>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Occurrences</CardTitle>
                      <CardDescription>
                        Number of times your content appeared across the web
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <Chart 
                        type="line"
                        data={contentOccurrenceData}
                        dataKey="count"
                        nameKey="month"
                        title="Occurrences"
                        stroke="#8884d8"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Platform Distribution</CardTitle>
                      <CardDescription>
                        Where your content is appearing most frequently
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <Chart 
                        type="pie"
                        data={platformDistributionData}
                        dataKey="value"
                        nameKey="name"
                      />
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Content Matches</CardTitle>
                    <CardDescription>
                      The most recent instances of your content found online
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="p-4">
                        <div className="flex items-center justify-between pb-4 border-b">
                          <div className="font-medium">URL</div>
                          <div className="font-medium">Platform</div>
                          <div className="font-medium">Match</div>
                          <div className="font-medium">Date Found</div>
                          <div className="font-medium">Actions</div>
                        </div>
                        {[1, 2, 3].map((item) => (
                          <div key={item} className="flex items-center justify-between py-4 border-b last:border-0">
                            <div className="truncate max-w-[200px]">
                              <a href="#" className="text-blue-600 hover:underline">
                                https://example-site-{item}.com/your-content
                              </a>
                            </div>
                            <div>
                              {item === 1 ? "Social Media" : item === 2 ? "Blog" : "News Site"}
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs ${
                              item === 1 ? "bg-green-100 text-green-800" : 
                              item === 2 ? "bg-yellow-100 text-yellow-800" : 
                              "bg-red-100 text-red-800"
                            }`}>
                              {item === 1 ? "High (95%)" : item === 2 ? "Medium (75%)" : "Low (60%)"}
                            </div>
                            <div>
                              {item === 1 ? "Today" : item === 2 ? "Yesterday" : "3 days ago"}
                            </div>
                            <div>
                              <Button variant="outline" size="sm">View</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="detailed">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Match Timeline</CardTitle>
                      <CardDescription>
                        Detailed view of when and where your content was found
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        This detailed analysis shows a timeline of content matches across different platforms,
                        helping you identify patterns and potential unauthorized usage.
                      </p>
                      <div className="h-96 flex items-center justify-center border rounded-md mt-4 bg-gray-50 dark:bg-gray-900">
                        <p className="text-muted-foreground">Interactive timeline visualization would appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="alerts">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Alert Configuration</CardTitle>
                          <CardDescription>
                            Set up notifications for new content matches
                          </CardDescription>
                        </div>
                        <Button>Add Alert</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <div className="p-4">
                          <div className="flex items-center justify-between pb-4 border-b">
                            <div className="font-medium">Alert Name</div>
                            <div className="font-medium">Criteria</div>
                            <div className="font-medium">Notification</div>
                            <div className="font-medium">Status</div>
                            <div className="font-medium">Actions</div>
                          </div>
                          {[1, 2].map((item) => (
                            <div key={item} className="flex items-center justify-between py-4 border-b last:border-0">
                              <div>
                                {item === 1 ? "High Priority Content" : "Brand Name Mentions"}
                              </div>
                              <div>
                                {item === 1 ? "Match > 90%" : "Any mention"}
                              </div>
                              <div>
                                {item === 1 ? "Email + SMS" : "Email only"}
                              </div>
                              <div>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  item === 1 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                }`}>
                                  {item === 1 ? "Active" : "Paused"}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">Edit</Button>
                                <Button variant="destructive" size="sm">Delete</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
