import { db } from '@/db/prisma'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ jobid: string }> }
) {
  try {
    const { userId } = await auth()
    const { jobid } = await params

    const updatedValues = await req.json()

    if (!userId) {
      return new NextResponse('UnAuthorized', { status: 401 })
    }
    if (!jobid) {
      return new NextResponse('Job ID is missing ', { status: 400 })
    }

    const job = await db.job.update({
      where: { id: jobid },
      data: { ...updatedValues }
    })

    return NextResponse.json(job)
  } catch (error) {
    console.log(`[JOB_PATCH] : ${error}`)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
