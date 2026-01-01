"use client"

// Simplified subscription hook - everything is free and accessible
// No authentication or subscription tiers needed

interface UseSubscriptionReturn {
  tier: 'free'
  isLoading: boolean
  isPro: boolean
  isEnterprise: boolean
  canAccess: (feature: string, type: 'algorithm' | 'dataStructure') => boolean
}

export function useSubscription(): UseSubscriptionReturn {
  // Everything is free - always return full access
  const canAccess = (): boolean => true

  return {
    tier: 'free',
    isLoading: false,
    isPro: true, // Grant pro-level access to everyone
    isEnterprise: true, // Grant enterprise-level access to everyone
    canAccess,
  }
}
