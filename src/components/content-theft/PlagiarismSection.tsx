
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

export const PlagiarismSection = () => {
  const { t } = useLanguage();
  
  return (
    <section id="plagiarism" className="mb-8">
      <Card className="overflow-hidden border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700 shadow-md transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30 pb-4">
          <CardTitle className="flex items-center text-2xl font-bold">
            <FileText className="h-7 w-7 mr-3 text-amber-500" />
            {t('piracy.plagiarism.title') || "Plagiarism"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2 text-amber-700 dark:text-amber-400">{t('piracy.definition') || "Definition:"}</h3>
              <p className="mb-4 text-muted-foreground">
                {t('piracy.plagiarism.definition') || "Presenting someone else's work or ideas as your own without proper attribution."}
              </p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2 text-amber-700 dark:text-amber-400">{t('piracy.scope') || "Scope:"}</h3>
              <p className="text-muted-foreground">
                {t('piracy.plagiarism.scope') || "Plagiarism is primarily about ethics and academic integrity rather than legal rights. It can occur even if the work is not copyright-protected, such as when copying public domain content without giving proper credit."}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 text-amber-700 dark:text-amber-400">{t('piracy.examples') || "Examples:"}</h3>
              <p className="text-muted-foreground">
                {t('piracy.plagiarism.examples') || "Submitting someone else's essay as your own, using quotes without citing the source, or repurposing ideas without acknowledging the original creator are all examples of plagiarism that can have serious consequences in academic and professional settings."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
