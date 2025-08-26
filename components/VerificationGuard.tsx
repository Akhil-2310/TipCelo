"use client"

import { useRouter } from 'next/navigation'
import { useVerification } from '@/lib/useVerification'

interface VerificationGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function VerificationGuard({ 
  children, 
  redirectTo = '/verify' 
}: VerificationGuardProps) {
  const { isVerified, isLoading } = useVerification()
  const router = useRouter()

  // Show loading while checking verification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fff6c9" }}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-black">Checking verification...</p>
        </div>
      </div>
    )
  }

  // If not verified, redirect to verify page
  if (!isVerified) {
    router.push(redirectTo)
    return null
  }

  // Only render children if verified
  return <>{children}</>
}
