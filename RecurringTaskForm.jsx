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
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

export default function RecurringTaskForm({ task, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(task || {
    title: "",
    description: "",
    priority: "medium",
    category: "daily",
    recurrence_type: "daily",
    recurrence_interval: 1,
    recurrence_days: [],
    recurrence_time: "09:00",
    start_date: new Date().toISOString().split("T")[0],
    auto_reminder_minutes: 15,
    is_active: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleDay = (day) => {
    const days = formData.recurrence_days || [];
    if (days.includes(day)) {
      setFormData({
        ...formData,
        recurrence_days: days.filter((d) => d !== day),
      });
    } else {
      setFormData({
        ...formData,
        recurrence_days: [...days, day],
      });
    }
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <Card className="mb-6 border-indigo-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <CardTitle>
            {task ? "Edit Recurring Task" : "Create Recurring Task"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Review weekly reports"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recurrence_type">Recurrence Pattern *</Label>
              <Select
                value={formData.recurrence_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, recurrence_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.recurrence_type !== "weekly" && (
              <div className="space-y-2">
                <Label htmlFor="interval">Repeat Every</Label>
                <Input
                  id="interval"
                  type="number"
                  min="1"
                  value={formData.recurrence_interval}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recurrence_interval: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            )}
          </div>

          {formData.recurrence_type === "weekly" && (
            <div className="space-y-2">
              <Label>Days of Week</Label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      formData.recurrence_days?.includes(day)
                        ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">Time of Day</Label>
              <Input
                id="time"
                type="time"
                value={formData.recurrence_time}
                onChange={(e) =>
                  setFormData({ ...formData, recurrence_time: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminder">Reminder (minutes before)</Label>
              <Input
                id="reminder"
                type="number"
                min="0"
                value={formData.auto_reminder_minutes || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    auto_reminder_minutes: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="someday">Someday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              {task ? "Update" : "Create"} Recurring Task
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
