import { useEffect, useState } from 'react'

export function useFakeLoading(duration = 500) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  return loading
}
