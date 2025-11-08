import React from "react";
import { motion } from "framer-motion";
import { User, Sliders, Bell, Database, UserCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

// Setting Components
import ProfileForm from "../components/settings/ProfileForm";
import PreferencesForm from "../components/settings/PreferencesForm";
import NotificationsForm from "../components/settings/NotificationsForm";
import DataBackup from "../components/DataBackup";
import AccountPanel from "../components/settings/AccountPanel";

export default function Settings() {
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

  const handleExportData = () => {
    try {
      const exportData = {
        version: "1.0",
        exported_at: new Date().toISOString(),
        profile: {
          full_name: user?.full_name,
          email: user?.email,
          timezone: user?.timezone,
          theme_preference: user?.theme_preference,
        },
        data: {
          tasks: tasks.map(t => ({
            ...t,
            id: undefined,
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
      link.download = `flow-complete-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-500">Manage your account and preferences</p>
        </motion.div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:w-auto bg-white border border-slate-200">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2">
              <Sliders className="h-4 w-4" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Data</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2">
              <UserCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileForm user={user} />
          </TabsContent>

          <TabsContent value="preferences">
            <PreferencesForm user={user} />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsForm user={user} />
          </TabsContent>

          <TabsContent value="data">
            <DataBackup />
          </TabsContent>

          <TabsContent value="account">
            <AccountPanel user={user} onExportData={handleExportData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
