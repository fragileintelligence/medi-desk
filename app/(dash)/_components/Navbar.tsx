import { MobileSidebar } from './MobileSidebar'
import { NavbarRoutes } from './NavbarRoutes'

function Navbar() {
  return (
    <div className='shadow-sm p-4 border-b h-full flex items-center bg-white'>
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  )
}
export { Navbar }
