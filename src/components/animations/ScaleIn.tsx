import React from 'react'
import { motion } from 'framer-motion'

interface ScaleInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  scale?: number
  className?: string
}

const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  duration = 0.3,
  scale = 0.95,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ scale, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default ScaleIn

