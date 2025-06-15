import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

const backgroundVariants = cva(
  'rounded-full flex items-center justify-center',
  {
    variants: {
      variant: {
        default: 'bg-blue-100',
        success: 'bg-emerald-100'
      },
      size: {
        default: 'p-2',
        sm: 'p-1'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

const iconVariants = cva('', {
  variants: {
    size: {
      default: 'h-8 w-8',
      sm: 'h-4 w-4'
    },
    variant: {
      default: 'text-blue-700',
      success: 'text-emerald-700'
    }
  },
  defaultVariants: {
    size: 'default',
    variant: 'default'
  }
})

type BackgroundVariantProps = VariantProps<typeof backgroundVariants>
type IconVariantProps = VariantProps<typeof iconVariants>

interface IconBadgeProps extends BackgroundVariantProps, IconVariantProps {
  icon: LucideIcon
}

export function IconBadge({ icon: Icon, variant, size }: IconBadgeProps) {
  return (
    <div
      className={cn(backgroundVariants({ variant, size }))}
      data-testid='icon-badge'
    >
      <Icon className={cn(iconVariants({ variant, size }))} />
    </div>
  )
}
