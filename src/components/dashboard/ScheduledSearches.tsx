
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { getUserSearchQueries, deleteSearchQuery } from "@/lib/db-service";
import { SearchQuery } from "@/lib/db-types";
import { ScheduleSearchDialog } from "./ScheduleSearchDialog";
import { PremiumFeature, useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function ScheduledSearches() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [scheduledSearches, setScheduledSearches] = useState<SearchQuery[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { hasPremiumFeature, premiumFeaturesLoading } = useProtectedRoute(true, false);
  
  // Load scheduled searches
  useEffect(() => {
    const loadScheduledSearches = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const queries = await getUserSearchQueries(user.id);
        const scheduledQueries = queries.filter(q => q.scheduled);
        setScheduledSearches(scheduledQueries);
      } catch (error) {
        console.error("Error loading scheduled searches:", error);
        toast({
          title: "Failed to load scheduled searches",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadScheduledSearches();
  }, [user, toast]);

  // Handle deleting a scheduled search
  const handleDeleteSchedule = async (searchId: string) => {
    try {
      await deleteSearchQuery(searchId);
      setScheduledSearches(prev => prev.filter(search => search.id !== searchId));
      toast({
        title: "Schedule deleted",
        description: "Your scheduled search has been removed",
      });
    } catch (error) {
      console.error("Error deleting scheduled search:", error);
      toast({
        title: "Failed to delete schedule",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  // Format the schedule interval for display
  const formatScheduleInterval = (interval: string) => {
    switch (interval) {
      case 'hourly': return 'Every hour';
      case 'daily': return 'Every day';
      case 'weekly': return 'Every week';
      case 'monthly': return 'Every month';
      default: return interval;
    }
  };

  // Format the last run date for display
  const formatLastRun = (lastRun: string | undefined) => {
    if (!lastRun) return 'Never';
    
    const date = new Date(lastRun);
    return date.toLocaleString();
  };

  // Check if the user has the scheduled searches feature
  const canScheduleSearches = hasPremiumFeature(PremiumFeature.SCHEDULED_SEARCHES);

  // Loading state
  if (isLoading || premiumFeaturesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Scheduled Searches</CardTitle>
          <CardDescription>Automate your content monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // If the user doesn't have the scheduled searches feature
  if (!canScheduleSearches) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Scheduled Searches</CardTitle>
          <CardDescription>Automate your content monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
            <p className="text-muted-foreground mb-4">
              Scheduled searches are available exclusively for premium users.
              Upgrade your account to automate your content monitoring.
            </p>
            <Button className="button-animation" onClick={() => window.location.href = "/#pricing"}>
              View Pricing Plans
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-xl">Scheduled Searches</CardTitle>
          <CardDescription>Automate your content monitoring</CardDescription>
        </div>
        <Button 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Schedule
        </Button>
      </CardHeader>
      <CardContent>
        {scheduledSearches.length === 0 ? (
          <div className="text-center p-6">
            <p className="text-muted-foreground mb-4">
              You don't have any scheduled searches yet.
            </p>
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Create your first scheduled search
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {scheduledSearches.map((search) => (
              <div 
                key={search.id} 
                className="flex items-center justify-between p-4 border rounded-md hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium truncate">
                      {search.query_text || 'Image search'}
                    </h4>
                    <Badge variant="outline" className="capitalize">
                      {search.query_type}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1 gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatScheduleInterval(search.schedule_interval || '')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Last run: {formatLastRun(search.last_run)}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteSchedule(search.id!)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <ScheduleSearchDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onScheduleCreated={(newSearch) => {
          setScheduledSearches(prev => [...prev, newSearch]);
        }}
      />
    </Card>
  );
}
