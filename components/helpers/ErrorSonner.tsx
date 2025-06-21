'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { toast } from 'sonner'

// Inner component that uses useSearchParams
function ErrorToastInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get('error')

  useEffect(() => {
    console.log('ErrorToast mounted with error:', error)

    if (error === 'invalid_job_id') {
      // Small timeout to ensure the component is fully mounted
      setTimeout(() => {
        toast.error('Invalid job ID format. Please check and try again.')

        const url = new URL(window.location.href)
        url.searchParams.delete('error')
        router.replace(url.pathname + url.search)
      }, 100)
    } else if (error === 'job_not_found') {
      // Small timeout to ensure the component is fully mounted
      setTimeout(() => {
        toast.error('Job not found. Please check the job ID and try again.')

        const url = new URL(window.location.href)
        url.searchParams.delete('error')
        router.replace(url.pathname + url.search)
      }, 100)
    }
  }, [error, router])

  return null
}

// Exported component with built-in Suspense
export function ErrorToast() {
  return (
    <Suspense fallback={null}>
      <ErrorToastInner />
    </Suspense>
  )
}
