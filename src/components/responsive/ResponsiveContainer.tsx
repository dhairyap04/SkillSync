import React from 'react'
import { useResponsive } from '@/hooks/useResponsive'
import { cn } from '@/lib/utils'

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  mobileClassName?: string
  tabletClassName?: string
  desktopClassName?: string
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl'
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  mobileClassName = '',
  tabletClassName = '',
  desktopClassName = '',
  breakpoint = 'lg'
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive()

  const getResponsiveClassName = () => {
    if (isMobile) return mobileClassName
    if (isTablet) return tabletClassName
    if (isDesktop) return desktopClassName
    return ''
  }

  return (
    <div className={cn(className, getResponsiveClassName())}>
      {children}
    </div>
  )
}

export default ResponsiveContainer

