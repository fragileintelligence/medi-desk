'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface TitleFormProps {
  initialData: {
    title: string
  }
  jobId: string
}

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'please enter a appropriate title' })
    .max(100)
})

export function TitleForm({ initialData, jobId }: TitleFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title
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
      toast.error('Error updating job title')
      return
    }
  }

  const toggleEdit = () => {
    setIsEditing(prev => !prev)
  }

  return (
    <div className='mt-6 border bg-neutral-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Job Title
        <Button onClick={toggleEdit} variant='ghost'>
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>
      {/* display the title if not editing*/}

      {!isEditing && <p className='text-sm mt-2'>{initialData.title}</p>}

      {/* on editing mode display the input */}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='Oncologist'
                      {...field}
                    />
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
