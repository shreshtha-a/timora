import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Repeat, Trash2, Edit, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PremiumGate from "../components/PremiumGate";
import { useSubscription } from "../components/SubscriptionChecker";
import RecurringTaskForm from "../components/RecurringTaskForm";

export default function RecurringTasks() {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const queryClient = useQueryClient();
  const { isPremium } = useSubscription();

  const { data: recurringTasks = [] } = useQuery({
    queryKey: ["recurringTasks"],
    queryFn: () => base44.entities.RecurringTask.list("-created_date"),
    enabled: isPremium,
  });

  const createRecurringMutation = useMutation({
    mutationFn: (data) => base44.entities.RecurringTask.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurringTasks"] });
      setShowForm(false);
      setEditingTask(null);
    },
  });

  const updateRecurringMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.RecurringTask.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurringTasks"] });
    },
  });

  const deleteRecurringMutation = useMutation({
    mutationFn: (id) => base44.entities.RecurringTask.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurringTasks"] });
    },
  });

  const toggleActive = (task) => {
    updateRecurringMutation.mutate({
      id: task.id,
      data: { ...task, is_active: !task.is_active },
    });
  };

  const getRecurrenceLabel = (task) => {
    if (task.recurrence_type === "daily") {
      return task.recurrence_interval === 1 
        ? "Daily" 
        : `Every ${task.recurrence_interval} days`;
    }
    if (task.recurrence_type === "weekly") {
      const days = task.recurrence_days?.join(", ") || "Weekly";
      return `Weekly on ${days}`;
    }
    if (task.recurrence_type === "monthly") {
      return `Every ${task.recurrence_interval || 1} month(s)`;
    }
    return "Custom";
  };

  const recurringTasksContent = (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Recurring Tasks
              </h1>
              <p className="text-slate-500">Automate your routine with smart schedules</p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Recurring Task
            </Button>
          </div>
        </motion.div>

        {showForm && (
          <RecurringTaskForm
            task={editingTask}
            onSubmit={(data) => {
              if (editingTask) {
                updateRecurringMutation.mutate({ id: editingTask.id, data });
              } else {
                createRecurringMutation.mutate(data);
              }
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        )}

        <div className="space-y-4">
          {recurringTasks.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="p-12 text-center">
                <Repeat className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No recurring tasks yet</p>
                <p className="text-sm text-slate-400 mt-1">
                  Create your first automated task routine
                </p>
              </CardContent>
            </Card>
          ) : (
            recurringTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`border-slate-200 ${!task.is_active ? "opacity-60" : ""}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {task.title}
                          </h3>
                          <Badge variant={task.is_active ? "default" : "secondary"}>
                            <Repeat className="w-3 h-3 mr-1" />
                            {getRecurrenceLabel(task)}
                          </Badge>
                          {!task.is_active && (
                            <Badge variant="outline" className="text-slate-500">
                              Paused
                            </Badge>
                          )}
                        </div>

                        {task.description && (
                          <p className="text-slate-600 mb-3">{task.description}</p>
                        )}

                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>Priority: {task.priority}</span>
                          <span>•</span>
                          <span>Category: {task.category}</span>
                          {task.recurrence_time && (
                            <>
                              <span>•</span>
                              <span>Time: {task.recurrence_time}</span>
                            </>
                          )}
                          {task.auto_reminder_minutes && (
                            <>
                              <span>•</span>
                              <span>Reminder: {task.auto_reminder_minutes}m before</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleActive(task)}
                          title={task.is_active ? "Pause" : "Activate"}
                        >
                          {task.is_active ? (
                            <Power className="w-4 h-4 text-green-600" />
                          ) : (
                            <PowerOff className="w-4 h-4 text-slate-400" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingTask(task);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteRecurringMutation.mutate(task.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <PremiumGate
      feature="recurring_tasks"
      featureTitle="Advanced Recurring Tasks"
      featureDescription="Automate your routine with smart recurring schedules, complex patterns, and automatic reminders. Set tasks to repeat daily, weekly, monthly, or create custom schedules."
    >
      {recurringTasksContent}
    </PremiumGate>
  );
}
