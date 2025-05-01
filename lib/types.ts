export interface JournalEntry {
  id: string
  title: string
  content: string
  prompt: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}
