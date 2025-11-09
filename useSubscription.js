import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

/**
 * Hook to check user's subscription status
 * 
 * @returns {Object} Subscription status and utilities
 */
export function useSubscription() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => base44.auth.me(),
  });

  const isPremium = React.useMemo(() => {
    if (!user) return false;
    
    const hasPremiumTier = user.subscription_tier === "premium";
    const isNotExpired = !user.subscription_expires || 
      new Date(user.subscription_expires) > new Date();
    
    return hasPremiumTier && isNotExpired;
  }, [user]);

  const hasFeature = React.useCallback((featureName) => {
    if (!user) return false;
    if (isPremium) return true;
    
    return user.premium_features_enabled?.includes(featureName) || false;
  }, [user, isPremium]);

  const daysUntilExpiry = React.useMemo(() => {
    if (!user?.subscription_expires) return null;
    
    const expiry = new Date(user.subscription_expires);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }, [user]);

  return {
    user,
    isPremium,
    isLoading,
    hasFeature,
    daysUntilExpiry,
    subscriptionTier: user?.subscription_tier || "free"
  };
}
