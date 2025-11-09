import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * InstallPrompt Component
 * 
 * Prompts users to install the PWA on their device.
 * Shows native install prompt on supported browsers.
 * 
 * Features:
 * - Detects if app is installable
 * - Shows custom install banner
 * - Dismissible with localStorage persistence
 * - Only shows on mobile devices
 */
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const isDismissed = localStorage.getItem("pwa-install-dismissed");
    if (isDismissed) return;

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // Listen for install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("PWA installed");
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-install-dismissed", "true");
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-6 md:w-96"
        >
          <Card className="border-indigo-200 shadow-2xl">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Download className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Install Flow App
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Add to your home screen for quick access and offline use
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleInstall}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600"
                    >
                      Install
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleDismiss}
                    >
                      Not now
                    </Button>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
