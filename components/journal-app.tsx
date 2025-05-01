"use client"

import { useState } from "react"
import { Editor } from "@/components/editor"
import { Sidebar } from "@/components/sidebar"
import type { JournalEntry } from "@/lib/types"
import { createJournalEntry, updateJournalEntry, deleteJournalEntry } from "@/app/actions/journal"
import { useToast } from "@/hooks/use-toast"

interface JournalAppProps {
  initialEntries: JournalEntry[]
}

export function JournalApp({ initialEntries }: JournalAppProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries)
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(
    initialEntries.length > 0 ? initialEntries[0].id : null,
  )
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Get the currently selected entry
  const selectedEntry = entries.find((entry) => entry.id === selectedEntryId) || null

  // Create a new entry
  const handleCreateNewEntry = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await createJournalEntry()

      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        })
        return
      }

      if (data) {
        setEntries([data, ...entries])
        setSelectedEntryId(data.id)
        setIsMobileMenuOpen(false)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new entry",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Update an entry
  const handleUpdateEntry = async (id: string, content: string) => {
    // First update the local state immediately for a responsive feel
    setEntries(
      entries.map((entry) => (entry.id === id ? { ...entry, content, updatedAt: new Date().toISOString() } : entry)),
    )

    try {
      const { data, error } = await updateJournalEntry(id, content)

      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        })
        return
      }

      if (data) {
        // Update with the server response data
        setEntries(entries.map((entry) => (entry.id === id ? data : entry)))
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update entry",
        variant: "destructive",
      })
    }
  }

  // Delete an entry
  const handleDeleteEntry = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setIsLoading(true)
      try {
        const { error } = await deleteJournalEntry(id)

        if (error) {
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          })
          return
        }

        const newEntries = entries.filter((entry) => entry.id !== id)
        setEntries(newEntries)

        // Select another entry if available
        if (newEntries.length > 0) {
          setSelectedEntryId(newEntries[0].id)
        } else {
          setSelectedEntryId(null)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete entry",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        entries={entries}
        selectedEntryId={selectedEntryId}
        onSelectEntry={(id) => {
          setSelectedEntryId(id)
          setIsMobileMenuOpen(false)
        }}
        onCreateNewEntry={handleCreateNewEntry}
        onDeleteEntry={handleDeleteEntry}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isLoading={isLoading}
      />

      <main className="flex-1 overflow-hidden">
        {selectedEntry ? (
          <Editor
            entry={selectedEntry}
            onUpdateContent={(content) => handleUpdateEntry(selectedEntry.id, content)}
            onDeleteEntry={() => handleDeleteEntry(selectedEntry.id)}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center flex-col p-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">Welcome to MindScribe</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Your personal journaling space for capturing thoughts, reflections, and experiences.
            </p>
            <button
              onClick={handleCreateNewEntry}
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Your First Entry"}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
