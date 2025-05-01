import { Suspense } from "react"
import { JournalApp } from "@/components/journal-app"
import { getJournalEntries } from "@/app/actions/journal"

export default async function Home() {
  // Fetch initial entries on the server
  const { data: initialEntries = [] } = await getJournalEntries()

  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <JournalApp initialEntries={initialEntries} />
    </Suspense>
  )
}
