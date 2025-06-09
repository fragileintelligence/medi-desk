import { db } from '@/db/prisma'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    const { title } = await req.json()

    if (!userId) {
      return new NextResponse('UnAuthorized', { status: 401 })
    }
    if (!title) {
      return new NextResponse('Title is missing ', { status: 400 })
    }

    const job = await db.job.create({
      data: {
        userId,
        title
      }
    })

    return NextResponse.json(job)
  } catch (error) {
    console.log(`[JOB_POST] : ${error}`)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
