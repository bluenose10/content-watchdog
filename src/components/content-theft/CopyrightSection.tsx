
import { Copyright } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CopyrightSection = () => {
  return (
    <section id="copyright-infringement" className="mb-8">
      <Card className="overflow-hidden border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 shadow-md transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30 pb-4">
          <CardTitle className="flex items-center text-2xl font-bold">
            <Copyright className="h-7 w-7 mr-3 text-red-500" />
            Copyright Infringement
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2 text-red-700 dark:text-red-400">Definition:</h3>
              <p className="mb-4 text-muted-foreground">
                The unauthorized use of someone else's copyright-protected work (e.g., text, images, videos, music) in a way that violates the owner's exclusive rights.
              </p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2 text-red-700 dark:text-red-400">Scope:</h3>
              <p className="text-muted-foreground">
                Copyright infringement applies to original works fixed in a tangible medium, such as written, recorded, or digitally saved content. These works are protected under copyright law, including the Digital Millennium Copyright Act (DMCA) in the United States.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 text-red-700 dark:text-red-400">Examples:</h3>
              <p className="text-muted-foreground">
                Common examples include copying and republishing an article without permission, using a photograph in a commercial project without a license, and sharing digital products without proper authorization from the creator.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
