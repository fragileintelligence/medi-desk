'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const formSchema = z.object({
  title: z.string().min(1, { message: 'Position cannot be empty' })
})

export default function JobCreatePage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ''
    }
  })

  const { isSubmitting, isValid, isLoading } = form.formState
  const router = useRouter()
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post('/api/jobs', values)
      router.push(`/admin/jobs/${response.data.id}`)
      toast.success('Position created successfully!')
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }
  return (
    <div className='max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6'>
      <div>
        <h1 className='text-2xl'>Name Your Position</h1>
        <p className='text-sm text-neutral-500'>You can change it later</p>
        <Form {...form}>
          <form
            className='space-y-8 mt-8'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder='e.g. Oncologist'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Role of this position</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Link href='/admin/jobs'>
                <Button type='button' variant='secondary'>
                  Cancel
                </Button>
              </Link>
              <Button type='submit' disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
