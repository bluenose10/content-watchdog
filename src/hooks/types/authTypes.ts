
// Access level and feature types for authentication
export enum AccessLevel {
  ANONYMOUS = 'anonymous',  // Not logged in
  BASIC = 'basic',         // Logged in with free account
  PREMIUM = 'premium',     // Paid account
  ADMIN = 'admin'          // Admin user
}

export enum PremiumFeature {
  UNLIMITED_RESULTS = 'unlimited_results',
  SCHEDULED_SEARCHES = 'scheduled_searches',
  ADVANCED_MONITORING = 'advanced_monitoring',
  EXPORT_RESULTS = 'export_results'
}

export interface ProtectedRouteResult {
  user: any;
  loading: boolean;
  accessLevel: AccessLevel;
  isReady: boolean;
  hasPremiumFeature: (feature: PremiumFeature) => boolean;
  premiumFeaturesLoading: boolean;
  isAdmin: boolean;
}
