import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, ArrowRight } from "lucide-react";

export default function AutomationForm({ automation, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(automation || {
    name: "",
    description: "",
    trigger_type: "task_completed",
    action_type: "create_task",
    action_data: {},
    is_active: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="mb-6 border-purple-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center justify-between">
          <CardTitle>
            {automation ? "Edit Automation" : "Create Automation"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Automation Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Create follow-up when task completed"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="What does this automation do?"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="trigger">Trigger (When) *</Label>
              <Select
                value={formData.trigger_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, trigger_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task_completed">Task Completed</SelectItem>
                  <SelectItem value="task_created">Task Created</SelectItem>
                  <SelectItem value="task_overdue">Task Overdue</SelectItem>
                  <SelectItem value="time_based">Specific Time</SelectItem>
                  <SelectItem value="status_changed">Status Changed</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                What triggers this automation
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="action">Action (Then) *</Label>
              <Select
                value={formData.action_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, action_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="create_task">Create Task</SelectItem>
                  <SelectItem value="update_task">Update Task</SelectItem>
                  <SelectItem value="send_email">Send Email</SelectItem>
                  <SelectItem value="create_note">Create Note</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                What action to perform
              </p>
            </div>
          </div>

          {formData.action_type === "create_task" && (
            <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium text-slate-900">Task Details</h4>
              <div className="space-y-2">
                <Label htmlFor="task_title">New Task Title</Label>
                <Input
                  id="task_title"
                  value={formData.action_data?.title || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      action_data: { ...formData.action_data, title: e.target.value },
                    })
                  }
                  placeholder="e.g., Follow up on previous task"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task_description">Task Description</Label>
                <Textarea
                  id="task_description"
                  value={formData.action_data?.description || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      action_data: {
                        ...formData.action_data,
                        description: e.target.value,
                      },
                    })
                  }
                  placeholder="Details for the new task"
                  rows={2}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {automation ? "Update" : "Create"} Automation
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}AutomationForm.jsx
