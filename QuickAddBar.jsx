import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Flag, Calendar as CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function QuickAddBar({ onAddTask, onAddNote, compact = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("task"); // task or note
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (mode === "task") {
      onAddTask({
        title: input,
        priority,
        due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : undefined,
      });
    } else {
      onAddNote({
        title: input,
        content: input,
      });
    }

    setInput("");
    setPriority("medium");
    setDueDate(null);
    setIsExpanded(false);
  };

  if (compact && !isExpanded) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsExpanded(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-2xl"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className={compact ? "fixed bottom-6 right-6 left-6 z-50 md:left-auto md:w-96" : "w-full"}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-4">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 mb-3">
              <button
                type="button"
                onClick={() => setMode("task")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  mode === "task"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                Task
              </button>
              <button
                type="button"
                onClick={() => setMode("note")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  mode === "note"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                Note
              </button>
              {compact && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="ml-auto p-1 hover:bg-slate-100 rounded"
                >
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              )}
            </div>

            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "task" ? "What needs to be done?" : "Quick note..."}
              className="mb-3 border-slate-200 focus:border-indigo-500 text-base"
              autoFocus
            />

            {mode === "task" && (
              <div className="flex items-center gap-2 mb-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <Flag className={`h-3 w-3 mr-1 ${
                        priority === "high" ? "text-red-500" :
                        priority === "medium" ? "text-amber-500" :
                        "text-slate-400"
                      }`} />
                      {priority}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-32 p-2">
                    <div className="space-y-1">
                      {["low", "medium", "high"].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className="w-full text-left px-2 py-1 text-sm rounded hover:bg-slate-100"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {dueDate ? format(dueDate, "MMM d") : "Due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                Add {mode === "task" ? "Task" : "Note"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
