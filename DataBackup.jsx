import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, Database, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * DataBackup Component
 * 
 * Provides data integrity and backup functionality:
 * - Export all user data as JSON
 * - Import/restore from backup file
 * - Automatic local snapshots
 * - Data validation before restore
 * 
 * Production-ready features for safe public launch
 */
export default function DataBackup() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState(null);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => base44.auth.me(),
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => base44.entities.Task.list("-created_date"),
  });

  const { data: notes = [] } = useQuery({
    queryKey: ["notes"],
    queryFn: () => base44.entities.Note.list("-created_date"),
  });

  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: () => base44.entities.Event.list("-created_date"),
  });

  const { data: focusSessions = [] } = useQuery({
    queryKey: ["focusSessions"],
    queryFn: () => base44.entities.FocusSession.list("-created_date"),
  });

  // Auto-save snapshot to localStorage every 24 hours
  React.useEffect(() => {
    const saveSnapshot = () => {
      try {
        const snapshot = {
          version: "1.0",
          timestamp: new Date().toISOString(),
          user_email: user?.email,
          data: {
            tasks,
            notes,
            events,
            focusSessions,
          },
        };

        const lastSnapshot = localStorage.getItem("flow_last_snapshot_time");
        const now = Date.now();
        const oneDayAgo = now - 24 * 60 * 60 * 1000;

        // Save if no snapshot exists or if 24 hours have passed
        if (!lastSnapshot || parseInt(lastSnapshot) < oneDayAgo) {
          localStorage.setItem("flow_data_snapshot", JSON.stringify(snapshot));
          localStorage.setItem("flow_last_snapshot_time", now.toString());
          console.log("Auto-snapshot saved successfully");
        }
      } catch (error) {
        console.error("Error saving auto-snapshot:", error);
      }
    };

    if (user && tasks.length > 0) {
      saveSnapshot();
    }
  }, [user, tasks, notes, events, focusSessions]);

  const handleExport = async () => {
    setIsExporting(true);
    setMessage(null);

    try {
      const exportData = {
        version: "1.0",
        exported_at: new Date().toISOString(),
        user_email: user?.email,
        data: {
          tasks: tasks.map(t => ({
            ...t,
            id: undefined, // Remove ID for clean import
            created_date: undefined,
            updated_date: undefined,
            created_by: undefined,
          })),
          notes: notes.map(n => ({
            ...n,
            id: undefined,
            created_date: undefined,
            updated_date: undefined,
            created_by: undefined,
          })),
          events: events.map(e => ({
            ...e,
            id: undefined,
            created_date: undefined,
            updated_date: undefined,
            created_by: undefined,
          })),
          focusSessions: focusSessions.map(f => ({
            ...f,
            id: undefined,
            created_date: undefined,
            updated_date: undefined,
            created_by: undefined,
          })),
        },
        stats: {
          total_tasks: tasks.length,
          total_notes: notes.length,
          total_events: events.length,
          total_sessions: focusSessions.length,
        },
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `flow-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({
        type: "success",
        text: "Backup exported successfully! File downloaded.",
      });
    } catch (error) {
      console.error("Export error:", error);
      setMessage({
        type: "error",
        text: "Failed to export data. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const validateBackupData = (data) => {
    // Basic validation
    if (!data || typeof data !== "object") {
      throw new Error("Invalid backup file format");
    }

    if (!data.version || !data.data) {
      throw new Error("Missing required backup fields");
    }

    // Validate data structure
    const { tasks, notes, events, focusSessions } = data.data;

    if (!Array.isArray(tasks) && !Array.isArray(notes) && 
        !Array.isArray(events) && !Array.isArray(focusSessions)) {
      throw new Error("No valid data arrays found in backup");
    }

    return true;
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setMessage(null);

    try {
      const text = await file.text();
      const backupData = JSON.parse(text);

      // Validate backup
      validateBackupData(backupData);

      const { tasks: backupTasks, notes: backupNotes, events: backupEvents, focusSessions: backupSessions } = backupData.data;

      // Import with error handling for each entity
      let imported = { tasks: 0, notes: 0, events: 0, sessions: 0 };
      let failed = { tasks: 0, notes: 0, events: 0, sessions: 0 };

      // Import tasks
      if (Array.isArray(backupTasks)) {
        for (const task of backupTasks) {
          try {
            await base44.entities.Task.create(task);
            imported.tasks++;
          } catch (error) {
            console.error("Failed to import task:", error);
            failed.tasks++;
          }
        }
      }

      // Import notes
      if (Array.isArray(backupNotes)) {
        for (const note of backupNotes) {
          try {
            await base44.entities.Note.create(note);
            imported.notes++;
          } catch (error) {
            console.error("Failed to import note:", error);
            failed.notes++;
          }
        }
      }

      // Import events
      if (Array.isArray(backupEvents)) {
        for (const evt of backupEvents) {
          try {
            await base44.entities.Event.create(evt);
            imported.events++;
          } catch (error) {
            console.error("Failed to import event:", error);
            failed.events++;
          }
        }
      }

      // Import focus sessions
      if (Array.isArray(backupSessions)) {
        for (const session of backupSessions) {
          try {
            await base44.entities.FocusSession.create(session);
            imported.sessions++;
          } catch (error) {
            console.error("Failed to import session:", error);
            failed.sessions++;
          }
        }
      }

      // Refresh all queries
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["focusSessions"] });

      const totalImported = imported.tasks + imported.notes + imported.events + imported.sessions;
      const totalFailed = failed.tasks + failed.notes + failed.events + failed.sessions;

      if (totalImported > 0) {
        setMessage({
          type: "success",
          text: `Successfully imported ${totalImported} items! ${totalFailed > 0 ? `(${totalFailed} failed)` : ""}`,
        });
      } else {
        setMessage({
          type: "error",
          text: "No items could be imported. Please check the backup file.",
        });
      }
    } catch (error) {
      console.error("Import error:", error);
      setMessage({
        type: "error",
        text: `Failed to import: ${error.message}`,
      });
    } finally {
      setIsImporting(false);
      event.target.value = ""; // Reset file input
    }
  };

  const getSnapshotInfo = () => {
    try {
      const snapshot = localStorage.getItem("flow_data_snapshot");
      const timestamp = localStorage.getItem("flow_last_snapshot_time");

      if (!snapshot || !timestamp) return null;

      const date = new Date(parseInt(timestamp));
      return {
        date: date.toLocaleString(),
        size: (new Blob([snapshot]).size / 1024).toFixed(2),
      };
    } catch (error) {
      return null;
    }
  };

  const snapshotInfo = getSnapshotInfo();

  return (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === "success" ? "default" : "destructive"}>
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-indigo-600" />
            Data Backup & Export
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Download className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-slate-900 mb-1">Export Your Data</h4>
              <p className="text-sm text-slate-600 mb-3">
                Download all your tasks, notes, events, and focus sessions as a JSON file.
                Keep it safe for backup or migration.
              </p>
              <Button
                onClick={handleExport}
                disabled={isExporting}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Exporting..." : "Export Data"}
              </Button>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Upload className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 mb-1">Import from Backup</h4>
                <p className="text-sm text-slate-600 mb-3">
                  Restore your data from a previously exported JSON file. This will add items
                  to your existing data (not replace).
                </p>
                <label htmlFor="import-file">
                  <Button
                    as="span"
                    disabled={isImporting}
                    variant="outline"
                    className="w-full sm:w-auto cursor-pointer"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isImporting ? "Importing..." : "Import Data"}
                  </Button>
                </label>
                <input
                  id="import-file"
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                  disabled={isImporting}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-600" />
            Automatic Local Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Database className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-slate-900 mb-1">Local Backup Protection</h4>
              <p className="text-sm text-slate-600 mb-3">
                Your data is automatically saved to your browser every 24 hours as a safety
                measure. This works offline and protects against accidental data loss.
              </p>
              {snapshotInfo ? (
                <div className="space-y-2">
                  <Badge variant="outline" className="text-green-600 bg-green-50">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>Last snapshot: {snapshotInfo.date}</p>
                    <p>Size: {snapshotInfo.size} KB</p>
                  </div>
                </div>
              ) : (
                <Badge variant="outline" className="text-slate-500">
                  No snapshot yet - will be created after 24 hours
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Data Privacy Note</p>
            <p>
              Your backup files contain all your personal data. Store them securely and never
              share them publicly. All data remains encrypted on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
