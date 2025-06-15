'use client'

import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, UserCog } from 'lucide-react'

function NavbarRoutes() {
  const pathName = usePathname()
  const isAdminPage = pathName.startsWith('/admin')
  const isClientPage = pathName.startsWith('/jobs')

  return (
    <div className='flex gap-x-2 ml-auto'>
      {isAdminPage || isClientPage ? (
        <Link href='/'>
          <Button
            variant={'outline'}
            size={'sm'}
            className='border-blue-700/20'
          >
            <LogOut />
            Exit
          </Button>
        </Link>
      ) : (
        <Link href='/admin/jobs'>
          <Button
            variant={'outline'}
            size={'sm'}
            className='border-blue-700/20'
          >
            <UserCog />
            Admin
          </Button>
        </Link>
      )}
      <UserButton />
    </div>
  )
}

export { NavbarRoutes }
