import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { SideBar } from './Sidebar'

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
        <Menu />
      </SheetTrigger>
      <SheetContent className='bg-white p-0' side='left'>
        {/* left empty because the dialog requires a title*/}
        <SheetTitle className='h-0 w-0'></SheetTitle>
        <SideBar />
      </SheetContent>
    </Sheet>
  )
}
