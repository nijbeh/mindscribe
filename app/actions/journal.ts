"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { JournalEntry, ApiResponse } from "@/lib/types"
import { revalidatePath } from "next/cache"
import { generatePrompt } from "@/lib/prompts"
import { formatDate } from "@/lib/utils"

// Temporary user ID until we implement authentication
const TEMP_USER_ID = "00000000-0000-0000-0000-000000000000"

// Convert database entry to app entry
function mapDbEntryToAppEntry(dbEntry: any): JournalEntry {
  return {
    id: dbEntry.id,
    title: dbEntry.title,
    content: dbEntry.content || "",
    prompt: dbEntry.prompt || "",
    createdAt: dbEntry.created_at,
    updatedAt: dbEntry.updated_at,
  }
}

// Get all journal entries
export async function getJournalEntries(): Promise<ApiResponse<JournalEntry[]>> {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", TEMP_USER_ID)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching journal entries:", error)
      return { error: "Failed to fetch journal entries" }
    }

    return { data: data.map(mapDbEntryToAppEntry) }
  } catch (error) {
    console.error("Error in getJournalEntries:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Get a single journal entry by ID
export async function getJournalEntry(id: string): Promise<ApiResponse<JournalEntry>> {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("id", id)
      .eq("user_id", TEMP_USER_ID)
      .single()

    if (error) {
      console.error("Error fetching journal entry:", error)
      return { error: "Failed to fetch journal entry" }
    }

    return { data: mapDbEntryToAppEntry(data) }
  } catch (error) {
    console.error("Error in getJournalEntry:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Create a new journal entry
export async function createJournalEntry(): Promise<ApiResponse<JournalEntry>> {
  try {
    const supabase = createServerSupabaseClient()
    const now = new Date()

    const newEntry = {
      user_id: TEMP_USER_ID,
      title: formatDate(now),
      content: "",
      prompt: generatePrompt(),
    }

    const { data, error } = await supabase.from("journal_entries").insert(newEntry).select().single()

    if (error) {
      console.error("Error creating journal entry:", error)
      return { error: "Failed to create journal entry" }
    }

    revalidatePath("/")
    return { data: mapDbEntryToAppEntry(data) }
  } catch (error) {
    console.error("Error in createJournalEntry:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Update a journal entry
export async function updateJournalEntry(id: string, content: string): Promise<ApiResponse<JournalEntry>> {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("journal_entries")
      .update({
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", TEMP_USER_ID)
      .select()
      .single()

    if (error) {
      console.error("Error updating journal entry:", error)
      return { error: "Failed to update journal entry" }
    }

    revalidatePath("/")
    return { data: mapDbEntryToAppEntry(data) }
  } catch (error) {
    console.error("Error in updateJournalEntry:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Delete a journal entry
export async function deleteJournalEntry(id: string): Promise<ApiResponse<void>> {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("journal_entries").delete().eq("id", id).eq("user_id", TEMP_USER_ID)

    if (error) {
      console.error("Error deleting journal entry:", error)
      return { error: "Failed to delete journal entry" }
    }

    revalidatePath("/")
    return {}
  } catch (error) {
    console.error("Error in deleteJournalEntry:", error)
    return { error: "An unexpected error occurred" }
  }
}
