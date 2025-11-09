import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, Smartphone, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * NotificationsForm Component
 * 
 * Manage notification preferences
 * - Email notifications
 * - Push notifications (with permission handling)
 * - Digest frequency
 */
export default function NotificationsForm({ user }) {
  const [settings, setSettings] = useState({
    email: user?.notification_settings?.email !== false,
    push: user?.notification_settings?.push || false,
    digest: user?.notification_settings?.digest || "none",
  });

  const [message, setMessage] = useState(null);
  const [pushPermission, setPushPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  
  const queryClient = useQueryClient();

  const updateNotificationsMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe({ notification_settings: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      const now = new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      });
      setMessage({ type: "success", text: `Saved • ${now}` });
      setTimeout(() => setMessage(null), 3000);
    },
    onError: (error) => {
      console.error("Notifications update failed:", error);
      setMessage({ type: "error", text: "Failed to save notification settings" });
    },
  });

  const handleToggle = async (key, value) => {
    // Special handling for push notifications
    if (key === "push" && value) {
      if (typeof Notification === "undefined") {
        setMessage({ 
          type: "error", 
          text: "Push notifications are not supported in your browser" 
        });
        return;
      }

      if (Notification.permission === "denied") {
        setMessage({ 
          type: "error", 
          text: "Push notifications are blocked. Please enable them in your browser settings." 
        });
        return;
      }

      if (Notification.permission === "default") {
        try {
          const permission = await Notification.requestPermission();
          setPushPermission(permission);
          
          if (permission !== "granted") {
            setMessage({ 
              type: "error", 
              text: "Push notification permission denied" 
            });
            return;
          }
        } catch (error) {
          console.error("Permission request failed:", error);
          setMessage({ 
            type: "error", 
            text: "Failed to request notification permission" 
          });
          return;
        }
      }
    }

    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateNotificationsMutation.mutate(newSettings);
  };

  const handleDigestChange = (value) => {
    const newSettings = { ...settings, digest: value };
    setSettings(newSettings);
    updateNotificationsMutation.mutate(newSettings);
  };

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
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Notifications</h3>
              <p className="text-sm text-slate-500">
                Manage how you receive updates and reminders
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Email Notifications</p>
                  <p className="text-sm text-slate-500">
                    Receive updates and reminders via email
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.email}
                onCheckedChange={(checked) => handleToggle("email", checked)}
              />
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Push Notifications</p>
                  <p className="text-sm text-slate-500">
                    Get instant alerts in your browser
                  </p>
                  {pushPermission === "denied" && (
                    <p className="text-xs text-red-500 mt-1">
                      Blocked - enable in browser settings
                    </p>
                  )}
                </div>
              </div>
              <Switch
                checked={settings.push && pushPermission === "granted"}
                onCheckedChange={(checked) => handleToggle("push", checked)}
                disabled={pushPermission === "denied"}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Digest Settings */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-1">Email Digest</h3>
              <p className="text-sm text-slate-500 mb-4">
                Receive a summary of your tasks and progress
              </p>

              <Select
                value={settings.digest}
                onValueChange={handleDigestChange}
                disabled={!settings.email}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly (Sunday)</SelectItem>
                </SelectContent>
              </Select>

              {!settings.email && (
                <p className="text-xs text-slate-400 mt-2">
                  Enable email notifications to use digests
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Examples */}
      <Card className="border-slate-200 bg-slate-50">
        <CardContent className="p-6">
          <h4 className="font-semibold text-slate-900 mb-3">You'll be notified about:</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5"></div>
              <span>Upcoming tasks and events</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5"></div>
              <span>Task reminders you've set</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5"></div>
              <span>Productivity milestones and achievements</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5"></div>
              <span>Weekly summaries (if digest enabled)</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Privacy Note:</strong> We'll never send spam or share your email with third parties.
          You can adjust these settings anytime.
        </p>
      </div>
    </div>
  );
}
