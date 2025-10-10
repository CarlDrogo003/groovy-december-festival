import { Suspense } from 'react'
import AuthClient from './AuthClient'

function Loading() {
  // You can customize this loading component
  return <h2>🌀 Loading Authentication...</h2>
}

export default function AuthPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AuthClient />
    </Suspense>
  )
}