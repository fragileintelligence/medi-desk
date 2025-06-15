import { NextResponse } from 'next/server'
import { del, put } from '@vercel/blob'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  const session = await auth()
  const { userId } = session

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PDF, DOC or DOCX files' },
        { status: 400 }
      )
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      )
    }

    const filename = `resumes/${userId}/${Date.now()}-${file.name}`

    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type
    })

    return NextResponse.json(blob)
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const encodedUrl = searchParams.get('url')
    const reason = searchParams.get('reason') || 'Unknown'

    if (!encodedUrl) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
    }

    const urlToDelete = decodeURIComponent(encodedUrl)
    console.log(`Deleting file: ${urlToDelete} - Reason: ${reason}`)

    await del(urlToDelete)

    return NextResponse.json({
      success: true,
      message: `File deleted successfully. Reason: ${reason}`
    })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json({ error: 'Error deleting file' }, { status: 500 })
  }
}
