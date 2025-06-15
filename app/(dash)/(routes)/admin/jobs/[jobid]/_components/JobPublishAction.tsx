'use client'
import { Button } from '@/components/ui/button'
import { Trash2Icon } from 'lucide-react'
import { useState } from 'react'

interface JobPublishActionProps {
  disabled?: boolean
  jobId: string
  isPublished: boolean
}
export function JobPublishAction({
  disabled,
  jobId,
  isPublished
}: JobPublishActionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const onClick = () => {}
  const onDelete = () => {}

  return (
    <div className='flex items-center gap-x-3'>
      <Button variant='outline' disabled={disabled || isLoading} size='sm'>
        {isPublished ? 'Unpublish Job' : 'Publish Job'}
      </Button>

      <Button
        variant='destructive'
        size='icon'
        disabled={isLoading}
        onClick={onClick}
      >
        <Trash2Icon />
      </Button>
    </div>
  )
}
