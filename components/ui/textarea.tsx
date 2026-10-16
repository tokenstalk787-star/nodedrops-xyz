import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={twMerge(
            clsx(
              "flex min-h-[100px] w-full rounded-lg border border-border bg-background-secondary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple disabled:cursor-not-allowed disabled:opacity-50 transition-colors leading-relaxed",
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

Textarea.displayName = "Textarea";
