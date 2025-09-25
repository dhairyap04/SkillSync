import React from 'react'
import { useResponsive } from '@/hooks/useResponsive'
import { cn } from '@/lib/utils'

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  cols?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
  gap?: string
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = '',
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'gap-6'
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive()

  const getGridCols = () => {
    if (isMobile) return `grid-cols-${cols.mobile || 1}`
    if (isTablet) return `grid-cols-${cols.tablet || 2}`
    if (isDesktop) return `grid-cols-${cols.desktop || 3}`
    return `grid-cols-${cols.desktop || 3}`
  }

  return (
    <div className={cn('grid', getGridCols(), gap, className)}>
      {children}
    </div>
  )
}

export default ResponsiveGrid

