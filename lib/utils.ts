import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDateForDisplay(date: Date): string {
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return `Today at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
  } else if (diffInDays === 1) {
    return `Yesterday at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
  } else if (diffInDays < 7) {
    return (
      date.toLocaleDateString("en-US", { weekday: "long" }) +
      ` at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
    )
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
  }
}
