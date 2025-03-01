
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

// Translations object with more comprehensive text coverage
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
    // Footer and other components
    'footer.copyright': 'All rights reserved',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.cookiePolicy': 'Cookie Policy',
    // Content theft page
    'piracy.title': 'Piracy & Copyright Infringement',
    'piracy.subtitle': 'Learn the differences between plagiarism, content theft, and copyright infringement to better protect your intellectual property.',
    'piracy.protectButton': 'Protect Your Content',
    'piracy.learnMore': 'Learn More',
    // Buttons and common elements
    'button.learnMore': 'Learn More',
    'button.getStarted': 'Get Started',
    'button.viewPlans': 'View Plans',
    'button.upgradeNow': 'Upgrade Now',
    // Search page
    'search.title': 'Content Search',
    'search.description': 'Use our powerful digital rights management system to find unauthorized uses of your intellectual property across the web. Our advanced copyright infringement detection helps secure your creative assets.',
    'search.signup.required': 'Sign Up Required',
    'search.signup.description': 'You need to create an account to use our content theft detection features. Sign up for a free account to get started with 3 searches per month and ensure DMCA compliance.',
    'search.signup.button': 'Sign Up Now',
    // Stats and metrics
    'stats.detectionAccuracy': 'Detection Accuracy',
    'stats.platformsMonitored': 'Platforms Monitored',
    'stats.contentProtected': 'Content Items Protected',
    'stats.successfulTakedowns': 'Successful Takedowns',
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
    // Footer and other components
    'footer.copyright': 'Todos los derechos reservados',
    'footer.privacyPolicy': 'Política de Privacidad',
    'footer.terms': 'Términos de Servicio',
    'footer.cookiePolicy': 'Política de Cookies',
    // Content theft page
    'piracy.title': 'Piratería e Infracción de Derechos de Autor',
    'piracy.subtitle': 'Aprenda las diferencias entre el plagio, el robo de contenido y la infracción de derechos de autor para proteger mejor su propiedad intelectual.',
    'piracy.protectButton': 'Proteja Su Contenido',
    'piracy.learnMore': 'Más Información',
    // Buttons and common elements
    'button.learnMore': 'Más Información',
    'button.getStarted': 'Comenzar',
    'button.viewPlans': 'Ver Planes',
    'button.upgradeNow': 'Actualizar Ahora',
    // Search page
    'search.title': 'Búsqueda de Contenido',
    'search.description': 'Utilice nuestro potente sistema de gestión de derechos digitales para encontrar usos no autorizados de su propiedad intelectual en la web. Nuestra avanzada detección de infracciones de derechos de autor ayuda a proteger sus activos creativos.',
    'search.signup.required': 'Registro Requerido',
    'search.signup.description': 'Necesita crear una cuenta para utilizar nuestras funciones de detección de robo de contenido. Regístrese para obtener una cuenta gratuita y comenzar con 3 búsquedas por mes y garantizar el cumplimiento de DMCA.',
    'search.signup.button': 'Registrarse Ahora',
    // Stats and metrics
    'stats.detectionAccuracy': 'Precisión de Detección',
    'stats.platformsMonitored': 'Plataformas Monitoreadas',
    'stats.contentProtected': 'Elementos de Contenido Protegidos',
    'stats.successfulTakedowns': 'Eliminaciones Exitosas',
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
    // Footer and other components
    'footer.copyright': 'Tous droits réservés',
    'footer.privacyPolicy': 'Politique de Confidentialité',
    'footer.terms': 'Conditions d\'Utilisation',
    'footer.cookiePolicy': 'Politique des Cookies',
    // Content theft page
    'piracy.title': 'Piratage et Violation des Droits d\'Auteur',
    'piracy.subtitle': 'Apprenez les différences entre le plagiat, le vol de contenu et la violation des droits d\'auteur pour mieux protéger votre propriété intellectuelle.',
    'piracy.protectButton': 'Protégez Votre Contenu',
    'piracy.learnMore': 'En Savoir Plus',
    // Buttons and common elements
    'button.learnMore': 'En Savoir Plus',
    'button.getStarted': 'Commencer',
    'button.viewPlans': 'Voir les Plans',
    'button.upgradeNow': 'Mettre à Niveau',
    // Search page
    'search.title': 'Recherche de Contenu',
    'search.description': 'Utilisez notre puissant système de gestion des droits numériques pour trouver les utilisations non autorisées de votre propriété intellectuelle sur le web. Notre détection avancée des violations de droits d\'auteur aide à sécuriser vos actifs créatifs.',
    'search.signup.required': 'Inscription Requise',
    'search.signup.description': 'Vous devez créer un compte pour utiliser nos fonctionnalités de détection de vol de contenu. Inscrivez-vous pour un compte gratuit et commencez avec 3 recherches par mois et assurez la conformité DMCA.',
    'search.signup.button': 'S\'inscrire Maintenant',
    // Stats and metrics
    'stats.detectionAccuracy': 'Précision de Détection',
    'stats.platformsMonitored': 'Plateformes Surveillées',
    'stats.contentProtected': 'Éléments de Contenu Protégés',
    'stats.successfulTakedowns': 'Suppressions Réussies',
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
    // Footer and other components
    'footer.copyright': 'Alle Rechte vorbehalten',
    'footer.privacyPolicy': 'Datenschutzrichtlinie',
    'footer.terms': 'Nutzungsbedingungen',
    'footer.cookiePolicy': 'Cookie-Richtlinie',
    // Content theft page
    'piracy.title': 'Piraterie & Urheberrechtsverletzung',
    'piracy.subtitle': 'Erfahren Sie die Unterschiede zwischen Plagiat, Inhaltsdiebstahl und Urheberrechtsverletzung, um Ihr geistiges Eigentum besser zu schützen.',
    'piracy.protectButton': 'Schützen Sie Ihre Inhalte',
    'piracy.learnMore': 'Mehr Erfahren',
    // Buttons and common elements
    'button.learnMore': 'Mehr Erfahren',
    'button.getStarted': 'Loslegen',
    'button.viewPlans': 'Pläne Anzeigen',
    'button.upgradeNow': 'Jetzt Upgraden',
    // Search page
    'search.title': 'Inhaltssuche',
    'search.description': 'Nutzen Sie unser leistungsstarkes Digital-Rights-Management-System, um unbefugte Nutzungen Ihres geistigen Eigentums im Web zu finden. Unsere fortschrittliche Erkennung von Urheberrechtsverletzungen hilft, Ihre kreativen Assets zu sichern.',
    'search.signup.required': 'Registrierung Erforderlich',
    'search.signup.description': 'Sie müssen ein Konto erstellen, um unsere Funktionen zur Erkennung von Inhaltsdiebstahl zu nutzen. Registrieren Sie sich für ein kostenloses Konto, um mit 3 Suchen pro Monat zu beginnen und die DMCA-Konformität zu gewährleisten.',
    'search.signup.button': 'Jetzt Registrieren',
    // Stats and metrics
    'stats.detectionAccuracy': 'Erkennungsgenauigkeit',
    'stats.platformsMonitored': 'Überwachte Plattformen',
    'stats.contentProtected': 'Geschützte Inhaltselemente',
    'stats.successfulTakedowns': 'Erfolgreiche Entfernungen',
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
    // Footer and other components
    'footer.copyright': '版权所有',
    'footer.privacyPolicy': '隐私政策',
    'footer.terms': '服务条款',
    'footer.cookiePolicy': 'Cookie政策',
    // Content theft page
    'piracy.title': '盗版和版权侵权',
    'piracy.subtitle': '了解抄袭、内容盗窃和版权侵权之间的差异，以更好地保护您的知识产权。',
    'piracy.protectButton': '保护您的内容',
    'piracy.learnMore': '了解更多',
    // Buttons and common elements
    'button.learnMore': '了解更多',
    'button.getStarted': '开始使用',
    'button.viewPlans': '查看方案',
    'button.upgradeNow': '立即升级',
    // Search page
    'search.title': '内容搜索',
    'search.description': '使用我们强大的数字版权管理系统，在网络上查找未经授权使用您的知识产权的情况。我们先进的版权侵权检测有助于保护您的创意资产。',
    'search.signup.required': '需要注册',
    'search.signup.description': '您需要创建一个账户才能使用我们的内容盗窃检测功能。注册一个免费账户，开始每月3次搜索并确保DMCA合规。',
    'search.signup.button': '立即注册',
    // Stats and metrics
    'stats.detectionAccuracy': '检测准确率',
    'stats.platformsMonitored': '监控平台数量',
    'stats.contentProtected': '受保护内容项目',
    'stats.successfulTakedowns': '成功移除数量',
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
