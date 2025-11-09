import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { createPageUrl } from "@/utils";

/**
 * ErrorBoundary Component
 * 
 * Catches React errors and displays a user-friendly fallback UI
 * Prevents entire app crashes and provides recovery options
 * 
 * Production-ready error handling for safe public launch
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });

    // Log to external service in production
    // Example: Sentry.captureException(error);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = createPageUrl("Dashboard");
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full border-red-200">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-red-900">
                    Oops! Something went wrong
                  </CardTitle>
                  <p className="text-sm text-red-700 mt-1">
                    Don't worry - your data is safe
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-700 mb-3">
                  We encountered an unexpected error. This has been logged and we'll
                  work to fix it. In the meantime, try one of these options:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    <span>Try refreshing the page</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    <span>Go back to the dashboard</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    <span>Clear your browser cache if the problem persists</span>
                  </div>
                </div>
              </div>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <summary className="cursor-pointer text-sm font-medium text-red-900 mb-2">
                    Error Details (Development Only)
                  </summary>
                  <div className="text-xs text-red-800 font-mono overflow-auto">
                    <p className="mb-2 font-bold">{this.state.error.toString()}</p>
                    <pre className="whitespace-pre-wrap">
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </div>
                </details>
              )}

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={this.handleReload}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Refresh Page
                </Button>
                <Button onClick={this.handleGoHome} variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
                <Button onClick={this.handleReset} variant="ghost">
                  Try Again
                </Button>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <p className="text-xs text-slate-500">
                  Your data is automatically backed up. If you continue to experience issues,
                  you can export your data from Settings and contact support.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;ErrorBoundary.jsx
