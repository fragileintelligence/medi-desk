import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { AlertTriangle, CheckCircle } from 'lucide-react'

const bannerVariants = cva(
  'border text-center p-4 text-sm flex items-center w-full rounded-md shadow-md',
  {
    variants: {
      variant: {
        warning: 'bg-yellow-200/80 border-yellow-300 text-primary',
        success: 'bg-emerald-700 border-emerald-300 text-secondary'
      }
    },
    defaultVariants: {
      variant: 'warning'
    }
  }
)

const iconMap = {
  warning: <AlertTriangle className='w-4 h-4 mr-2' />,
  success: <CheckCircle className='w-4 h-4 mr-2' />
}

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string
}

export function Banner({ label, variant }: BannerProps) {
  const Icon = iconMap[variant || 'warning']
  return (
    <div className={cn(bannerVariants({ variant }))}>
      {Icon}
      {label}
    </div>
  )
}
