import { Metadata } from "next"
import HotelsClient from "./HotelsClient"

export const metadata: Metadata = {
  title: "Hotel Bookings - Groovy December Festival",
  description: "Book accommodations for your stay during the Groovy December Festival. Find the perfect hotel near the festival venues.",
}

export default function HotelsPage() {
  return <HotelsClient />
}