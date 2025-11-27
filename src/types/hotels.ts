// Hotel registration types
export interface HotelRegistrationFormData {
  name: string
  description: string
  address: string
  city: string
  state: string
  country: string
  phone: string
  email: string
  website?: string
  checkInTime: string
  checkOutTime: string
  amenities: string[]
  images: string[] // URLs of uploaded images
}

export interface HotelProfile {
  id: string
  email: string
  full_name: string
  phone: string
  created_at: string
  updated_at: string
}

export interface Hotel extends HotelRegistrationFormData {
  id: string
  owner_id: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

// API response types
export interface ApiResponse<T = any> {
  message?: string
  error?: string
  data?: T
}

export interface HotelRegistrationResponse extends ApiResponse {
  hotel?: Hotel
}

export interface ImageUploadResponse extends ApiResponse {
  url?: string
}