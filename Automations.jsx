import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Zap, Trash2, Edit, Power, PowerOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PremiumGate from "../components/PremiumGate";
import { useSubscription } from "../components/SubscriptionChecker";
import AutomationForm from "../components/AutomationForm";

export default function Automations() {
  const [showForm, setShowForm] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState(null);
  const queryClient = useQueryClient();
  const { isPremium } = useSubscription();

  const { data: automations = [] } = useQuery({
    queryKey: ["automations"],
    queryFn: () => base44.entities.TaskAutomation.list("-created_date"),
    enabled: isPremium,
  });

  const createAutomationMutation = useMutation({
    mutationFn: (data) => base44.entities.TaskAutomation.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      setShowForm(false);
      setEditingAutomation(null);
    },
  });

  const updateAutomationMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.TaskAutomation.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
    },
  });

  const deleteAutomationMutation = useMutation({
    mutationFn: (id) => base44.entities.TaskAutomation.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
    },
  });

  const toggleActive = (automation) => {
    updateAutomationMutation.mutate({
      id: automation.id,
      data: { ...automation, is_active: !automation.is_active },
    });
  };

  const getTriggerLabel = (trigger) => {
    const labels = {
      task_completed: "When task completed",
      task_created: "When task created",
      task_overdue: "When task overdue",
      time_based: "At specific time",
      status_changed: "When status changes",
    };
    return labels[trigger] || trigger;
  };

  const getActionLabel = (action) => {
    const labels = {
      create_task: "Create new task",
      update_task: "Update task",
      send_email: "Send email",
      create_note: "Create note",
    };
    return labels[action] || action;
  };

  const automationsContent = (
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
                Task Automations
              </h1>
              <p className="text-slate-500">
                Create smart workflows that trigger automatically
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Automation
            </Button>
          </div>
        </motion.div>

        {showForm && (
          <AutomationForm
            automation={editingAutomation}
            onSubmit={(data) => {
              if (editingAutomation) {
                updateAutomationMutation.mutate({ id: editingAutomation.id, data });
              } else {
                createAutomationMutation.mutate(data);
              }
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingAutomation(null);
            }}
          />
        )}

        <div className="space-y-4">
          {automations.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="p-12 text-center">
                <Zap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No automations yet</p>
                <p className="text-sm text-slate-400 mt-1">
                  Create your first workflow automation
                </p>
              </CardContent>
            </Card>
          ) : (
            automations.map((automation, index) => (
              <motion.div
                key={automation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`border-slate-200 ${
                    !automation.is_active ? "opacity-60" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {automation.name}
                          </h3>
                          {!automation.is_active && (
                            <Badge variant="outline" className="text-slate-500">
                              Paused
                            </Badge>
                          )}
                        </div>

                        {automation.description && (
                          <p className="text-slate-600 mb-4">
                            {automation.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg">
                          <div className="flex-1">
                            <p className="text-xs text-slate-500 mb-1">TRIGGER</p>
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                              {getTriggerLabel(automation.trigger_type)}
                            </Badge>
                          </div>

                          <ArrowRight className="w-5 h-5 text-slate-400" />

                          <div className="flex-1">
                            <p className="text-xs text-slate-500 mb-1">ACTION</p>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                              {getActionLabel(automation.action_type)}
                            </Badge>
                          </div>
                        </div>

                        <div className="mt-4 text-sm text-slate-500">
                          Triggered {automation.trigger_count || 0} times
                          {automation.last_triggered && (
                            <> • Last: {new Date(automation.last_triggered).toLocaleDateString()}</>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleActive(automation)}
                          title={automation.is_active ? "Pause" : "Activate"}
                        >
                          {automation.is_active ? (
                            <Power className="w-4 h-4 text-green-600" />
                          ) : (
                            <PowerOff className="w-4 h-4 text-slate-400" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingAutomation(automation);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteAutomationMutation.mutate(automation.id)}
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
      feature="task_automation"
      featureTitle="Conditional Task Automation"
      featureDescription="Create powerful workflows that respond to your actions. Automatically create follow-up tasks, send notifications, and build complex productivity systems."
    >
      {automationsContent}
    </PremiumGate>
  );
}
