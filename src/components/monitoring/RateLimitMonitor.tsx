
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { HelpCircle, AlertTriangle } from "lucide-react";
import { getRateLimitStats, clearRateLimits } from "@/lib/rate-limiter";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from 'date-fns';

export function RateLimitMonitor() {
  const [stats, setStats] = useState<ReturnType<typeof getRateLimitStats> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = () => {
    try {
      setLoading(true);
      const rateLimitStats = getRateLimitStats();
      setStats(rateLimitStats);
      setError(null);
    } catch (err) {
      setError('Failed to load rate limit statistics');
      console.error('Error fetching rate limit stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearRateLimits = () => {
    try {
      clearRateLimits();
      fetchStats();
    } catch (err) {
      setError('Failed to clear rate limits');
      console.error('Error clearing rate limits:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rate Limit Monitor</CardTitle>
          <CardDescription>Loading rate limit data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rate Limit Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={fetchStats} className="mt-4">Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Rate Limit Monitor</CardTitle>
            <CardDescription>Track API request limits and usage</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={fetchStats}>
              Refresh
            </Button>
            <Button variant="destructive" size="sm" onClick={handleClearRateLimits}>
              Reset All Limits
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-secondary/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Tracked Users</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Number of users being rate limited</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.totalTrackedUsers}</p>
              </div>
              
              <div className="bg-secondary/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Blocked Requests</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Number of requests currently being blocked</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.blockedRequestsCount}</p>
              </div>
              
              <div className="bg-secondary/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Active Users</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Users who made requests in the last hour</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.activeUsers.length}</p>
              </div>
            </div>
            
            {stats.activeUsers.length > 0 ? (
              <div>
                <h3 className="text-sm font-medium mb-3">Top Active Users</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Request Count</TableHead>
                      <TableHead>Last Request</TableHead>
                      <TableHead>Usage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.activeUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id.substring(0, 8)}...</TableCell>
                        <TableCell>{user.requestCount}</TableCell>
                        <TableCell>{formatDistanceToNow(user.lastRequest, { addSuffix: true })}</TableCell>
                        <TableCell className="w-[180px]">
                          <div className="flex flex-col space-y-1">
                            <Progress 
                              value={Math.min(100, (user.requestCount / 30) * 100)} 
                              className="h-2" 
                            />
                            <span className="text-xs text-muted-foreground">
                              {user.requestCount}/30 requests
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No active users in the last hour
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
