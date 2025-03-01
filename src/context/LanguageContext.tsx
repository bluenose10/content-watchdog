<lov-code>
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
    
    // Auth related messages
    'auth.logoutSuccess': 'You have been logged out successfully',
    'auth.logoutError': 'There was a problem signing out',
    
    // Definition sections
    'piracy.definition': 'Definition:',
    'piracy.scope': 'Scope:',
    'piracy.examples': 'Examples:',
    
    // Copyright section
    'piracy.copyright.title': 'Copyright Infringement',
    'piracy.copyright.definition': 'The unauthorized use of someone else\'s copyright-protected work (e.g., text, images, videos, music) in a way that violates the owner\'s exclusive rights.',
    'piracy.copyright.scope': 'Copyright infringement applies to original works fixed in a tangible medium, such as written, recorded, or digitally saved content. These works are protected under copyright law, including the Digital Millennium Copyright Act (DMCA) in the United States.',
    'piracy.copyright.examples': 'Common examples include copying and republishing an article without permission, using a photograph in a commercial project without a license, and sharing digital products without proper authorization from the creator.',
    
    // Plagiarism section
    'piracy.plagiarism.title': 'Plagiarism',
    'piracy.plagiarism.definition': 'Presenting someone else\'s work or ideas as your own without proper attribution.',
    'piracy.plagiarism.scope': 'Plagiarism is primarily about ethics and academic integrity rather than legal rights. It can occur even if the work is not copyright-protected, such as when copying public domain content without giving proper credit.',
    'piracy.plagiarism.examples': 'Submitting someone else\'s essay as your own, using quotes without citing the source, or repurposing ideas without acknowledging the original creator are all examples of plagiarism that can have serious consequences in academic and professional settings.',
    
    // Content theft section
    'piracy.contentTheft.title': 'Content Theft',
    'piracy.contentTheft.definition': 'The unauthorized copying or use of digital content (e.g., blog posts, images, videos).',
    'piracy.contentTheft.scope': 'Content theft often overlaps with copyright infringement but can also include non-copyrighted content. The focus is on the act of stealing rather than the specific legal implications involved.',
    'piracy.contentTheft.examples': 'Common examples include scraping websites and republishing their content, downloading and redistributing paid digital products, or taking screenshots of membership content and sharing them without permission.',
    
    // Key differences section
    'piracy.differences.title': 'Key Differences',
    'piracy.differences.aspect': 'Aspect',
    'piracy.differences.plagiarism': 'Plagiarism',
    'piracy.differences.contentTheft': 'Content Theft',
    'piracy.differences.copyright': 'Copyright Infringement',
    'piracy.differences.focus': 'Focus',
    'piracy.differences.focus.plagiarism': 'Ethical (attribution)',
    'piracy.differences.focus.contentTheft': 'Act of stealing',
    'piracy.differences.focus.copyright': 'Legal (rights violation)',
    'piracy.differences.applies': 'Applies To',
    'piracy.differences.applies.plagiarism': 'Any work (even non-copyrighted)',
    'piracy.differences.applies.contentTheft': 'Digital content',
    'piracy.differences.applies.copyright': 'Copyright-protected works',
    'piracy.differences.consequences': 'Consequences',
    'piracy.differences.consequences.plagiarism': 'Academic or professional',
    'piracy.differences.consequences.contentTheft': 'Loss of revenue, reputation',
    'piracy.differences.consequences.copyright': 'Legal action, fines, DMCA takedowns',
    
    // Overlaps section
    'piracy.overlaps.title': 'How They Overlap',
    'piracy.overlaps.plagiarism.title': 'Plagiarism Can Lead to Copyright Infringement',
    'piracy.overlaps.plagiarism.description': 'If the plagiarized work is copyright-protected, it may also be a legal violation.',
    'piracy.overlaps.contentTheft.title': 'Content Theft Often Involves Copyright Infringement',
    'piracy.overlaps.contentTheft.description': 'Most stolen content is protected by copyright, making it both theft and infringement.',
    'piracy.overlaps.notAll.title': 'Not All Plagiarism is Copyright Infringement',
    'piracy.overlaps.notAll.description': 'If the work is in the public domain or not copyright-protected, it\'s plagiarism but not infringement.',
    
    // Business impact section
    'piracy.business.title': 'Why This Matters For Your Business',
    'piracy.business.copyright': 'Our services directly address this legal issue through DMCA takedowns and copyright enforcement tools.',
    'piracy.business.plagiarism': 'We offer tools for detecting copied content and ensuring proper attribution for your work.',
    'piracy.business.contentTheft': 'Our platform helps monitor, detect, and stop unauthorized use of your digital content.',
    'piracy.business.protection': 'How Influence Guard Protects Your Work',
    'piracy.business.monitoring': 'Advanced content monitoring to detect unauthorized use',
    'piracy.business.dmca': 'Automated DMCA takedown tools for swift action',
    'piracy.business.detection': 'Plagiarism detection across websites and social media',
    'piracy.business.fingerprinting': 'Digital fingerprinting to track your intellectual property',
    'piracy.business.startProtecting': 'Start Protecting Your Content',
    
    // Key concepts sidebar
    'piracy.keyConcepts.title': 'Key Concepts',
    'piracy.keyConcepts.copyright': 'Legal violation of exclusive rights',
    'piracy.keyConcepts.plagiarism': 'Using work without attribution',
    'piracy.keyConcepts.contentTheft': 'Unauthorized use of digital content',
    'piracy.keyConcepts.dmca.title': 'DMCA Protection',
    'piracy.keyConcepts.dmca.description': 'Legal framework for digital rights',
    'piracy.keyConcepts.protect.title': 'Protect Your Work Now',
    'piracy.keyConcepts.protect.description': 'Don\'t wait until your content is stolen. Start monitoring and protecting your intellectual property today.',
    'piracy.keyConcepts.getStarted': 'Get Started',
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
    
    // Auth related messages
    'auth.logoutSuccess': 'Has cerrado sesión correctamente',
    'auth.logoutError': 'Hubo un problema al cerrar sesión',
    
    // Definition sections
    'piracy.definition': 'Definición:',
    'piracy.scope': 'Alcance:',
    'piracy.examples': 'Ejemplos:',
    
    // Copyright section
    'piracy.copyright.title': 'Infracción de Derechos de Autor',
    'piracy.copyright.definition': 'El uso no autorizado del trabajo protegido por derechos de autor de otra persona (por ejemplo, texto, imágenes, videos, música) de una manera que viola los derechos exclusivos del propietario.',
    'piracy.copyright.scope': 'La infracción de derechos de autor se aplica a obras originales fijadas en un medio tangible, como contenido escrito, grabado o guardado digitalmente. Estas obras están protegidas por la ley de derechos de autor, incluyendo la Ley de Derechos de Autor del Milenio Digital (DMCA) en los Estados Unidos.',
    'piracy.copyright.examples': 'Los ejemplos comunes incluyen copiar y volver a publicar un artículo sin permiso, usar una fotografía en un proyecto comercial sin una licencia y compartir productos digitales sin la autorización adecuada del creador.',
    
    // Plagiarism section
    'piracy.plagiarism.title': 'Plagio',
    'piracy.plagiarism.definition': 'Presentar el trabajo o las ideas de otra persona como propias sin la atribución adecuada.',
    'piracy.plagiarism.scope': 'El plagio se trata principalmente de ética e integridad académica más que de derechos legales. Puede ocurrir incluso si el trabajo no está protegido por derechos de autor, como cuando se copia contenido de dominio público sin dar el crédito adecuado.',
    'piracy.plagiarism.examples': 'Presentar el ensayo de otra persona como propio, usar citas sin citar la fuente o reutilizar ideas sin reconocer al creador original son ejemplos de plagio que pueden tener graves consecuencias en entornos académicos y profesionales.',
    
    // Content theft section
    'piracy.contentTheft.title': 'Robo de Contenido',
    'piracy.contentTheft.definition': 'La copia o el uso no autorizados de contenido digital (por ejemplo, publicaciones de blog, imágenes, videos).',
    'piracy.contentTheft.scope': 'El robo de contenido a menudo se superpone con la infracción de derechos de autor, pero también puede incluir contenido no protegido por derechos de autor. La atención se centra en el acto de robar en lugar de las implicaciones legales específicas involucradas.',
    'piracy.contentTheft.examples': 'Los ejemplos comunes incluyen el scraping de sitios web y la republicación de su contenido, la descarga y redistribución de productos digitales pagados o la toma de capturas de pantalla de contenido de membresía y el compartirlas sin permiso.',
    
    // Key differences section
    'piracy.differences.title': 'Diferencias Clave',
    'piracy.differences.aspect': 'Aspecto',
    'piracy.differences.plagiarism': 'Plagio',
    'piracy.differences.contentTheft': 'Robo de Contenido',
    'piracy.differences.copyright': 'Infracción de Derechos de Autor',
    'piracy.differences.focus': 'Enfoque',
    'piracy.differences.focus.plagiarism': 'Ético (atribución)',
    'piracy.differences.focus.contentTheft': 'Acto de robar',
    'piracy.differences.focus.copyright': 'Legal (violación de derechos)',
    'piracy.differences.applies': 'Se Aplica A',
    'piracy.differences.applies.plagiarism': 'Cualquier trabajo (incluso sin derechos de autor)',
    'piracy.differences.applies.contentTheft': 'Contenido digital',
    'piracy.differences.applies.copyright': 'Obras protegidas por derechos de autor',
    'piracy.differences.consequences': 'Consecuencias',
    'piracy.differences.consequences.plagiarism': 'Académico o profesional',
    'piracy.differences.consequences.contentTheft': 'Pérdida de ingresos, reputación',
    'piracy.differences.consequences.copyright': 'Acciones legales, multas, eliminaciones de DMCA',
    
    // Overlaps section
    'piracy.overlaps.title': 'Cómo Se Superponen',
    'piracy.overlaps.plagiarism.title': 'El Plagio Puede Conducir a la Infracción de Derechos de Autor',
    'piracy.overlaps.plagiarism.description': 'Si el trabajo plagiado está protegido por derechos de autor, también puede ser una violación legal.',
    'piracy.overlaps.contentTheft.title': 'El Robo de Contenido a Menudo Implica la Infracción de Derechos de Autor',
    'piracy.overlaps.contentTheft.description': 'La mayoría del contenido robado está protegido por derechos de autor, lo que lo convierte tanto en robo como en infracción.',
    'piracy.overlaps.notAll.title': 'No Todo el Plagio es Infracción de Derechos de Autor',
    'piracy.overlaps.notAll.description': 'Si el trabajo es de dominio público o no está protegido por derechos de autor, es plagio pero no infracción.',
    
    // Business impact section
    'piracy.business.title': 'Por Qué Esto Importa Para Su Negocio',
    'piracy.business.copyright': 'Nuestros servicios abordan directamente este problema legal a través de eliminaciones de DMCA y herramientas de cumplimiento de derechos de autor.',
    'piracy.business.plagiarism': 'Ofrecemos herramientas para detectar contenido copiado y garantizar la atribución adecuada para su trabajo.',
    'piracy.business.contentTheft': 'Nuestra plataforma ayuda a monitorear, detectar y detener el uso no autorizado de su contenido digital.',
    'piracy.business.protection': 'Cómo Influence Guard Protege Su Trabajo',
    'piracy.business.monitoring': 'Monitoreo avanzado de contenido para detectar el uso no autorizado',
    'piracy.business.dmca': 'Herramientas automatizadas de eliminación de DMCA para una acción rápida',
    'piracy.business.detection': 'Detección de plagio en sitios web y redes sociales',
    'piracy.business.fingerprinting': 'Huella digital para rastrear su propiedad intelectual',
    'piracy.business.startProtecting': 'Comience a Proteger Su Contenido',
    
    // Key concepts sidebar
    'piracy.keyConcepts.title': 'Conceptos Clave',
    'piracy.keyConcepts.copyright': 'Violación legal de derechos exclusivos',
    'piracy.keyConcepts.plagiarism': 'Usar el trabajo sin atribución',
    'piracy.keyConcepts.contentTheft': 'Uso no autorizado de contenido digital',
    'piracy.keyConcepts.dmca.title': 'Protección DMCA',
    'piracy.keyConcepts.dmca.description': 'Marco legal para los derechos digitales',
    'piracy.keyConcepts.protect.title': 'Proteja Su Trabajo Ahora',
    'piracy.keyConcepts.protect.description': 'No espere hasta que le roben su contenido. Comience a monitorear y proteger su propiedad intelectual hoy mismo.',
    'piracy.keyConcepts.getStarted': 'Comenzar',
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
    
    // Auth related messages
    'auth.logoutSuccess': 'Vous avez été déconnecté avec succès',
    'auth.logoutError': 'Un problème est survenu lors de la déconnexion',
    
    // Definition sections
    'piracy.definition': 'Définition:',
    'piracy.scope': 'Portée:',
    'piracy.examples': 'Exemples:',
    
    // Copyright section
    'piracy.copyright.title': 'Violation des Droits d\'Auteur',
    'piracy.copyright.definition': 'L\'utilisation non autorisée de l\'œuvre protégée par le droit d\'auteur d\'une autre personne (par exemple, texte, images, vidéos, musique) d\'une manière qui viole les droits exclusifs du propriétaire.',
    'piracy.copyright.scope': 'La violation du droit d\'auteur s\'applique aux œuvres originales fixées sur un support tangible, comme le contenu écrit, enregistré ou sauvegardé numériquement. Ces œuvres sont protégées par la loi sur le droit d\'auteur, y compris la loi sur le droit d\'auteur du millénaire numérique (DMCA) aux États-Unis.',
    'piracy.copyright.examples': 'Les exemples courants incluent la copie et la republication d\'un article sans autorisation, l\'utilisation d\'une photographie dans un projet commercial sans licence et le partage de produits numériques sans l\'autorisation appropriée du créateur.',
    
    // Plagiarism section
    'piracy.plagiarism.title': 'Plagiat',
    'piracy.plagiarism.definition': 'Présenter le travail ou les idées de quelqu\'un d\'autre comme les vôtres sans attribution appropriée.',
    'piracy.plagiarism.scope': 'Le plagiat concerne principalement l\'éthique et l\'intégrité académique plutôt que les droits légaux. Il peut se produire même si l\'œuvre n\'est pas protégée par le droit d\'auteur, par exemple lors de la copie de contenu du domaine public sans donner le crédit approprié.',
    'piracy.plagiarism.examples': 'Soumettre le devoir de quelqu\'un d\'autre comme le vôtre, utiliser des citations sans citer la source ou réutiliser des idées sans reconnaître le créateur original sont tous des exemples de plagiat qui peuvent avoir de graves conséquences dans les milieux universitaires et professionnels.',
    
    // Content theft section
    'piracy.contentTheft.title': 'Vol de Contenu',
    'piracy.contentTheft.definition': 'La copie ou l\'utilisation non autorisée de contenu numérique (par exemple, articles de blog, images, vidéos).',
    'piracy.contentTheft.scope': 'Le vol de contenu chevauche souvent la violation du droit d\'auteur, mais peut également inclure du contenu non protégé par le droit d\'auteur. L\'attention est portée sur l\'acte de voler plutôt que sur les implications juridiques spécifiques impliquées.',
    'piracy.contentTheft.examples': 'Les exemples courants incluent le scraping de sites Web et la republication de leur contenu, le téléchargement et la redistribution de produits numériques payants ou la prise de captures d\'écran de contenu d\'adhésion et leur partage sans autorisation.',
    
    // Key differences section
    'piracy.differences.title': 'Différences Clés',
    'piracy.differences.aspect': 'Aspect',
    'piracy.differences.plagiarism': 'Plagiat',
    'piracy.differences.contentTheft': 'Vol de Contenu',
    'piracy.differences.copyright': 'Violation des Droits d\'Auteur',
    'piracy.differences.focus': 'Concentration',
    'piracy.differences.focus.plagiarism': 'Éthique (attribution)',
    'piracy.differences.focus.contentTheft': 'Acte de voler',
    'piracy.differences.focus.copyright': 'Juridique (violation des droits)',
    'piracy.differences.applies': 'S\'applique À',
    'piracy.differences.applies.plagiarism': 'Tout travail (même non protégé par le droit d\'auteur)',
    'piracy.differences.applies.contentTheft': 'Contenu numérique',
    'piracy.differences.applies.copyright': 'Œuvres protégées par le droit d\'auteur',
    'piracy.differences.consequences': 'Conséquences',
    'piracy.differences.consequences.plagiarism': 'Académique ou professionnel',
    'piracy.differences.consequences.contentTheft': 'Perte de revenus, réputation',
    'piracy.differences.consequences.copyright': 'Actions en justice, amendes, suppressions DMCA',
    
    // Overlaps section
    'piracy.overlaps.title': 'Comment Ils Se Chevauchent',
    'piracy.overlaps.plagiarism.title': 'Le Plagiat Peut Entraîner une Violation des Droits d\'Auteur',
    'piracy.overlaps.plagiarism.description': 'Si l\'œuvre plagiée est protégée par le droit d\'auteur, elle peut également constituer une violation légale.',
    'piracy.overlaps.contentTheft.title': 'Le Vol de Contenu Implique Souvent une Violation des Droits d\'Auteur',
    'piracy.overlaps.contentTheft.description': 'La plupart des contenus volés sont protégés par le droit d\'auteur, ce qui en fait à la fois un vol et une violation.',
    'piracy.overlaps.notAll.title': 'Tout Plagiat N\'est Pas une Violation des Droits d\'Auteur',
    'piracy.overlaps.notAll.description': 'Si l\'œuvre est dans le domaine public ou n\'est pas protégée par le droit d\'auteur, il s\'agit de plagiat mais pas de violation.',
    
    // Business impact section
    'piracy.business.title': 'Pourquoi C\'est Important Pour Votre Entreprise',
    'piracy.business.copyright': 'Nos services traitent directement de ce problème juridique grâce aux suppressions DMCA et aux outils d\'application des droits d\'auteur.',
    'piracy.business.plagiarism': 'Nous offrons des outils pour détecter le contenu copié et garantir une attribution appropriée à votre travail.',
    'piracy.business.contentTheft': 'Notre plateforme aide à surveiller, détecter et arrêter l\'utilisation non autorisée de votre contenu numérique.',
    'piracy.business.protection': 'Comment Influence Guard Protège Votre Travail',
    'piracy.business.monitoring': 'Surveillance avancée du contenu pour détecter toute utilisation non autorisée',
    'piracy.business.dmca': 'Outils automatisés de suppression DMCA pour une action rapide',
    'piracy.business.detection': 'Détection du plagiat sur les sites Web et les médias sociaux',
    'piracy.business.fingerprinting': 'Empreinte digitale pour suivre votre propriété intellectuelle',
    'piracy.business.startProtecting': 'Commencez à Protéger Votre Contenu',
    
    // Key concepts sidebar
    'piracy.keyConcepts.title': 'Concepts Clés',
    'piracy.keyConcepts.copyright': 'Violation légale des droits exclusifs',
    'piracy.keyConcepts.plagiarism': 'Utilisation du travail sans attribution',
    'piracy.keyConcepts.contentTheft': 'Utilisation non autorisée de contenu numérique',
    'piracy.keyConcepts.dmca.title': 'Protection DMCA',
    'piracy.keyConcepts.dmca.description': 'Cadre juridique pour les droits numériques',
    'piracy.keyConcepts.protect.title': 'Protégez Votre Travail Maintenant',
    'piracy.keyConcepts.protect.description': 'N\'attendez pas que votre contenu soit volé. Commencez à surveiller et à protéger votre propriété intellectuelle dès aujourd\'hui.',
    'piracy.keyConcepts.getStarted': 'Commencer',
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
    
    // Auth related messages
    'auth.logoutSuccess': 'Sie wurden erfolgreich abgemeldet',
    'auth.logoutError': 'Beim Abmelden ist ein Problem aufgetreten',
    
    // Definition sections
    'piracy.definition': 'Definition:',
    'piracy.scope': 'Umfang:',
    'piracy.examples': 'Beispiele:',
    
    // Copyright section
    'piracy.copyright.title': 'Urheberrechtsverletzung',
    'piracy.copyright.definition': 'Die unbefugte Nutzung des urheberrechtlich geschützten Werks einer anderen Person (z.B. Text, Bilder, Videos, Musik) in einer Weise, die die ausschließlichen Rechte des Eigentümers verletzt.',
    'piracy.copyright.scope': 'Urheberrechtsverletzungen beziehen sich auf originale Werke, die in einem greifbaren Medium fixiert sind, wie geschriebene, aufgezeichnete oder digital gespeicherte Inhalte. Diese Werke sind durch das Urheberrecht geschützt, einschließlich des Digital Millennium Copyright Act (DMCA) in den Vereinigten Staaten.',
    'piracy.copyright.examples': 'Häufige Beispiele sind das Kopieren und erneute Veröffentlichen eines Artikels ohne Erlaubnis, die Verwendung einer Fotografie in einem kommerziellen Projekt ohne Lizenz und das Teilen digitaler Produkte ohne ordnungsgemäße Genehmigung des Erstellers.',
    
    // Plagiarism section
    'piracy.
