import { Suspense } from 'react'
import HomeClient from './HomeClient'

// You can create a more beautiful loading skeleton here if you wish
function Loading() {
  return <h2>🌀 Loading...</h2>
}

export default function HomePage() {
  return (
    <Suspense fallback={<Loading />}>
      <HomeClient />
    </Suspense>
  )
}