import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { TrendingUp, Target, Zap, Brain, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isThisWeek, startOfDay } from "date-fns";
import { 
  analyzeBurnoutRisk, 
  detectProductivityPatterns,
  generateSmartTaskRecommendations 
} from "../components/AIInsightsHelpers";

export default function Insights() {
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => base44.entities.Task.list("-created_date"),
  });

  const { data: focusSessions = [] } = useQuery({
    queryKey: ["focusSessions"],
    queryFn: () => base44.entities.FocusSession.list("-created_date", 100),
  });

  // Calculate stats
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const completedThisWeek = tasks.filter(
    (t) => t.status === "completed" && t.completed_at && isThisWeek(new Date(t.completed_at))
  ).length;

  const totalFocusTime = focusSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const avgSessionDuration =
    focusSessions.length > 0 ? Math.round(totalFocusTime / focusSessions.length) : 0;

  // Calculate streak
  const completedDates = tasks
    .filter((task) => task.completed_at)
    .map((task) => format(startOfDay(new Date(task.completed_at)), "yyyy-MM-dd"));
  const uniqueDates = [...new Set(completedDates)].sort().reverse();

  let streak = 0;
  let checkDate = format(new Date(), "yyyy-MM-dd");
  for (const date of uniqueDates) {
    if (date === checkDate) {
      streak++;
      const prevDay = new Date(checkDate);
      prevDay.setDate(prevDay.getDate() - 1);
      checkDate = format(prevDay, "yyyy-MM-dd");
    } else {
      break;
    }
  }

  // AI-powered insights
  const burnoutAnalysis = analyzeBurnoutRisk(focusSessions, tasks);
  const productivityPatterns = detectProductivityPatterns(focusSessions);
  const taskRecommendations = generateSmartTaskRecommendations(tasks);

  // Prepare insights for display
  const pendingTasks = tasks.filter((t) => t.status !== "completed").length;
  const highPriorityPending = tasks.filter(
    (t) => t.status !== "completed" && t.priority === "high"
  ).length;

  const insights = [
    {
      type: "success",
      icon: Target,
      title: "Great Progress!",
      message: `You've completed ${completedThisWeek} tasks this week. Keep up the momentum!`,
      show: completedThisWeek >= 5,
    },
    {
      type: "warning",
      icon: AlertTriangle,
      title: "Burnout Alert",
      message: burnoutAnalysis.recommendation,
      show: burnoutAnalysis.riskLevel === "high" || burnoutAnalysis.riskLevel === "medium",
    },
    {
      type: "warning",
      icon: AlertTriangle,
      title: "High Priority Tasks",
      message: `You have ${highPriorityPending} high-priority tasks pending. Consider tackling them first.`,
      show: highPriorityPending > 3,
    },
    {
      type: "info",
      icon: Zap,
      title: "Productivity Pattern",
      message: productivityPatterns.message || "Keep tracking to see your patterns",
      show: productivityPatterns.pattern === "identified",
    },
    {
      type: "info",
      icon: Zap,
      title: "Focus Pattern",
      message: `Your average focus session is ${avgSessionDuration} minutes. Try extending to 45 minutes for deeper work.`,
      show: avgSessionDuration < 30 && focusSessions.length > 5,
    },
    {
      type: "success",
      icon: Brain,
      title: "Consistency Win",
      message: `${streak} day streak! Daily progress leads to long-term success.`,
      show: streak >= 3,
    },
  ];

  const activeInsights = insights.filter((i) => i.show);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Insights</h1>
          <p className="text-slate-500">Track your productivity and growth</p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-slate-500">
                  Total Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-4xl font-bold text-slate-900">{completedTasks}</div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">All-time tasks</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-slate-500">
                  Focus Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-4xl font-bold text-slate-900">
                    {Math.round(totalFocusTime / 60)}h
                  </div>
                  <Zap className="h-8 w-8 text-purple-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Total focus hours • {burnoutAnalysis.hoursPerDay}h/day avg
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-slate-500">
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-4xl font-bold text-slate-900">{streak}</div>
                  <Target className="h-8 w-8 text-orange-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Days in a row</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-slate-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-600" />
                AI Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeInsights.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500">
                    Keep working! We'll provide insights as you build your productivity habits.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeInsights.map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className={`p-4 rounded-lg border ${
                          insight.type === "success"
                            ? "bg-green-50 border-green-200"
                            : insight.type === "warning"
                            ? "bg-amber-50 border-amber-200"
                            : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              insight.type === "success"
                                ? "bg-green-100"
                                : insight.type === "warning"
                                ? "bg-amber-100"
                                : "bg-blue-100"
                            }`}
                          >
                            <Icon
                              className={`h-5 w-5 ${
                                insight.type === "success"
                                  ? "text-green-600"
                                  : insight.type === "warning"
                                  ? "text-amber-600"
                                  : "text-blue-600"
                              }`}
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-1">
                              {insight.title}
                            </h4>
                            <p className="text-sm text-slate-600">{insight.message}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Task Recommendations */}
        {taskRecommendations.recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-indigo-600" />
                  Recommended Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  {taskRecommendations.message}
                </p>
                <div className="space-y-3">
                  {taskRecommendations.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 font-semibold text-indigo-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">{rec.task.title}</h4>
                        <p className="text-sm text-slate-500 mt-1">{rec.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Weekly Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>This Week's Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">{completedThisWeek}</div>
                  <div className="text-sm text-slate-500 mt-1">Tasks Completed</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">{pendingTasks}</div>
                  <div className="text-sm text-slate-500 mt-1">Pending Tasks</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">
                    {focusSessions.length}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">Focus Sessions</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">{avgSessionDuration}m</div>
                  <div className="text-sm text-slate-500 mt-1">Avg Session</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
