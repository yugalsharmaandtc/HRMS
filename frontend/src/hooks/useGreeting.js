import { useState, useEffect } from 'react'
import { format } from 'date-fns'

export function useGreeting() {
  const [greeting, setGreeting] = useState('')
  const [dateTime, setDateTime] = useState('')

  const update = () => {
    const now = new Date()
    const hour = now.getHours()

    if (hour < 12)      setGreeting('Good Morning')
    else if (hour < 17) setGreeting('Good Afternoon')
    else                setGreeting('Good Evening')

    setDateTime(format(now, "EEEE, MMMM d, yyyy · hh:mm:ss aa"))
  }

  useEffect(() => {
    update()
    // Update every second so the clock ticks live
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  return { greeting, dateTime }
}