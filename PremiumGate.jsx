import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Lock, Crown, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

/**
 * PremiumGate Component
 * 
 * Wraps premium features and shows upgrade prompt for free users.
 * Checks user's subscription status and renders content or upgrade UI.
 * 
 * @param {string} feature - Feature name (for analytics)
 * @param {ReactNode} children - Premium content to show
 * @param {string} featureTitle - Display title
 * @param {string} featureDescription - What the feature does
 */
export default function PremiumGate({ 
  feature, 
  children, 
  featureTitle = "Premium Feature",
  featureDescription = "This feature is available with a premium subscription."
}) {
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => base44.auth.me(),
  });

  // Check if user has active premium subscription
  const isPremium = user?.subscription_tier === "premium" && 
    (!user?.subscription_expires || new Date(user.subscription_expires) > new Date());

  if (isPremium) {
    return <>{children}</>;
  }

  // Show upgrade prompt for free users
  return (
    <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardContent className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mb-4 shadow-lg">
          <Crown className="w-8 h-8 text-white" />
        </div>
        
        <Badge className="mb-3 bg-amber-500 text-white">
          <Sparkles className="w-3 h-3 mr-1" />
          Premium Feature
        </Badge>

        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          {featureTitle}
        </h3>
        
        <p className="text-slate-600 mb-6 max-w-md mx-auto">
          {featureDescription}
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={() => navigate(createPageUrl("Premium"))}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Premium
          </Button>
          
          <Button variant="outline">
            Learn More
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-amber-200">
          <p className="text-xs text-slate-500">
            Preview of locked content below
          </p>
        </div>

        {/* Show blurred preview */}
        <div className="mt-4 blur-sm opacity-50 pointer-events-none select-none">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
