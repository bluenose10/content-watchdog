
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LegalResourcesTab = () => {
  const navigate = useNavigate();

  const handleRedirectToSignup = () => {
    navigate('/signup');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <span>Legal Resources</span>
        </CardTitle>
        <CardDescription>
          Helpful resources to protect your intellectual property
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Copyright Basics</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Learn the fundamentals of copyright law and how it protects your creative work.
              </p>
              <div className="flex justify-center">
                <a href="https://en.wikipedia.org/wiki/Copyright" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    Read Guide <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Trademark Protection</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Understand how to protect your brand names, logos, and other identifying marks.
              </p>
              <div className="flex justify-center">
                <a href="https://www.uspto.gov/trademarks/basics/what-trademark" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    Read Guide <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">International Protection</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Learn about protecting your content across different countries and jurisdictions.
              </p>
              <div className="flex justify-center">
                <a href="https://en.wikipedia.org/wiki/International_copyright_treaties" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    Read Guide <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Fair Use Guidelines</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Understanding when others may legally use portions of your content.
              </p>
              <div className="flex justify-center">
                <a href="https://en.wikipedia.org/wiki/Fair_use" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    Read Guide <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <div className="bg-muted/30 p-3 border-b">
              <h3 className="font-medium">Legal Assistance</h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-4">
                Need specialized legal assistance? Our network of IP lawyers can help with complex cases and issues.
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">IP Attorney Consultation</p>
                    <p className="text-sm text-muted-foreground">30-minute consultation with a specialized attorney</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleRedirectToSignup}
                  >Book</Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Document Review</p>
                    <p className="text-sm text-muted-foreground">Have legal documents reviewed by professionals</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleRedirectToSignup}
                  >Request</Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Custom Legal Strategy</p>
                    <p className="text-sm text-muted-foreground">Develop a comprehensive strategy for your content</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleRedirectToSignup}
                  >Inquire</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
