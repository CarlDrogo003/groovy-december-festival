import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Get the user's session
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session }} = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Supabase Storage
    const fileName = `${Date.now()}_${image.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = `hotels/${session.user.id}/${fileName}`

    const { data, error } = await supabase.storage
      .from('hotels')
      .upload(filePath, buffer, {
        contentType: image.type,
        upsert: false
      })

    if (error) {
      console.error('Image upload error:', error)
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      )
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('hotels')
      .getPublicUrl(filePath)

    return NextResponse.json({
      message: 'Image uploaded successfully',
      url: publicUrl
    })

  } catch (err: any) {
    console.error('Image upload error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to upload image' },
      { status: 500 }
    )
  }
}