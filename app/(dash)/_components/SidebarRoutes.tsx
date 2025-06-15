'use client'

import { cn } from '@/lib/utils'
import { Bookmark, Compass, Home, List, LucideIcon, User } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

const adminRoutes: SidebarRouteItemProps[] = [
  {
    icon: List,
    label: 'Jobs',
    href: '/admin/jobs'
  },
  {
    icon: List,
    label: 'Companies',
    href: '/admin/companies'
  },
  {
    icon: Compass,
    label: 'Analytics',
    href: '/admin/analytics'
  }
]

const guestRoutes: SidebarRouteItemProps[] = [
  {
    icon: Home,
    label: 'Home',
    href: '/'
  },
  {
    icon: Compass,
    label: 'Search',
    href: '/search-profile'
  },
  {
    icon: User,
    label: 'Profile',
    href: '/user'
  },
  {
    icon: Bookmark,
    label: 'Saved Jobs',
    href: '/saved-jobs'
  }
]

function SidebarRoutes() {
  const pathName = usePathname()
  const router = useRouter()

  const isAdminPage = pathName.startsWith('/admin')
  const routes = isAdminPage ? adminRoutes : guestRoutes

  return (
    <div className='flex flex-col w-full'>
      {routes.map(route => {
        return (
          <SidebarRouteItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
          />
        )
      })}
    </div>
  )
}

interface SidebarRouteItemProps {
  icon: LucideIcon
  label: string
  href: string
}
function SidebarRouteItem(props: SidebarRouteItemProps) {
  const { icon: Icon, label, href } = props

  const pathName = usePathname()
  const router = useRouter()

  // urls for which sidebar is to be shown
  const isActive =
    (pathName === '/' && href === '/') ||
    pathName === href ||
    pathName.startsWith(`${href}/`)

  const onClick = () => {
    router.push(href)
  }
  return (
    <button
      onClick={onClick}
      // variant='link'
      className={cn(
        'flex items-center gap-x-2 text-neutral-500 text-sm font-[500] pl-6 transition-all hover:text-neutral-600 hover:bg-neutral-300/20',
        isActive &&
          'text-blue-700 bg-blue-700/20 hover:bg-blue-700/20 hover:text-blue-700'
      )}
    >
      <div className='flex items-center gap-x-2 py-4'>
        <Icon size={32} />
        {label}
      </div>

      <div
        className={cn(
          'ml-auto opacity-0 border-2 border-blue-700 h-full transition-all',
          isActive && 'opacity-100'
        )}
      ></div>
    </button>
  )
}

export { SidebarRoutes }
