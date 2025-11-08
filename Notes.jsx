import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Pin, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import QuickAddBar from "../components/QuickAddBar";

export default function Notes() {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: notes = [] } = useQuery({
    queryKey: ["notes"],
    queryFn: () => base44.entities.Note.list("-created_date"),
  });

  const createNoteMutation = useMutation({
    mutationFn: (noteData) => base44.entities.Note.create(noteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Note.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id) => base44.entities.Note.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const filteredNotes = notes
    .filter((note) => note.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const togglePin = (note) => {
    updateNoteMutation.mutate({
      id: note.id,
      data: { ...note, pinned: !note.pinned },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Notes</h1>
          <p className="text-slate-500">Capture your thoughts and ideas</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base bg-white border-slate-200"
            />
          </div>
        </motion.div>

        {/* Quick Add */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <QuickAddBar onAddNote={(data) => createNoteMutation.mutate(data)} />
        </motion.div>

        {/* Notes Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredNotes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500">No notes yet</p>
              <p className="text-sm text-slate-400 mt-1">Create your first note to get started</p>
            </div>
          ) : (
            filteredNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-slate-200 hover:shadow-lg transition-shadow duration-200 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-slate-900 text-lg">{note.title}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 -mt-1 -mr-2"
                        onClick={() => togglePin(note)}
                      >
                        <Pin
                          className={`h-4 w-4 ${
                            note.pinned ? "fill-amber-500 text-amber-500" : "text-slate-400"
                          }`}
                        />
                      </Button>
                    </div>

                    <p className="text-sm text-slate-600 whitespace-pre-wrap mb-4">
                      {note.content}
                    </p>

                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {note.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-xs text-slate-400">
                        {new Date(note.created_date).toLocaleDateString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNoteMutation.mutate(note.id)}
                        className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}Notes.jsx
