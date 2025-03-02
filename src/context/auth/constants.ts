
// Admin emails list - in production, this would come from a database
export const ADMIN_EMAILS = ['admin@influenceguard.com', 'test@example.com', 'mark.moran4@btinternet.com'];

// Helper function to check if user email is in admin list
export const checkAdminStatus = (email: string | undefined) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};
