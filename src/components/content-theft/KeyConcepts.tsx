
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Copyright, FileText, Shield, CheckCircle } from "lucide-react";

export const KeyConcepts = () => {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24">
        <h2 className="text-xl font-semibold mb-4">Key Concepts</h2>
        <div className="space-y-4">
          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-2 text-red-600 dark:text-red-400">
                  <Copyright className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Copyright Infringement</h3>
                  <p className="text-sm text-muted-foreground">Legal violation of exclusive rights</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-amber-100 dark:bg-amber-900/20 p-2 text-amber-600 dark:text-amber-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Plagiarism</h3>
                  <p className="text-sm text-muted-foreground">Using work without attribution</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-2 text-blue-600 dark:text-blue-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Content Theft</h3>
                  <p className="text-sm text-muted-foreground">Unauthorized use of digital content</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">DMCA Protection</h3>
                  <p className="text-sm text-muted-foreground">Legal framework for digital rights</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300 mb-2">Protect Your Work Now</h3>
          <p className="text-sm text-purple-600 dark:text-purple-400 mb-4">
            Don't wait until your content is stolen. Start monitoring and protecting your intellectual property today.
          </p>
          <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
