
import { useLanguage } from "@/context/LanguageContext";

export const KeyDifferencesSection = () => {
  const { t } = useLanguage();
  
  return (
    <section id="differences" className="pt-6">
      <h2 className="text-2xl font-bold mb-6">{t('piracy.differences.title') || "Key Differences"}</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border p-3 text-left">{t('piracy.differences.aspect') || "Aspect"}</th>
              <th className="border p-3 text-left">{t('piracy.differences.plagiarism') || "Plagiarism"}</th>
              <th className="border p-3 text-left">{t('piracy.differences.contentTheft') || "Content Theft"}</th>
              <th className="border p-3 text-left">{t('piracy.differences.copyright') || "Copyright Infringement"}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-3 font-medium">{t('piracy.differences.focus') || "Focus"}</td>
              <td className="border p-3 text-muted-foreground">{t('piracy.differences.focus.plagiarism') || "Ethical (attribution)"}</td>
              <td className="border p-3 text-muted-foreground">{t('piracy.differences.focus.contentTheft') || "Act of stealing"}</td>
              <td className="border p-3 text-muted-foreground">{t('piracy.differences.focus.copyright') || "Legal (rights violation)"}</td>
            </tr>
            <tr>
              <td className="border p-3 font-medium">{t('piracy.differences.applies') || "Applies To"}</td>
              <td className="border p-3 text-muted-foreground">{t('piracy.differences.applies.plagiarism') || "Any work (even non-copyrighted)"}</td>
              <td className="border p-3 text-muted-foreground">{t('piracy.differences.applies.contentTheft') || "Digital content"}</td>
              <td className="border p-3 text-muted-foreground">{t('piracy.differences.applies.copyright') || "Copyright-protected works"}</td>
            </tr>
            <tr>
              <td className="border p-3 font-medium">{t('piracy.differences.consequences') || "Consequences"}</td>
              <td className="border p-3 text-muted-foreground">{t('piracy.differences.consequences.plagiarism') || "Academic or professional"}</td>
              <td className="border p-3 text-muted-foreground">{t('piracy.differences.consequences.contentTheft') || "Loss of revenue, reputation"}</td>
              <td className="border p-3 text-muted-foreground">{t('piracy.differences.consequences.copyright') || "Legal action, fines, DMCA takedowns"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
