'use client'

import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combo-box'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Job } from '@/lib/generated/prisma'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface CategoryFormProps {
  initialData: Job
  jobId: string
}

const formSchema = z.object({
  description: z.string().min(5).max(500)
})

export function DescriptionForm({ initialData, jobId }: CategoryFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || ''
    }
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/jobs/${jobId}`, data)
      toast.success('Job updated successfully!')
      toggleEdit()
      router.refresh()
    } catch (error) {
      toast.error('Error updating job description')
      return
    }
  }

  const toggleEdit = () => {
    setIsEditing(prev => !prev)
  }

  return (
    <div className='mt-6 border bg-neutral-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Job Description
        <Button onClick={toggleEdit} variant='ghost'>
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>
      {/* display the title if not editing*/}

      {!isEditing && (
        <p className='text-neutral-500'>{initialData.description}</p>
      )}

      {/* on editing mode display the input */}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Button type='submit' disabled={!isValid || isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
