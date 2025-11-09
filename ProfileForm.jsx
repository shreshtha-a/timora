import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { User, Camera, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * ProfileForm Component
 * 
 * Editable profile fields with optimistic UI updates
 * - Full name
 * - Avatar upload
 * - Timezone selection
 * - Email (read-only)
 */
export default function ProfileForm({ user }) {
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    avatar_url: user?.avatar_url || "",
    timezone: user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  
  const [message, setMessage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
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
      console.error("Profile update failed:", error);
      setMessage({ type: "error", text: "Failed to save changes. Please try again." });
    },
  });

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setMessage({ type: "error", text: "Please upload an image file" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image must be less than 5MB" });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, avatar_url: file_url });
      setMessage({ type: "success", text: "Avatar uploaded! Click Save to confirm." });
    } catch (error) {
      console.error("Avatar upload failed:", error);
      setMessage({ type: "error", text: "Failed to upload avatar" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (!formData.full_name.trim()) {
      setMessage({ type: "error", text: "Name cannot be empty" });
      return;
    }

    updateProfileMutation.mutate(formData);
  };

  const timezones = Intl.supportedValuesOf?.('timeZone') || [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney',
  ];

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
          <div className="flex items-start gap-6 mb-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                {formData.avatar_url ? (
                  <img
                    src={formData.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 h-8 w-8 bg-white rounded-full border-2 border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors shadow-md"
              >
                <Camera className="w-4 h-4 text-slate-600" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={isUploading}
              />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-1">Profile Picture</h3>
              <p className="text-sm text-slate-500 mb-2">
                Upload a photo to personalize your account
              </p>
              <p className="text-xs text-slate-400">
                JPG, PNG or GIF. Max 5MB.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="full_name" className="text-slate-700 mb-2 block">
                Full Name
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter your full name"
                className="border-slate-200"
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <Label htmlFor="email" className="text-slate-700 mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                value={user?.email || ""}
                disabled
                className="bg-slate-50 border-slate-200 text-slate-500"
              />
              <p className="text-xs text-slate-400 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Timezone */}
            <div>
              <Label htmlFor="timezone" className="text-slate-700 mb-2 block">
                Timezone
              </Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) => setFormData({ ...formData, timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-400 mt-1">
                Used for date and time displays
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6 pt-6 border-t border-slate-200">
            <Button
              onClick={handleSave}
              disabled={updateProfileMutation.isPending || isUploading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
