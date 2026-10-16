import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "cyan" | "default";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
    };

    const variantStyles = {
      default:
        "bg-brand-purple hover:bg-brand-purple-light text-white shadow-glow-purple focus:ring-brand-purple",
      primary:
        "bg-brand-purple hover:bg-brand-purple-light text-white shadow-glow-purple focus:ring-brand-purple",
      secondary:
        "bg-background-card hover:bg-background-hover text-text-primary border border-border focus:ring-brand-blue",
      outline:
        "bg-transparent border border-border hover:border-brand-blue text-text-primary hover:bg-background-hover focus:ring-brand-blue",
      ghost:
        "bg-transparent hover:bg-background-hover text-text-secondary hover:text-text-primary focus:ring-brand-purple",
      destructive:
        "bg-status-error/90 hover:bg-status-error text-white focus:ring-status-error",
      cyan:
        "bg-brand-cyan hover:bg-brand-cyan-light text-background font-semibold shadow-glow-cyan focus:ring-brand-cyan",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(
          clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
