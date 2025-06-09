import Link from 'next/link'
import { SidebarRoutes } from './SidebarRoutes'

function SideBar() {
  return (
    <div className='h-full border-r flex flex-col overflow-y-auto bg-white'>
      <Link href='/'>
        <div>
          <div className='p-6 text-2xl underline'>Medi Desk</div>
        </div>
      </Link>
      <div className='flex flex-col w-full'>
        <SidebarRoutes />
      </div>
    </div>
  )
}

export { SideBar }
