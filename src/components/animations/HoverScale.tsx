import React from 'react'
import { motion } from 'framer-motion'

interface HoverScaleProps {
  children: React.ReactNode
  scale?: number
  className?: string
  whileHover?: any
  whileTap?: any
}

const HoverScale: React.FC<HoverScaleProps> = ({
  children,
  scale = 1.05,
  className = '',
  whileHover,
  whileTap
}) => {
  return (
    <motion.div
      whileHover={whileHover || { scale }}
      whileTap={whileTap || { scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default HoverScale

