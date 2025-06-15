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
  options: { label: string; value: string }[]
}

const formSchema = z.object({
  categoryId: z.string().min(5).max(100)
})

export function CategoryForm({
  initialData,
  jobId,
  options
}: CategoryFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData.categoryId || ''
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

  const selectedOption = options.find(
    option => option.value === initialData.categoryId
  )

  return (
    <div className='mt-6 border bg-neutral-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Job Category
        <Button onClick={toggleEdit} variant='ghost'>
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>
      {/* display the title if not editing*/}

      {!isEditing && (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData.categoryId && 'text-neutral-500 italic'
          )}
        >
          {selectedOption?.label || 'No category selected'}
        </p>
      )}

      {/* on editing mode display the input */}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      heading='Select a category'
                      options={options}
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
