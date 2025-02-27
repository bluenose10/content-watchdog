
// Constants for the application
export const APP_NAME = "ContentShield";
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

// Pricing constants - use real Stripe Test mode product IDs
export const PRICING_PLANS = [
  {
    id: "basic",
    name: "Basic",
    description: "Essential monitoring for individuals",
    price: 0,
    features: [
      "5 searches per month",
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
      "Unlimited searches",
      "Real-time monitoring",
      "Automated takedown notices",
      "Priority support",
      "Monthly reports",
    ],
    stripePriceId: "price_1O2uq8Dt5zFTAXjQ3rkszxTy", // Replace with your real test mode Stripe Price ID
    popular: true,
    cta: "Sign Up Now"
  },
  {
    id: "enterprise",
    name: "Enterprise",
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
    ],
    stripePriceId: "price_1O2urADt5zFTAXjQSKD8S5n4", // Replace with your real test mode Stripe Price ID
    popular: false,
    cta: "Contact Sales"
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
