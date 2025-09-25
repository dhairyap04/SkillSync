import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface CounterProps {
  value: number
  duration?: number
  delay?: number
  className?: string
  suffix?: string
  prefix?: string
}

const Counter: React.FC<CounterProps> = ({
  value,
  duration = 2,
  delay = 0,
  className = '',
  suffix = '',
  prefix = ''
}) => {
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: duration * 1000 })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      motionValue.set(value)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [motionValue, value, delay])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest))
    })

    return unsubscribe
  }, [springValue])

  return (
    <motion.span className={className}>
      {prefix}{displayValue}{suffix}
    </motion.span>
  )
}

export default Counter

