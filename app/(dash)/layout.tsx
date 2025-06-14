import { Navbar } from './_components/Navbar'
import { SideBar } from './_components/Sidebar'

export default function DashLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='h-full'>
      <header className='h-20 md:pl-56 fixed inset-y-0 w-full z-50'>
        <Navbar />
      </header>
      <div className='hidden md:flex w-56 flex-col fixed inset-y-0 z-50'>
        <SideBar />
      </div>
      <main className='md:pl-56 pt-20 h-full'>{children}</main>
    </div>
  )
}
