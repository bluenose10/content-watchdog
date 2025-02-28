
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScheduledSearches } from "@/components/dashboard/ScheduledSearches";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Bell, BellOff, Clock, Search, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { getUserSearchQueries } from "@/lib/db-service";
import { useAuth } from "@/context/AuthContext";
import { SearchQuery } from "@/lib/db-types";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Monitoring() {
  const { user } = useAuth();
  const { isReady, accessLevel } = useProtectedRoute(true);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [scheduledSearches, setScheduledSearches] = useState<SearchQuery[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const queries = await getUserSearchQueries(user.id);
        const scheduled = queries.filter(q => q.scheduled);
        setScheduledSearches(scheduled);
        
        // Mock alerts data - in a real app, this would come from a database
        setAlerts([
          {
            id: 1,
            type: "match",
            title: "New content match found",
            description: "Your image was found on 3 additional websites",
            search_id: scheduled[0]?.id || "unknown",
            query_text: scheduled[0]?.query_text || "Image search",
            created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
            severity: "high"
          },
          {
            id: 2,
            type: "scheduled",
            title: "Scheduled search completed",
            description: "Daily scan completed with 5 matches",
            search_id: scheduled[0]?.id || "unknown",
            query_text: scheduled[0]?.query_text || "Brand name search",
            created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
            severity: "medium"
          },
          {
            id: 3,
            type: "takedown",
            title: "DMCA takedown successful",
            description: "Content was removed from instagram.com",
            search_id: scheduled[0]?.id || "unknown",
            query_text: scheduled[0]?.query_text || "Product image search",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
            severity: "low"
          }
        ]);
      } catch (error) {
        console.error("Error fetching monitoring data:", error);
        toast({
          title: "Error loading monitoring data",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user && isReady) {
      fetchData();
    }
  }, [user, isReady, toast]);
  
  const toggleAlerts = () => {
    setAlertsEnabled(!alertsEnabled);
    toast({
      title: alertsEnabled ? "Alerts disabled" : "Alerts enabled",
      description: alertsEnabled 
        ? "You will no longer receive notifications" 
        : "You will now receive notifications for content matches",
    });
  };

  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast({
      title: "Alert dismissed",
      description: "The notification has been removed",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffMins / 1440);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const getAlertIcon = (type: string, severity: string) => {
    switch (type) {
      case "match":
        return severity === "high" 
          ? <AlertCircle className="h-5 w-5 text-red-500" /> 
          : <Search className="h-5 w-5 text-amber-500" />;
      case "scheduled":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "takedown":
        return <Shield className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container px-4 py-12">
          <h1 className="text-3xl font-bold mb-8 pt-8 text-primary">Monitoring</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-[300px] w-full rounded-md" />
            </div>
            <div>
              <Skeleton className="h-[300px] w-full rounded-md" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-12">
        <div className="flex justify-between items-center mb-8 pt-8">
          <h1 className="text-3xl font-bold text-primary">Monitoring</h1>
          <Button 
            onClick={toggleAlerts}
            variant={alertsEnabled ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            {alertsEnabled ? (
              <>
                <Bell className="h-4 w-4" />
                <span>Alerts On</span>
              </>
            ) : (
              <>
                <BellOff className="h-4 w-4" />
                <span>Alerts Off</span>
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="active">
              <TabsList className="mb-4">
                <TabsTrigger value="active">Active Monitoring</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active">
                <Card>
                  <CardHeader>
                    <CardTitle>Monitoring Status</CardTitle>
                    <CardDescription>
                      Current status of your content monitoring
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-md bg-green-50">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">All systems operational</p>
                            <p className="text-sm text-muted-foreground">
                              Your scheduled searches are running as expected
                            </p>
                          </div>
                        </div>
                        <Badge>{scheduledSearches.length} Active</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-md">
                          <p className="text-sm text-muted-foreground">Searches Running</p>
                          <p className="text-2xl font-bold">{scheduledSearches.length}</p>
                        </div>
                        <div className="p-4 border rounded-md">
                          <p className="text-sm text-muted-foreground">Content Matches</p>
                          <p className="text-2xl font-bold">24</p>
                        </div>
                        <div className="p-4 border rounded-md">
                          <p className="text-sm text-muted-foreground">Takedown Requests</p>
                          <p className="text-2xl font-bold">3</p>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <p className="font-medium mb-2">Recent Activity</p>
                        <div className="space-y-2">
                          {scheduledSearches.length > 0 ? (
                            scheduledSearches.slice(0, 3).map((search) => (
                              <div key={search.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div>
                                  <p className="text-sm font-medium">{search.query_text || 'Image search'}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Last run: {search.last_run ? formatTime(search.last_run) : 'Not yet run'}
                                  </p>
                                </div>
                                <Badge variant="outline" className="capitalize">
                                  {search.schedule_interval}
                                </Badge>
                              </div>
                            ))
                          ) : (
                            <div className="text-center p-4">
                              <p className="text-muted-foreground">No scheduled searches yet</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Monitoring History</CardTitle>
                    <CardDescription>
                      Historical data of your content monitoring
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-8">
                      <p className="text-muted-foreground mb-2">
                        Monitoring history will be available in a future update
                      </p>
                      <Button variant="outline">View Analytics</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Alerts & Notifications</span>
                  <Badge variant={alertsEnabled ? "default" : "outline"}>
                    {alertsEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Recent notifications about your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.length > 0 ? (
                    alerts.map((alert) => (
                      <Alert key={alert.id} variant="default" className="relative">
                        <div className="flex gap-2">
                          {getAlertIcon(alert.type, alert.severity)}
                          <div>
                            <AlertTitle>{alert.title}</AlertTitle>
                            <AlertDescription className="text-sm">
                              {alert.description}
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatTime(alert.created_at)}
                              </p>
                            </AlertDescription>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute top-2 right-2 h-6 w-6 p-0"
                          onClick={() => dismissAlert(alert.id)}
                        >
                          <span className="sr-only">Dismiss</span>
                          <span aria-hidden>×</span>
                        </Button>
                      </Alert>
                    ))
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground">No alerts at this time</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <ScheduledSearches />
      </main>
      <Footer />
    </div>
  );
}
