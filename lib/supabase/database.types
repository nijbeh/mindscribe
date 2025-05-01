export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      journal_entries: {
        Row: {
          id: string
          user_id: string | null
          title: string
          content: string | null
          prompt: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          content?: string | null
          prompt?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          content?: string | null
          prompt?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
