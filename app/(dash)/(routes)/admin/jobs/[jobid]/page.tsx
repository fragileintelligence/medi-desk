import { db } from '@/db/prisma'
import { auth } from '@clerk/nextjs/server'
import { ArrowLeft, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { JobPublishAction } from './_components/JobPublishAction'
import { Banner } from '@/components/Banner'
import { IconBadge } from '@/components/IconBadge'
import { TitleForm } from './_components/TitleForm'
import { CategoryForm } from './_components/CategoryForm'
import { ResumeForm } from './_components/ResumeForm'
import { DescriptionForm } from './_components/Description'

export default async function JobDetailsPage({
  params
}: {
  params: Promise<{ jobid: string }>
}) {
  const { jobid } = await params
  const validObjectId = /^[a-fA-F0-9]{24}$/.test(jobid)
  if (!validObjectId) {
    return redirect('/admin/jobs?error=invalid_job_id')
  }

  const { userId } = await auth()
  if (!userId) {
    return redirect('/sign-in?redirect_url=/admin/jobs')
  }

  const job = await db.job.findUnique({
    where: { id: jobid, userId }
  })
  if (!job) {
    return redirect('/admin/jobs?error=job_not_found')
  }

  const categories = await db.category.findMany({
    orderBy: { name: 'asc' }
  })
  if (!categories.length) {
    return redirect('/admin/categories/create?redirect_url=/admin/jobs')
  }

  return (
    <div className='p-6'>
      <Link href='/admin/jobs'>
        <div className='flex items-center gap-2'>
          <ArrowLeft className='w-4 h-4' />
          Back
        </div>
      </Link>

      {/* title */}
      <div className='flex items-center justify-between my-4'>
        <div className='flex flex-col gap-y-2'>
          <h1 className='text-2xl font-medium'>{job.title}</h1>
        </div>

        {/* action button */}
        <JobPublishAction
          jobId={job.id}
          isPublished={job.isPublished}
          disabled={false}
        />
      </div>
      {/* warning before publishing the job */}
      {!job.isPublished && (
        <Banner variant='warning' label='This job is not published yet.' />
      )}
      {/* container layout */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
        <div>
          {/* title */}
          <div className='flex items-center gap-x-2'>
            <IconBadge icon={LayoutDashboard} />
            <h2 className='text-xl text-neutral-700'>Customize your job</h2>
          </div>

          <TitleForm initialData={job} jobId={job.id} />
          <CategoryForm
            initialData={job}
            jobId={job.id}
            options={categories.map(category => ({
              label: category.name,
              value: category.id
            }))}
          />
          <ResumeForm initialData={job} jobId={job.id} />
          <DescriptionForm initialData={job} jobId={job.id} />
        </div>
      </div>
    </div>
  )
}
