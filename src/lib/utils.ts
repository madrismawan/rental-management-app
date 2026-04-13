import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import config from "./config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function setDocumentTitle(title?: string) {
  const appName = config.appName || "MyApp";
  if (typeof window !== "undefined") {
    document.title = title ? `${title} - ${appName}` : appName;
  }
}
