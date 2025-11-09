import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon, Monitor, Volume2, Vibrate, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * PreferencesForm Component
 * 
 * User preferences with instant theme switching
 * - Theme (light/dark/system)
 * - Focus mode defaults
 * - Sound and haptics
 */
export default function PreferencesForm({ user }) {
  const [preferences, setPreferences] = useState({
    theme_preference: user?.theme_preference || "system",
    focus_mode: user?.focus_mode || "normal",
    sound_enabled: user?.sound_enabled !== false,
    haptics_enabled: user?.haptics_enabled !== false,
  });

  const [message, setMessage] = useState(null);
  const queryClient = useQueryClient();

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyTheme(preferences.theme_preference);
  }, [preferences.theme_preference]);

  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // System preference
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const updatePreferencesMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
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
      console.error("Preferences update failed:", error);
      setMessage({ type: "error", text: "Failed to save preferences" });
    },
  });

  const handleThemeChange = (theme) => {
    const newPrefs = { ...preferences, theme_preference: theme };
    setPreferences(newPrefs);
    
    // Save to localStorage immediately for offline
    localStorage.setItem("flow_theme_preference", theme);
    
    // Save to server
    updatePreferencesMutation.mutate(newPrefs);
  };

  const handleToggle = (key, value) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    
    // Save to localStorage
    localStorage.setItem(`flow_${key}`, value.toString());
    
    // Save to server
    updatePreferencesMutation.mutate(newPrefs);
  };

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const ThemeIcon = themeIcons[preferences.theme_preference];

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

      {/* Theme Settings */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <ThemeIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Theme</h3>
              <p className="text-sm text-slate-500">
                Choose how Flow looks to you
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "light", label: "Light", icon: Sun },
              { value: "dark", label: "Dark", icon: Moon },
              { value: "system", label: "System", icon: Monitor },
            ].map((option) => {
              const Icon = option.icon;
              const isSelected = preferences.theme_preference === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 mx-auto mb-2 ${
                      isSelected ? "text-indigo-600" : "text-slate-400"
                    }`}
                  />
                  <p
                    className={`text-sm font-medium ${
                      isSelected ? "text-indigo-900" : "text-slate-600"
                    }`}
                  >
                    {option.label}
                  </p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Focus Mode Defaults */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Monitor className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-1">Focus Mode</h3>
              <p className="text-sm text-slate-500 mb-4">
                Default mode for focus sessions
              </p>

              <Select
                value={preferences.focus_mode}
                onValueChange={(value) => {
                  const newPrefs = { ...preferences, focus_mode: value };
                  setPreferences(newPrefs);
                  localStorage.setItem("flow_focus_mode", value);
                  updatePreferencesMutation.mutate(newPrefs);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="focus">Focus (minimal distractions)</SelectItem>
                  <SelectItem value="zen">Zen (maximum focus)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sound & Haptics */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Feedback</h3>

          <div className="space-y-4">
            {/* Sound */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Sound Effects</p>
                  <p className="text-sm text-slate-500">
                    Play sounds for actions and notifications
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.sound_enabled}
                onCheckedChange={(checked) => handleToggle("sound_enabled", checked)}
              />
            </div>

            {/* Haptics */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Vibrate className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Haptic Feedback</p>
                  <p className="text-sm text-slate-500">
                    Vibrate on mobile devices
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.haptics_enabled}
                onCheckedChange={(checked) => handleToggle("haptics_enabled", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Your preferences sync across all your devices when you're online.
        </p>
      </div>
    </div>
  );
}
