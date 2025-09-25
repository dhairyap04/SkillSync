import React from 'react'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  progress: number
  duration?: number
  delay?: number
  className?: string
  color?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  duration = 1,
  delay = 0,
  className = '',
  color = 'bg-primary-600'
}) => {
  return (
    <div className={`w-full bg-neutral-200 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className={`h-full ${color} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration, delay, ease: 'easeOut' }}
      />
    </div>
  )
}

export default ProgressBar

