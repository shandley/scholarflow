import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import crypto from 'crypto'

// Configure max file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the user and profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    })

    if (!user?.profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'PROFILE_PHOTO'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }

    // Validate file type for profile photos
    if (type === 'PROFILE_PHOTO') {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }, { status: 400 })
      }
    }

    // Generate unique filename
    const buffer = Buffer.from(await file.arrayBuffer())
    const hash = crypto.createHash('sha256').update(buffer).digest('hex')
    const ext = file.name.split('.').pop()
    const filename = `${hash}.${ext}`
    
    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', user.profile.id)
    await mkdir(uploadDir, { recursive: true })
    
    // Save file
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)
    
    // Generate public URL
    const url = `/uploads/${user.profile.id}/${filename}`
    
    // Save file record to database
    const fileRecord = await prisma.file.create({
      data: {
        profileId: user.profile.id,
        filename: file.name,
        mimetype: file.type,
        size: file.size,
        url,
        type: type as 'PROFILE_PHOTO' | 'CV' | 'OTHER',
      }
    })

    // If this is a profile photo, update the profile
    if (type === 'PROFILE_PHOTO') {
      await prisma.profile.update({
        where: { id: user.profile.id },
        data: { profilePhoto: url }
      })
    }

    return NextResponse.json({ 
      file: fileRecord,
      url 
    }, { status: 201 })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}