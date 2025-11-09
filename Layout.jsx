import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  FileText,
  Calendar,
  TrendingUp,
  Menu,
  X,
  Repeat,
  Zap,
  Crown,
  Settings as SettingsIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import InstallPrompt from "./components/InstallPrompt";
import OfflineIndicator from "./components/OfflineIndicator";
import ErrorBoundary from "./components/ErrorBoundary";

const navItems = [
  { name: "Dashboard", path: "Dashboard", icon: LayoutDashboard },
  { name: "Tasks", path: "Tasks", icon: CheckSquare },
  { name: "Focus", path: "Focus", icon: Timer },
  { name: "Notes", path: "Notes", icon: FileText },
  { name: "Calendar", path: "Calendar", icon: Calendar },
  { name: "Insights", path: "Insights", icon: TrendingUp },
];

const premiumNavItems = [
  { name: "Recurring", path: "RecurringTasks", icon: Repeat },
  { name: "Automations", path: "Automations", icon: Zap },
  { name: "Premium", path: "Premium", icon: Crown, highlight: true },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path) => {
    return location.pathname === createPageUrl(path);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <style>{`
          :root {
            --color-primary: #6366F1;
            --color-primary-dark: #4F46E5;
            --color-success: #10B981;
            --color-focus: #8B5CF6;
            --color-text-primary: #1E293B;
            --color-text-secondary: #64748B;
            --color-bg-subtle: #F8FAFC;
            --color-border: #E2E8F0;
          }

          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          /* PWA specific styles */
          @media (display-mode: standalone) {
            body {
              padding-top: env(safe-area-inset-top);
              padding-bottom: env(safe-area-inset-bottom);
            }
          }

          /* Mobile tap highlight */
          * {
            -webkit-tap-highlight-color: rgba(99, 102, 241, 0.1);
          }

          .nav-link {
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .nav-link:hover {
            transform: translateX(4px);
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-up {
            animation: fadeInUp 0.4s ease-out forwards;
          }

          /* Mobile bottom navigation */
          .mobile-nav {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
          }
        `}</style>

        {/* Offline Indicator */}
        <OfflineIndicator />

        {/* Install Prompt */}
        <InstallPrompt />

        {/* Desktop Sidebar */}
        <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-8 pb-4 overflow-y-auto bg-white/80 backdrop-blur-xl border-r border-slate-200">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Timer className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-semibold text-slate-900">Flow</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={createPageUrl(item.path)}
                    className={`nav-link group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl ${
                      active
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                    }`} />
                    {item.name}
                  </Link>
                );
              })}

              {/* Premium Section */}
              <div className="pt-4 mt-4 border-t border-slate-200">
                <div className="px-3 mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Premium
                  </span>
                </div>
                {premiumNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={createPageUrl(item.path)}
                      className={`nav-link group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl ${
                        item.highlight
                          ? "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 hover:from-amber-200 hover:to-orange-200"
                          : active
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        item.highlight
                          ? "text-amber-600"
                          : active
                          ? "text-indigo-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* Settings */}
              <div className="pt-4 mt-4 border-t border-slate-200">
                <Link
                  to={createPageUrl("Settings")}
                  className={`nav-link group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl ${
                    isActive("Settings")
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <SettingsIcon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive("Settings") ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                  }`} />
                  Settings
                </Link>
              </div>
            </nav>

            {/* Footer */}
            <div className="px-6 mt-6 pt-6 border-t border-slate-200">
              <div className="text-xs text-slate-500">
                Made with Flow
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Timer className="w-4 h-4 text-white" />
              </div>
              <span className="ml-2 text-lg font-semibold text-slate-900">Flow</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="px-4 pb-4 space-y-1 bg-white border-t border-slate-100">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={createPageUrl(item.path)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl ${
                      active
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${active ? "text-indigo-600" : "text-slate-400"}`} />
                    {item.name}
                  </Link>
                );
              })}
              <Link
                to={createPageUrl("Settings")}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl ${
                  isActive("Settings")
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <SettingsIcon className={`mr-3 h-5 w-5 ${isActive("Settings") ? "text-indigo-600" : "text-slate-400"}`} />
                Settings
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 mobile-nav bg-white/90 border-t border-slate-200 pb-safe">
          <div className="grid grid-cols-5 gap-1 px-2 py-2">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
                    active
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-slate-500"
                  }`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              );
            })}
            <Link
              to={createPageUrl("Settings")}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
                isActive("Settings")
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-slate-500"
              }`}
            >
              <SettingsIcon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Settings</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:pl-64 flex flex-col flex-1">
          <main className="flex-1 pt-16 pb-20 md:pt-0 md:pb-0">
            {children}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
