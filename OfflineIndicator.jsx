import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * OfflineIndicator Component
 * 
 * Shows connection status to the user.
 * Helpful for offline-first apps to indicate sync status.
 * 
 * Features:
 * - Detects online/offline state
 * - Shows indicator when offline
 * - Auto-hides when back online
 * - Positioned for mobile use
 */
export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {(!isOnline || showReconnected) && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
          <Badge
            className={`px-4 py-2 text-sm font-medium shadow-lg ${
              isOnline
                ? "bg-green-500 text-white"
                : "bg-slate-800 text-white"
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4 mr-2" />
                Back online
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 mr-2" />
                Working offline
              </>
            )}
          </Badge>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
