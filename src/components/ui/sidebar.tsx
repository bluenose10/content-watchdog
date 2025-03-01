
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  BarChart3, 
  Settings, 
  Menu, 
  Home, 
  Bell,
  Shield,
  FileCheck,
  Fingerprint
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  // Add authentication check - redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // If not authenticated, don't render the sidebar
  if (!user) {
    return null;
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: <Home className="mr-2 h-4 w-4" />,
      path: "/dashboard",
    },
    {
      title: "Search",
      icon: <Search className="mr-2 h-4 w-4" />,
      path: "/search",
    },
    {
      title: "Monitoring",
      icon: <Bell className="mr-2 h-4 w-4" />,
      path: "/monitoring",
    },
    {
      title: "Protection",
      icon: <Shield className="mr-2 h-4 w-4" />,
      path: "/protection",
    },
    {
      title: "Plagiarism Checker",
      icon: <FileCheck className="mr-2 h-4 w-4" />,
      path: "/plagiarism-checker",
    },
    {
      title: "Content Authenticity",
      icon: <Fingerprint className="mr-2 h-4 w-4" />,
      path: "/content-authenticity",
    },
    {
      title: "Analytics",
      icon: <BarChart3 className="mr-2 h-4 w-4" />,
      path: "/analytics",
    },
    {
      title: "Settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      path: "/settings",
    },
  ];

  const SidebarContent = () => (
    <div className="h-full py-12 flex flex-col">
      <div className="px-5 pt-8 pb-4">
        <h2 className="mb-6 px-4 text-lg font-semibold">Navigation</h2>
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.title}
              variant={location.pathname === item.path ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {item.title}
            </Button>
          ))}
        </div>
      </div>
      <Separator className="my-6" />
      <ScrollArea className="flex-1">
        <div className="px-5 py-4">
          <h2 className="mb-4 px-4 text-lg font-semibold">Recent Searches</h2>
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm"
              onClick={() => navigate("/results/1")}
            >
              <Search className="mr-2 h-3 w-3" />
              "Digital artwork sunset"
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm"
              onClick={() => navigate("/results/2")}
            >
              <Search className="mr-2 h-3 w-3" />
              "Mountain landscape photo"
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm"
              onClick={() => navigate("/results/3")}
            >
              <Search className="mr-2 h-3 w-3" />
              "#naturebeauty"
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className={className}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-purple-50 dark:bg-gray-900 border-r border-purple-100 dark:border-purple-900/40">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return <SidebarContent />;
}
