
import { PremiumFeature } from "../types/authTypes";

// Check if a subscription has a specific premium feature
export const checkFeatureAccess = (
  feature: PremiumFeature,
  isAdmin: boolean,
  subscription: any | null
): boolean => {
  // Admin users have access to all premium features
  if (isAdmin) return true;
  
  if (!subscription || !subscription.plans) return false;

  switch (feature) {
    case PremiumFeature.UNLIMITED_RESULTS:
      return subscription.plans.result_limit === -1;
    case PremiumFeature.SCHEDULED_SEARCHES:
      return (subscription.plans.scheduled_search_limit || 0) > 0;
    case PremiumFeature.ADVANCED_MONITORING:
      return subscription.plans.monitoring_limit > 0;
    case PremiumFeature.EXPORT_RESULTS:
      return true; // Assuming all premium plans have export capability
    default:
      return false;
  }
};
