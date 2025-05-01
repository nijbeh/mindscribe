"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import type { JournalEntry } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Trash2, Menu } from "lucide-react"
import { formatDateForDisplay } from "@/lib/utils"

interface EditorProps {
  entry: JournalEntry
  onUpdateContent: (content: string) => void
  onDeleteEntry: () => void
  onOpenMobileMenu: () => void
}

export function Editor({ entry, onUpdateContent, onDeleteEntry, onOpenMobileMenu }: EditorProps) {
  const [content, setContent] = useState(entry.content)
  const [isSaving, setIsSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update content when entry changes
  useEffect(() => {
    setContent(entry.content)

    // Focus the editor when switching entries
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [entry])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // Handle content changes and auto-save with debounce
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)

    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Set saving indicator
    setIsSaving(true)

    // Debounce the save operation
    saveTimeoutRef.current = setTimeout(() => {
      onUpdateContent(newContent)
      setIsSaving(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onOpenMobileMenu}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
          <div>
            <span className="font-medium">{entry.title}</span>
            <span className="text-xs text-muted-foreground ml-2">
              {isSaving ? "Saving..." : `Last edited ${formatDateForDisplay(new Date(entry.updatedAt))}`}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
          onClick={onDeleteEntry}
        >
          <Trash2 className="h-5 w-5" />
          <span className="sr-only">Delete entry</span>
        </Button>
      </div>

      <div className="p-6 flex-1 overflow-auto">
        {entry.prompt && (
          <div className="mb-6 p-4 bg-muted rounded-md text-muted-foreground italic">
            <p className="text-sm font-medium mb-1">Today's Prompt:</p>
            <p>{entry.prompt}</p>
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          className="w-full h-full min-h-[300px] outline-none resize-none bg-transparent font-sans text-base leading-relaxed"
          placeholder="Start writing here..."
        />
      </div>
    </div>
  )
}
