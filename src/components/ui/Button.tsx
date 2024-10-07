import React from "react";
import { PropsWithChildren } from "react";

export default function Button({
  children,
  onClick,
  variant = "contained",
  fullWidth = false,
  className,
  disabled = false,
}: PropsWithChildren<Props>) {
  return (
    <button
      disabled={disabled}
      className={`
      ${
        variant === "contained"
          ? "bg-foreground text-background"
          : variant === "text"
          ? ""
          : "border-[1px] border-foreground "
      }  px-4 py-2 rounded-lg font-semibold flex gap-1 items-center justify-center  ${
        fullWidth ? "w-full " : " "
      }  ${className || ""} disabled:opacity-80`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

interface Props {
  onClick: () => void;
  variant?: "contained" | "outlined" | "text";
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}
