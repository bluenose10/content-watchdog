
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ArrowRight, BarChart, FileClock, Home, Image, Search, Shield, Upload, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

const Dashboard = () => {
  const { user } = useAuth();
  useProtectedRoute();
  
  const firstName = user?.user_metadata?.name 
    ? user.user_metadata.name.split(' ')[0] 
    : user?.email 
      ? user.email.split('@')[0] 
      : '';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-gradient font-medium">
                Welcome back, {firstName}! Monitor and protect your content.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button asChild>
                <Link to="/search">
                  <Search className="mr-2 h-4 w-4" />
                  New Search
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="glass-card transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">12</div>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  3 searches remaining this month
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Content Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">86</div>
                  <Image className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  +12 from last month
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Protected Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">32</div>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  18 DMCA notices sent
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">Free</div>
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <Link to="/#pricing" className="text-primary hover:underline">
                    Upgrade to Pro
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="glass-card md:col-span-2 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Recent Searches</CardTitle>
                <CardDescription>
                  Your most recent content searches and results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-secondary p-2">
                      <Search className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Username Search: @johndoe</p>
                      <p className="text-xs text-muted-foreground">May 15, 2023 • 15 matches found</p>
                    </div>
                    <div className="ml-auto">
                      <Button size="sm" variant="ghost" asChild>
                        <Link to="/results">View Results</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-secondary p-2">
                      <Upload className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Image Upload: summer_vacation.jpg</p>
                      <p className="text-xs text-muted-foreground">May 10, 2023 • 8 matches found</p>
                    </div>
                    <div className="ml-auto">
                      <Button size="sm" variant="ghost" asChild>
                        <Link to="/results">View Results</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-secondary p-2">
                      <Search className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Hashtag Search: #contentcreator</p>
                      <p className="text-xs text-muted-foreground">May 5, 2023 • 24 matches found</p>
                    </div>
                    <div className="ml-auto">
                      <Button size="sm" variant="ghost" asChild>
                        <Link to="/results">View Results</Link>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <Button variant="outline" asChild>
                    <Link to="/history">
                      View All Searches
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/search">
                      <Search className="mr-2 h-4 w-4" />
                      New Content Search
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/monitoring">
                      <FileClock className="mr-2 h-4 w-4" />
                      Set Up Monitoring
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/analytics">
                      <BarChart className="mr-2 h-4 w-4" />
                      View Analytics
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/">
                      <Home className="mr-2 h-4 w-4" />
                      Back to Home
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/account">
                      <User className="mr-2 h-4 w-4" />
                      Account Settings
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Get unlimited searches and advanced features
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2">
                    <p className="text-gradient font-semibold text-lg mb-2">Protect Your Content From Unauthorized Use</p>
                    <ul className="space-y-1">
                      <li className="flex items-center text-sm">
                        <Shield className="mr-2 h-4 w-4 text-green-500" />
                        Unlimited search results
                      </li>
                      <li className="flex items-center text-sm">
                        <Shield className="mr-2 h-4 w-4 text-green-500" />
                        Advanced content monitoring
                      </li>
                      <li className="flex items-center text-sm">
                        <Shield className="mr-2 h-4 w-4 text-green-500" />
                        10 automated monitoring sessions
                      </li>
                      <li className="flex items-center text-sm">
                        <Shield className="mr-2 h-4 w-4 text-green-500" />
                        Export results in multiple formats
                      </li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold mb-2">$19.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                    <Button asChild className="button-animation">
                      <Link to="/#pricing">
                        Upgrade Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
