import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

/**
 * EmailField Component
 * 
 * Reusable email input with validation and accessibility
 */
export default function EmailField({ value, onChange, error, disabled }) {
  return (
    <div>
      <Label htmlFor="email" className="text-slate-700 mb-2 block">
        Email address
      </Label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          id="email"
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="you@example.com"
          className={`pl-10 h-12 text-base ${
            error ? "border-red-500 focus:border-red-500" : ""
          }`}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? "email-error" : undefined}
          autoComplete="email"
          required
        />
      </div>
      {error && (
        <p id="email-error" className="text-sm text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
