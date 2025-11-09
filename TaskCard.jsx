import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Flag, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, isToday, isTomorrow, isPast } from "date-fns";

export default function TaskCard({ task, onToggle, onEdit, index = 0 }) {
  const priorityColors = {
    low: "text-slate-400",
    medium: "text-amber-500",
    high: "text-red-500"
  };

  const getDueDateLabel = () => {
    if (!task.due_date) return null;
    const date = new Date(task.due_date);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isPast(date)) return "Overdue";
    return format(date, "MMM d");
  };

  const dueDateColor = () => {
    if (!task.due_date) return "";
    const date = new Date(task.due_date);
    if (isPast(date) && task.status !== "completed") return "text-red-500 bg-red-50";
    if (isToday(date)) return "text-amber-600 bg-amber-50";
    return "text-slate-600 bg-slate-50";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className={`p-4 hover:shadow-md transition-all duration-200 cursor-pointer border-slate-200 ${
          task.status === "completed" ? "bg-slate-50" : "bg-white"
        }`}
        onClick={onEdit}
      >
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.status === "completed"}
            onCheckedChange={(checked) => {
              onToggle(task, checked ? "completed" : "todo");
            }}
            onClick={(e) => e.stopPropagation()}
            className="mt-1"
          />

          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium text-slate-900 mb-1 ${
                task.status === "completed" ? "line-through text-slate-500" : ""
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p className="text-sm text-slate-500 mb-2">{task.description}</p>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <Flag className={`h-3.5 w-3.5 ${priorityColors[task.priority]}`} />

              {task.due_date && (
                <Badge variant="outline" className={`text-xs ${dueDateColor()}`}>
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {getDueDateLabel()}
                </Badge>
              )}

              {task.time_estimate && (
                <Badge variant="outline" className="text-xs text-slate-600">
                  <Clock className="h-3 w-3 mr-1" />
                  {task.time_estimate}m
                </Badge>
              )}

              <Badge variant="outline" className="text-xs text-slate-500">
                {task.category}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
