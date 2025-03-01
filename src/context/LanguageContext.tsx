
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available languages
export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh';

// Define the context shape
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translations object - in a real app, you would have more extensive translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    'header.home': 'Home',
    'header.features': 'Features',
    'header.pricing': 'Pricing',
    'header.piracy': 'Piracy',
    'header.about': 'About',
    'header.login': 'Log in',
    'header.signup': 'Sign up',
    'header.dashboard': 'Dashboard',
    'header.logout': 'Log out',
    'hero.title': 'Stop Content Theft in Its Tracks - Protect Your Intellectual Property.',
    'hero.subtitle': 'For Content Creators Needing Digital Rights Management and DMCA Protection. We locate where your photos, videos, articles, and designs are being used without permission, providing detailed evidence for copyright infringement cases.',
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.de': 'Deutsch',
    'language.zh': '中文',
    // Add more translations as needed
  },
  es: {
    'header.home': 'Inicio',
    'header.features': 'Características',
    'header.pricing': 'Precios',
    'header.piracy': 'Piratería',
    'header.about': 'Acerca de',
    'header.login': 'Iniciar sesión',
    'header.signup': 'Registrarse',
    'header.dashboard': 'Panel',
    'header.logout': 'Cerrar sesión',
    'hero.title': 'Detenga el robo de contenido - Proteja su propiedad intelectual.',
    'hero.subtitle': 'Para creadores de contenido que necesitan gestión de derechos digitales y protección DMCA. Localizamos dónde se están utilizando sus fotos, videos, artículos y diseños sin permiso, proporcionando evidencia detallada para casos de infracción de derechos de autor.',
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.de': 'Deutsch',
    'language.zh': '中文',
    // Add more translations as needed
  },
  fr: {
    'header.home': 'Accueil',
    'header.features': 'Fonctionnalités',
    'header.pricing': 'Tarifs',
    'header.piracy': 'Piratage',
    'header.about': 'À propos',
    'header.login': 'Connexion',
    'header.signup': "S'inscrire",
    'header.dashboard': 'Tableau de bord',
    'header.logout': 'Déconnexion',
    'hero.title': 'Arrêtez le vol de contenu - Protégez votre propriété intellectuelle.',
    'hero.subtitle': 'Pour les créateurs de contenu ayant besoin de gestion des droits numériques et de protection DMCA. Nous localisons où vos photos, vidéos, articles et designs sont utilisés sans permission, fournissant des preuves détaillées pour les cas de violation de droits d\'auteur.',
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.de': 'Deutsch',
    'language.zh': '中文',
    // Add more translations as needed
  },
  de: {
    'header.home': 'Startseite',
    'header.features': 'Funktionen',
    'header.pricing': 'Preise',
    'header.piracy': 'Piraterie',
    'header.about': 'Über uns',
    'header.login': 'Anmelden',
    'header.signup': 'Registrieren',
    'header.dashboard': 'Dashboard',
    'header.logout': 'Abmelden',
    'hero.title': 'Stoppen Sie Inhaltsdiebstahl - Schützen Sie Ihr geistiges Eigentum.',
    'hero.subtitle': 'Für Content-Ersteller, die Digital Rights Management und DMCA-Schutz benötigen. Wir finden heraus, wo Ihre Fotos, Videos, Artikel und Designs ohne Erlaubnis verwendet werden, und liefern detaillierte Beweise für Fälle von Urheberrechtsverletzungen.',
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.de': 'Deutsch',
    'language.zh': '中文',
    // Add more translations as needed
  },
  zh: {
    'header.home': '首页',
    'header.features': '功能',
    'header.pricing': '价格',
    'header.piracy': '盗版',
    'header.about': '关于我们',
    'header.login': '登录',
    'header.signup': '注册',
    'header.dashboard': '控制面板',
    'header.logout': '登出',
    'hero.title': '阻止内容盗窃 - 保护您的知识产权',
    'hero.subtitle': '为需要数字版权管理和DMCA保护的内容创作者服务。我们定位您的照片、视频、文章和设计在哪里未经许可使用，为版权侵权案件提供详细证据。',
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.de': 'Deutsch',
    'language.zh': '中文',
    // Add more translations as needed
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get browser language or default to English
  const getBrowserLanguage = (): Language => {
    const browserLang = navigator.language.split('-')[0];
    return (browserLang as Language) in translations ? (browserLang as Language) : 'en';
  };

  const [language, setLanguage] = useState<Language>(() => {
    // Check localStorage first, then browser language
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage && translations[savedLanguage] ? savedLanguage : getBrowserLanguage();
  });

  useEffect(() => {
    // Save to localStorage when language changes
    localStorage.setItem('language', language);
    // Update html lang attribute
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
