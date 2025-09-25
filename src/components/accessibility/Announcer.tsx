import React, { useEffect, useState } from 'react'

interface AnnouncerProps {
  message: string
  priority?: 'polite' | 'assertive'
}

const Announcer: React.FC<AnnouncerProps> = ({ message, priority = 'polite' }) => {
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (message) {
      setAnnouncement(message)
      // Clear the announcement after a short delay
      const timer = setTimeout(() => {
        setAnnouncement('')
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [message])

  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  )
}

export default Announcer

