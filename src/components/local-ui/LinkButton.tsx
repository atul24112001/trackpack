import Link from "next/link";
import React, { PropsWithChildren } from "react";

export default function LinkButton({
  href,
  children,
  variant = "contained",
  fullWidth = false,
  className,
}: PropsWithChildren<Props>) {
  return (
    <Link
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
      href={href}
    >
      {children}
    </Link>
  );
}

type Props = {
  href: string;
  variant?: "contained" | "outlined" | "text";
  fullWidth?: boolean;
  className?: string;
};
