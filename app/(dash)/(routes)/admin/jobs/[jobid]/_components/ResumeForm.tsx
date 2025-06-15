'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Job } from '@/lib/generated/prisma'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { CheckCircle2, CloudUpload, FileIcon, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemDelete
} from '@/components/ui/file-upload'

interface ResumeFormProps {
  initialData: Job
  jobId: string
}

const formSchema = z.object({
  resumeUrl: z.string().url().optional()
})

export function ResumeForm({ initialData, jobId }: ResumeFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [tempBlobUrl, setTempBlobUrl] = useState<string | null>(null)
  const [formSaved, setFormSaved] = useState(false)
  const [savedBlobUrl, setSavedBlobUrl] = useState<string | null>(
    initialData.resumeUrl || null
  )
  const isFormSavedRef = useRef(false) // Use ref for immediate tracking
  const router = useRouter()

  // Refs for unmount cleanup logic
  const tempBlobUrlRefForUnmount = useRef<string | null>(tempBlobUrl)
  const savedBlobUrlRefForUnmount = useRef<string | null>(savedBlobUrl)

  useEffect(() => {
    tempBlobUrlRefForUnmount.current = tempBlobUrl
  }, [tempBlobUrl])

  useEffect(() => {
    savedBlobUrlRefForUnmount.current = savedBlobUrl
  }, [savedBlobUrl])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeUrl: initialData.resumeUrl || ''
    }
  })

  const { isSubmitting } = form.formState
  const resumeUrl = form.watch('resumeUrl')

  // Clean up temporary blob on component unmount if not saved
  useEffect(() => {
    return () => {
      if (
        tempBlobUrlRefForUnmount.current &&
        tempBlobUrlRefForUnmount.current !==
          savedBlobUrlRefForUnmount.current &&
        !isFormSavedRef.current
      ) {
        deleteBlob(
          tempBlobUrlRefForUnmount.current,
          'Component unmounted'
        ).catch(console.error)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array ensures this runs only on unmount

  // Helper function to delete blob
  const deleteBlob = async (url: string, reason: string) => {
    try {
      const encodedUrl = encodeURIComponent(url)
      await axios.delete(`/api/upload?url=${encodedUrl}&reason=${reason}`)
    } catch (error) {
      console.error('Failed to delete temporary upload:', error)
    }
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Set the ref immediately to prevent cleanup deletion
      isFormSavedRef.current = true

      // Delete the old resume if it exists and is different from the new one
      if (initialData.resumeUrl && initialData.resumeUrl !== data.resumeUrl) {
        await deleteBlob(initialData.resumeUrl, 'Replacing with new resume')
      }

      await axios.patch(`/api/jobs/${jobId}`, data)

      // Store the successfully saved URL to prevent deletion
      if (data.resumeUrl) {
        setSavedBlobUrl(data.resumeUrl)
      }

      setFormSaved(true)
      toast.success('Resume updated successfully!')

      // Set editing to false without triggering deletion logic
      setIsEditing(false)
      setUploadedFile(null)
      setUploadSuccess(false)

      router.refresh()
    } catch (error) {
      // Reset the ref if save failed
      isFormSavedRef.current = false
      toast.error('Error updating resume')
    }
  }

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return

    // If there's a previous temporary upload (that's not saved), delete it first
    if (tempBlobUrl && tempBlobUrl !== savedBlobUrl) {
      await deleteBlob(tempBlobUrl, 'New file upload')
    }

    setTempBlobUrl(null)
    setFormSaved(false) // Reset saved state for new upload

    setIsUploading(true)
    setUploadSuccess(false)
    setUploadedFile(files[0])

    try {
      const formData = new FormData()
      formData.append('file', files[0])

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      const { url } = response.data
      form.setValue('resumeUrl', url, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      })
      setTempBlobUrl(url) // Store the URL to track for cleanup
      setUploadSuccess(true)
      toast.success('File uploaded successfully')
    } catch (error) {
      toast.error('Error uploading file')
      console.error(error)
      setUploadedFile(null)
    } finally {
      setIsUploading(false)
    }
  }

  const toggleEdit = () => {
    // Only delete if we're canceling an edit AND the file is not already saved
    // AND we're currently editing (not when programmatically setting to false)
    if (
      isEditing &&
      tempBlobUrl &&
      tempBlobUrl !== savedBlobUrl &&
      !formSaved
    ) {
      deleteBlob(tempBlobUrl, 'Edit canceled')
      setTempBlobUrl(null)
    }

    setIsEditing(prev => !prev)
    setUploadedFile(null)
    setUploadSuccess(false)

    // When starting a new edit session, reset form saved status
    if (!isEditing) {
      setFormSaved(false)
      isFormSavedRef.current = false // Reset ref as well
    }

    // Reset to initial data when canceling
    if (isEditing) {
      form.reset({ resumeUrl: initialData.resumeUrl || '' })
    }
  }

  // Handle file deletion through the UI
  const handleDeleteFile = async () => {
    if (tempBlobUrl) {
      await deleteBlob(tempBlobUrl, 'File deleted by user')
      setTempBlobUrl(null)
      form.setValue('resumeUrl', '')
      setUploadedFile(null)
      setUploadSuccess(false)
    }
  }

  return (
    <div className='mt-6 border bg-neutral-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Upload your Resume
        <Button onClick={toggleEdit} variant='ghost'>
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      {/* Display the resume if not editing */}
      {!isEditing && (
        <div className='mt-2'>
          {initialData.resumeUrl ? (
            <div className='flex items-center gap-2'>
              <FileIcon className='h-5 w-5' />
              <a
                href={initialData.resumeUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:underline'
              >
                View Resume
              </a>
            </div>
          ) : (
            <p className='text-sm text-muted-foreground'>No resume uploaded</p>
          )}
        </div>
      )}

      {/* File upload component when editing */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            <FormField
              control={form.control}
              name='resumeUrl'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {!uploadSuccess && (
                      <FileUpload
                        value={uploadedFile ? [uploadedFile] : []}
                        onValueChange={files => handleFileUpload(files)}
                        accept='.pdf,.doc,.docx'
                        maxFiles={1}
                        maxSize={5 * 1024 * 1024} // 5MB limit
                        onFileReject={(_, message) => {
                          toast.error(message)
                        }}
                      >
                        <FileUploadDropzone className='flex-col text-center py-8'>
                          <CloudUpload className='size-10 mb-2 mx-auto text-muted-foreground' />
                          <p className='mb-2 text-sm font-medium'>
                            Drag and drop your resume here
                          </p>
                          <p className='text-xs text-muted-foreground mb-4'>
                            PDF, DOC or DOCX (max 5MB)
                          </p>
                          <FileUploadTrigger asChild>
                            <Button variant='secondary' size='sm'>
                              Browse Files
                            </Button>
                          </FileUploadTrigger>
                        </FileUploadDropzone>
                        {uploadedFile && (
                          <FileUploadList className='mt-2'>
                            <FileUploadItem value={uploadedFile}>
                              <FileUploadItemPreview />
                              <FileUploadItemMetadata />
                              <FileUploadItemDelete
                                asChild
                                onClick={handleDeleteFile}
                              >
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='size-7'
                                >
                                  <X className='size-4' />
                                  <span className='sr-only'>Delete</span>
                                </Button>
                              </FileUploadItemDelete>
                            </FileUploadItem>
                          </FileUploadList>
                        )}
                      </FileUpload>
                    )}
                  </FormControl>
                  <FormMessage />

                  {/* Success indicator instead of URL display */}
                  {uploadSuccess && (
                    <div className='flex items-center gap-2 text-sm text-green-600 mt-2'>
                      <CheckCircle2 className='h-4 w-4' />
                      <span>Resume uploaded successfully</span>
                    </div>
                  )}
                </FormItem>
              )}
            />

            <div className='flex items-center gap-x-2 mt-4'>
              <Button
                type='submit'
                disabled={isSubmitting || isUploading || !resumeUrl}
              >
                {isSubmitting || isUploading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
