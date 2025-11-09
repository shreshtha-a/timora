import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff } from "lucide-react";

/**
 * PasswordField Component
 * 
 * Reusable password input with show/hide toggle and validation
 */
export default function PasswordField({ 
  value, 
  onChange, 
  error, 
  disabled, 
  label = "Password",
  placeholder = "Enter your password",
  showStrength = false,
  autoComplete = "current-password"
}) {
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (password) => {
    if (password.length === 0) return null;
    if (password.length < 8) return { label: "Weak", color: "text-red-600" };
    
    let strength = 0;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength < 2) return { label: "Fair", color: "text-amber-600" };
    if (strength < 3) return { label: "Good", color: "text-blue-600" };
    return { label: "Strong", color: "text-green-600" };
  };

  const strength = showStrength ? getPasswordStrength(value) : null;

  return (
    <div>
      <Label htmlFor="password" className="text-slate-700 mb-2 block">
        {label}
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`pl-10 pr-12 h-12 text-base ${
            error ? "border-red-500 focus:border-red-500" : ""
          }`}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? "password-error" : undefined}
          autoComplete={autoComplete}
          required
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-slate-400" />
          ) : (
            <Eye className="h-5 w-5 text-slate-400" />
          )}
        </Button>
      </div>
      {strength && (
        <p className={`text-sm mt-1 ${strength.color}`}>
          Password strength: {strength.label}
        </p>
      )}
      {error && (
        <p id="password-error" className="text-sm text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
