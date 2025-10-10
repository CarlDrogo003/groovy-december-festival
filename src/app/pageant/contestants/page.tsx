import { Suspense } from 'react'
import ContestantsClient from './ContestantsClient'

// This is the placeholder that will be shown on the server
// while the client component loads.
function Loading() {
  return <h2>🌀 Loading Contestants...</h2>
}

export default function ContestantsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ContestantsClient />
    </Suspense>
  )
}
