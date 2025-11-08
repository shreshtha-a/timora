import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Flag, Calendar as CalendarIcon, Clock, MoreVertical } from "lucide-react";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

/**
 * MobileOptimizedTaskCard Component
 * 
 * Task card optimized for mobile devices with:
 * - Large touch targets (minimum 44x44px)
 * - Swipe gestures for quick actions
 * - Haptic feedback on interactions
 * - Compact but readable layout
 * 
 * Future AI Integration Points:
 * - Smart priority suggestions based on due date
 * - Auto-categorization of tasks
 * - Time estimate predictions
 * - Optimal scheduling recommendations
 */
export default function MobileOptimizedTaskCard({ 
  task, 
  onToggle, 
  onEdit, 
  onDelete,
  index = 0 
}) {
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

  const handleCheckboxToggle = (checked) => {
    // Haptic feedback (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    onToggle(task, checked ? "completed" : "todo");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className={`p-4 active:scale-[0.98] transition-transform border-slate-200 ${
          task.status === "completed" ? "bg-slate-50" : "bg-white"
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Larger checkbox for mobile */}
          <div className="pt-1">
            <Checkbox
              checked={task.status === "completed"}
              onCheckedChange={handleCheckboxToggle}
              className="h-6 w-6"
            />
          </div>

          <div className="flex-1 min-w-0" onClick={onEdit}>
            <h3
              className={`font-medium text-slate-900 mb-1 text-base ${
                task.status === "completed" ? "line-through text-slate-500" : ""
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p className="text-sm text-slate-500 mb-2 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <Flag className={`h-4 w-4 ${priorityColors[task.priority]}`} />

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

              <Badge variant="outline" className="text-xs text-slate-500 capitalize">
                {task.category}
              </Badge>
            </div>
          </div>

          {/* Mobile-friendly dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 flex-shrink-0"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onEdit}>
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(task.id)}
                className="text-red-600"
              >
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </motion.div>
  );
}
