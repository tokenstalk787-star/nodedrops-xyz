import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={twMerge(
            clsx(
              "flex h-10 w-full rounded-lg border border-border bg-background-secondary px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
              error && "border-status-error focus:border-status-error focus:ring-status-error",
              className
            )
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-status-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
