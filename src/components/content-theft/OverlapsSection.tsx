
import { useLanguage } from "@/context/LanguageContext";

export const OverlapsSection = () => {
  const { t } = useLanguage();
  
  return (
    <section id="overlaps">
      <h2 className="text-2xl font-bold mb-4">{t('piracy.overlaps.title') || "How They Overlap"}</h2>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-medium mb-2">{t('piracy.overlaps.plagiarism.title') || "Plagiarism Can Lead to Copyright Infringement"}</h3>
          <p className="text-muted-foreground">{t('piracy.overlaps.plagiarism.description') || "If the plagiarized work is copyright-protected, it may also be a legal violation."}</p>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-medium mb-2">{t('piracy.overlaps.contentTheft.title') || "Content Theft Often Involves Copyright Infringement"}</h3>
          <p className="text-muted-foreground">{t('piracy.overlaps.contentTheft.description') || "Most stolen content is protected by copyright, making it both theft and infringement."}</p>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-medium mb-2">{t('piracy.overlaps.notAll.title') || "Not All Plagiarism is Copyright Infringement"}</h3>
          <p className="text-muted-foreground">{t('piracy.overlaps.notAll.description') || "If the work is in the public domain or not copyright-protected, it's plagiarism but not infringement."}</p>
        </div>
      </div>
    </section>
  );
};
