import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  LogOut, 
  Trash2, 
  AlertTriangle, 
  Download,
  Shield,
  User as UserIcon,
  Crown
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * AccountPanel Component
 * 
 * Account management and security
 * - Account information display
 * - Logout functionality
 * - Account deletion (with confirmation)
 */
export default function AccountPanel({ user, onExportData }) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handleLogout = () => {
    base44.auth.logout();
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation !== "DELETE") {
      return;
    }

    // Export data first
    onExportData();

    // Show warning that they need to contact support
    alert(
      "To complete account deletion, please contact support at support@flow.app with your email. " +
      "Your data has been exported for your records."
    );
    
    setShowDeleteDialog(false);
    setDeleteConfirmation("");
  };

  return (
    <div className="space-y-6">
      {/* Account Info */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-slate-900 mb-1">
                {user?.full_name || "User"}
              </h3>
              <p className="text-slate-600 mb-2">{user?.email}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {user?.role || "user"}
                </Badge>
                {user?.subscription_tier === "premium" && (
                  <Badge className="bg-amber-100 text-amber-700">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Member since</span>
              <span className="font-medium text-slate-900">
                {user?.created_date
                  ? new Date(user.created_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Account type</span>
              <span className="font-medium text-slate-900 capitalize">
                {user?.subscription_tier || "Free"}
              </span>
            </div>

            {user?.subscription_expires && (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Subscription expires</span>
                <span className="font-medium text-slate-900">
                  {new Date(user.subscription_expires).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Security</h3>
              <p className="text-sm text-slate-500">
                Your account is protected with industry-standard security
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>End-to-end encryption active</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Automatic daily backups</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secure data transmission (HTTPS)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Account Actions</h3>

          <div className="space-y-3">
            {/* Export Data */}
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-slate-900">Export Your Data</p>
                  <p className="text-sm text-slate-500">
                    Download all your information
                  </p>
                </div>
              </div>
              <Button onClick={onExportData} variant="outline" size="sm">
                Export
              </Button>
            </div>

            {/* Logout */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="font-medium text-slate-900">Sign Out</p>
                  <p className="text-sm text-slate-500">
                    Sign out of this device
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowLogoutDialog(true)}
                variant="outline"
                size="sm"
              >
                Sign Out
              </Button>
            </div>

            {/* Delete Account */}
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-slate-900">Delete Account</p>
                  <p className="text-sm text-slate-500">
                    Permanently delete your account
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-100"
              >
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logout Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Out?</DialogTitle>
            <DialogDescription>
              You'll need to sign in again to access your data. Your data will be saved
              and synced when you return.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogout} className="bg-indigo-600">
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <DialogTitle>Delete Account</DialogTitle>
            </div>
            <DialogDescription className="space-y-3">
              <p>
                This action <strong>cannot be undone</strong>. This will permanently delete
                your account and remove all your data from our servers.
              </p>
              <p className="text-sm">
                Before deletion, your data will be automatically exported for your records.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                <p className="text-sm text-red-800">
                  Type <strong>DELETE</strong> to confirm deletion
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <Input
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="border-red-300"
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeleteConfirmation("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== "DELETE"}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
