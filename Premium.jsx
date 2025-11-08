import React from "react";
import { motion } from "framer-motion";
import { Crown, Check, Zap, Lock, Repeat, Shield, Cloud, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "../components/SubscriptionChecker";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Premium() {
  const { isPremium, subscriptionTier, daysUntilExpiry } = useSubscription();

  const features = [
    {
      icon: Repeat,
      title: "Advanced Recurring Tasks",
      description: "Create complex recurring schedules with custom patterns, automatic reminders, and smart workflows for projects and routines.",
      benefits: [
        "Daily, weekly, monthly, or custom schedules",
        "Automatic task generation",
        "Smart reminder system",
        "Pause and resume schedules",
      ],
    },
    {
      icon: Zap,
      title: "Conditional Task Automation",
      description: "Trigger tasks or follow-ups automatically based on task completion, status changes, or time-based rules.",
      benefits: [
        "If-then automation rules",
        "Multi-step workflows",
        "Automatic email notifications",
        "Behavior-based triggers",
      ],
    },
    {
      icon: Cloud,
      title: "Enhanced Cloud Features",
      description: "All your data is securely synced and backed up with advanced versioning and recovery options.",
      benefits: [
        "Automatic sync across all devices",
        "Version history (30 days)",
        "One-click data recovery",
        "Priority support",
      ],
    },
    {
      icon: Shield,
      title: "Premium Support & Security",
      description: "Get priority support, advanced security features, and exclusive access to new features.",
      benefits: [
        "Priority email support",
        "Early access to new features",
        "Enhanced data encryption",
        "Export all your data anytime",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {isPremium ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-100 to-orange-100 mb-8">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  You're a Premium Member!
                </h2>
                <p className="text-slate-600 mb-4">
                  Enjoy all premium features and priority support
                </p>
                {daysUntilExpiry && (
                  <Badge className="bg-amber-500 text-white">
                    {daysUntilExpiry} days remaining
                  </Badge>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-6 shadow-xl">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Upgrade to Premium
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Unlock powerful automation, advanced features, and take your productivity to the next level
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-slate-900 mb-2">
                  $9<span className="text-2xl text-slate-600">/mo</span>
                </div>
                <p className="text-sm text-slate-500">Billed monthly</p>
              </div>
              <div className="text-slate-400">or</div>
              <div className="text-center">
                <div className="text-5xl font-bold text-slate-900 mb-2">
                  $89<span className="text-2xl text-slate-600">/yr</span>
                </div>
                <p className="text-sm text-slate-500">Save $19</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-slate-200 h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                        <p className="text-sm text-slate-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardContent className="p-8 text-center">
                <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Ready to supercharge your productivity?
                </h3>
                <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                  Join thousands of users who are automating their workflows and getting more done with Flow Premium
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Start Premium Trial
                  </Button>
                  <Link to={createPageUrl("Dashboard")}>
                    <Button size="lg" variant="outline">
                      Continue with Free
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-slate-500 mt-4">
                  14-day money-back guarantee • Cancel anytime
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Try Premium Features */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              Try Premium Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to={createPageUrl("RecurringTasks")}>
                <Card className="border-slate-200 hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Repeat className="w-8 h-8 text-indigo-600" />
                        <div>
                          <h4 className="font-semibold text-slate-900">Recurring Tasks</h4>
                          <p className="text-sm text-slate-500">Automate your routine</p>
                        </div>
                      </div>
                      <Lock className="w-5 h-5 text-amber-500" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to={createPageUrl("Automations")}>
                <Card className="border-slate-200 hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Zap className="w-8 h-8 text-purple-600" />
                        <div>
                          <h4 className="font-semibold text-slate-900">Automations</h4>
                          <p className="text-sm text-slate-500">Smart workflows</p>
                        </div>
                      </div>
                      <Lock className="w-5 h-5 text-amber-500" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
