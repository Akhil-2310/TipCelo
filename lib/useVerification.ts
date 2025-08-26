import { useState, useEffect } from 'react'

export function useVerification() {
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkVerification = () => {
      const verifiedUserData = localStorage.getItem('verifiedUserData')
      
      if (verifiedUserData) {
        try {
          const userData = JSON.parse(verifiedUserData)
          if (userData.isVerified && userData.verificationDate) {
            // Check if verification is not expired (24 hours)
            const verificationDate = new Date(userData.verificationDate)
            const now = new Date()
            const hoursDiff = (now.getTime() - verificationDate.getTime()) / (1000 * 60 * 60)
            
            if (hoursDiff < 24) {
              setIsVerified(true)
              setIsLoading(false)
              return
            }
          }
        } catch (error) {
          console.error('Error parsing verification data:', error)
        }
      }
      
      setIsVerified(false)
      setIsLoading(false)
    }

    checkVerification()

    // Listen for storage changes (when verification is completed in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'verifiedUserData') {
        checkVerification()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const clearVerification = () => {
    localStorage.removeItem('verifiedUserData')
    setIsVerified(false)
  }

  return { isVerified, isLoading, clearVerification }
}
