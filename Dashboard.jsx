import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isToday, startOfDay } from "date-fns";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Flame, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuickAddBar from "../components/QuickAddBar";
import TaskCard from "../components/TaskCard";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => base44.auth.me(),
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => base44.entities.Task.list("-created_date"),
  });

  const { data: focusSessions = [] } = useQuery({
    queryKey: ["focusSessions"],
    queryFn: () => base44.entities.FocusSession.list("-created_date", 100),
  });

  const createTaskMutation = useMutation({
    mutationFn: (taskData) => base44.entities.Task.create(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: (noteData) => base44.entities.Note.create(noteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Task.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const todayTasks = tasks.filter(
    (task) =>
      task.status !== "completed" &&
      (task.due_date === format(new Date(), "yyyy-MM-dd") || task.category === "daily")
  );

  const completedToday = tasks.filter(
    (task) =>
      task.status === "completed" &&
      task.completed_at &&
      isToday(new Date(task.completed_at))
  ).length;

  const todaySessions = focusSessions.filter(
    (session) =>
      session.started_at && isToday(new Date(session.started_at))
  );

  const focusMinutesToday = todaySessions.reduce(
    (sum, session) => sum + (session.duration || 0),
    0
  );

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

  const handleToggleTask = (task, newStatus) => {
    updateTaskMutation.mutate({
      id: task.id,
      data: {
        ...task,
        status: newStatus,
        completed_at: newStatus === "completed" ? new Date().toISOString() : null,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            {greeting}{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-slate-500">
            {format(new Date(), "EEEE, MMMM d")}
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-slate-900">{completedToday}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Focus Time</p>
                    <p className="text-2xl font-bold text-slate-900">{focusMinutesToday}m</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Streak</p>
                    <p className="text-2xl font-bold text-slate-900">{streak} days</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Flame className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Pending</p>
                    <p className="text-2xl font-bold text-slate-900">{todayTasks.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Add */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <QuickAddBar
            onAddTask={(data) => createTaskMutation.mutate(data)}
            onAddNote={(data) => createNoteMutation.mutate(data)}
          />
        </motion.div>

        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900">
                Today's Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayTasks.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">All clear for today!</p>
                  <p className="text-sm text-slate-400 mt-1">Add a task to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayTasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      index={index}
                      onToggle={handleToggleTask}
                      onEdit={() => {}}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
