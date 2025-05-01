"use client"

import type { JournalEntry } from "@/lib/types"
import { cn, formatDateForDisplay } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PlusCircle, Menu, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SidebarProps {
  entries: JournalEntry[]
  selectedEntryId: string | null
  onSelectEntry: (id: string) => void
  onCreateNewEntry: () => void
  onDeleteEntry: (id: string) => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isOpen: boolean) => void
  isLoading?: boolean
}

export function Sidebar({
  entries,
  selectedEntryId,
  onSelectEntry,
  onCreateNewEntry,
  onDeleteEntry,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isLoading = false,
}: SidebarProps) {
  // Function to strip HTML tags and get plain text
  const getPlainText = (html: string) => {
    return html.replace(/<[^>]*>/g, "")
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "bg-muted/40 w-80 border-r border-border flex flex-col h-full transition-all duration-300 ease-in-out",
          "fixed inset-y-0 left-0 z-40 md:relative",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h1 className="font-semibold text-xl">MindScribe</h1>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>

        <div className="p-4">
          <Button onClick={onCreateNewEntry} className="w-full justify-start gap-2" disabled={isLoading}>
            <PlusCircle className="h-4 w-4" />
            {isLoading ? "Creating..." : "New Entry"}
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-2 py-2">
            <h2 className="text-sm font-medium text-muted-foreground mb-2 px-2">Entries ({entries.length})</h2>
            <div className="space-y-1">
              {entries.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => onSelectEntry(entry.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    selectedEntryId === entry.id ? "bg-accent text-accent-foreground" : "",
                  )}
                >
                  <div className="font-medium">{entry.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {entry.content ? getPlainText(entry.content).substring(0, 60) : "No content"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDateForDisplay(new Date(entry.updatedAt))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
