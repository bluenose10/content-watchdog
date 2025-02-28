
// Constants for the application
export const APP_NAME = "InfluenceGuard";
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];

// URL constants
export const TERMS_URL = "/terms";
export const PRIVACY_URL = "/privacy";
export const ABOUT_URL = "/about";

// Authentication constants
export const MIN_PASSWORD_LENGTH = 8;

// Feature constants
export const FEATURES = [
  {
    title: "Advanced Search",
    description: "Scan the web for your content using images, hashtags, and names."
  },
  {
    title: "Real-time Alerts",
    description: "Get notified instantly when your content appears online."
  },
  {
    title: "Automated Protection",
    description: "Automate takedown requests and protect your digital assets."
  },
  {
    title: "DMCA Assistance",
    description: "Simplified DMCA process with pre-filled templates and tracking."
  },
  {
    title: "Match Level System",
    description: "Advanced algorithms detect exact and modified versions of your content."
  }
];

// Search constants
export const MAX_IMAGE_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_IMAGE_FORMATS = ["image/jpeg", "image/png", "image/webp"];
export const MAX_SEARCH_HISTORY = 10;

// Search limits by plan
export const SEARCH_LIMITS = {
  ANONYMOUS: 0, // No searches for unregistered users
  BASIC: 3, // 3 searches per month for free plan
  PRO: {
    WEEKLY: 10, // 10 searches per week for professional accounts
    MONTHLY: 40, // 40 searches per calendar month for professional accounts
  }
};

// Pricing constants - use real Stripe Test mode product IDs
export const PRICING_PLANS = [
  {
    id: "basic",
    name: "Basic",
    description: "Essential monitoring for individuals",
    price: 0,
    features: [
      "3 searches per month",
      "Basic content alerts",
      "Email support",
    ],
    stripePriceId: "", // Free plan doesn't need a Stripe Price ID
    popular: false,
    cta: "Sign Up Free"
  },
  {
    id: "pro",
    name: "Professional",
    description: "Advanced protection for creators",
    price: 49,
    interval: "month",
    features: [
      "10 searches per week (40 per month)",
      "Real-time monitoring",
      "Automated takedown notices",
      "Priority support",
      "Monthly reports",
      "5 scheduled automated searches",
    ],
    stripePriceId: "price_1O2uq8Dt5zFTAXjQ3rkszxTy", // Replace with your real test mode Stripe Price ID
    popular: true,
    cta: "Upgrade Now"
  },
  {
    id: "enterprise",
    name: "Business Account",
    description: "Complete protection for businesses",
    price: 149,
    interval: "month",
    features: [
      "All Pro features",
      "Custom API access",
      "Dedicated account manager",
      "Legal assistance",
      "Custom integrations",
      "Advanced analytics",
      "20 scheduled automated searches",
    ],
    stripePriceId: "price_1O2urADt5zFTAXjQSKD8S5n4", // Replace with your real test mode Stripe Price ID
    popular: false,
    cta: "Upgrade Now"
  },
];

// Dashboard constants
export const RECENT_SEARCHES_LIMIT = 5;
export const DASHBOARD_TABS = ["overview", "searches", "alerts", "settings"];

// App routes
export const PROTECTED_ROUTES = [
  "/dashboard",
  "/search",
  "/alerts",
  "/settings",
  "/results"
];

// API constants
export const API_TIMEOUT = 30000; // 30 seconds

// Cache constants
export const SEARCH_CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
