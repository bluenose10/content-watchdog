
import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

export const ContentTheftSection = () => {
  const { t } = useLanguage();
  
  return (
    <section id="content-theft" className="mb-8">
      <Card className="overflow-hidden border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-md transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 pb-4">
          <CardTitle className="flex items-center text-2xl font-bold">
            <Shield className="h-7 w-7 mr-3 text-blue-500" />
            {t('piracy.contentTheft.title') || "Content Theft"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2 text-blue-700 dark:text-blue-400">{t('piracy.definition') || "Definition:"}</h3>
              <p className="mb-4 text-muted-foreground">
                {t('piracy.contentTheft.definition') || "The unauthorized copying or use of digital content (e.g., blog posts, images, videos)."}
              </p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2 text-blue-700 dark:text-blue-400">{t('piracy.scope') || "Scope:"}</h3>
              <p className="text-muted-foreground">
                {t('piracy.contentTheft.scope') || "Content theft often overlaps with copyright infringement but can also include non-copyrighted content. The focus is on the act of stealing rather than the specific legal implications involved."}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 text-blue-700 dark:text-blue-400">{t('piracy.examples') || "Examples:"}</h3>
              <p className="text-muted-foreground">
                {t('piracy.contentTheft.examples') || "Common examples include scraping websites and republishing their content, downloading and redistributing paid digital products, or taking screenshots of membership content and sharing them without permission."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
