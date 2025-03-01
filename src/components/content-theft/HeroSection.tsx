
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Copyright } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <div className="py-12 md:py-16 text-center">
      <div className="inline-flex items-center justify-center p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-4">
        <Copyright className="h-5 w-5 text-purple-600 dark:text-purple-400" />
      </div>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-4 text-gradient">
        {t('piracy.title')}
      </h1>
      <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto mb-8">
        {t('piracy.subtitle')}
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link to="/search">{t('piracy.protectButton')}</Link>
        </Button>
        <Button asChild variant="outline">
          <a href="#differences">{t('piracy.learnMore')}</a>
        </Button>
      </div>
    </div>
  );
};
