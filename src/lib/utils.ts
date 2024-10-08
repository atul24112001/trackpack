import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function _copyToClipBoard(str: string, onCopy?: () => void) {
  try {
    await navigator.clipboard.writeText(str);
    onCopy?.();
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
}
