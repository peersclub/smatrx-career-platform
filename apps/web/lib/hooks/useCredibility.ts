import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { VerificationBadge } from '@/components/credibility/VerificationBadges'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ScoreComponent {
  score: number
  weight: number
  factors?: Record<string, number>
}

export interface CredibilityBreakdown {
  education: ScoreComponent
  experience: ScoreComponent
  technical: ScoreComponent
  social: ScoreComponent
  certifications: ScoreComponent
}

export interface MissingDataItem {
  category: string
  items: string[]
  priority: 'critical' | 'important' | 'optional'
}

export interface InsightItem {
  id: string
  type: 'strength' | 'improvement' | 'opportunity' | 'warning'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  actionable: boolean
  actionText?: string
  category: string
}

export interface NextStep {
  id: string
  title: string
  description: string
  estimatedImpact: number
  timeEstimate: string
  priority: 'high' | 'medium' | 'low'
  completed?: boolean
}

export interface CredibilityData {
  overallScore: number
  verificationLevel: 'basic' | 'verified' | 'premium' | 'elite'
  previousScore?: number
  lastUpdated: Date
  breakdown: CredibilityBreakdown
  badges: VerificationBadge[]
  completeness: number
  missingData: MissingDataItem[]
  insights: InsightItem[]
  nextSteps: NextStep[]
  lastAnalyzed?: Date
}

export interface RefreshCredibilityResponse {
  success: boolean
  data: CredibilityData
  message?: string
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

const API_BASE = '/api/credibility'

/**
 * Fetch the user's credibility data
 */
async function fetchCredibilityData(): Promise<CredibilityData> {
  const response = await fetch(`${API_BASE}`)

  if (!response.ok) {
    throw new Error('Failed to fetch credibility data')
  }

  const data = await response.json()

  // Convert date strings to Date objects
  return {
    ...data,
    lastUpdated: new Date(data.lastUpdated),
    lastAnalyzed: data.lastAnalyzed ? new Date(data.lastAnalyzed) : undefined
  }
}

/**
 * Trigger a refresh/recalculation of credibility score
 */
async function refreshCredibilityScore(): Promise<RefreshCredibilityResponse> {
  const response = await fetch(`${API_BASE}/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to refresh credibility score')
  }

  const result = await response.json()

  return {
    ...result,
    data: {
      ...result.data,
      lastUpdated: new Date(result.data.lastUpdated),
      lastAnalyzed: result.data.lastAnalyzed
        ? new Date(result.data.lastAnalyzed)
        : undefined
    }
  }
}

/**
 * Mark a next step as completed
 */
async function completeNextStep(stepId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/next-steps/${stepId}/complete`, {
    method: 'POST'
  })

  if (!response.ok) {
    throw new Error('Failed to complete next step')
  }
}

/**
 * Dismiss an insight
 */
async function dismissInsight(insightId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/insights/${insightId}/dismiss`, {
    method: 'POST'
  })

  if (!response.ok) {
    throw new Error('Failed to dismiss insight')
  }
}

/**
 * Export credibility report as PDF
 */
async function exportCredibilityReport(): Promise<Blob> {
  const response = await fetch(`${API_BASE}/export`, {
    method: 'GET'
  })

  if (!response.ok) {
    throw new Error('Failed to export credibility report')
  }

  return await response.blob()
}

// ============================================================================
// REACT QUERY HOOKS
// ============================================================================

/**
 * Hook to fetch credibility data with automatic caching and refetching
 *
 * @example
 * ```tsx
 * function CredibilityDashboard() {
 *   const { data, isLoading, error, refetch } = useCredibility()
 *
 *   if (isLoading) return <Skeleton />
 *   if (error) return <ErrorState error={error} />
 *
 *   return <CredibilityScoreCard {...data} />
 * }
 * ```
 */
export function useCredibility() {
  return useQuery({
    queryKey: ['credibility'],
    queryFn: fetchCredibilityData,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  })
}

/**
 * Hook to manually trigger a credibility score refresh
 *
 * @example
 * ```tsx
 * function RefreshButton() {
 *   const { mutate, isPending } = useRefreshCredibility()
 *
 *   return (
 *     <Button onClick={() => mutate()} disabled={isPending}>
 *       {isPending ? 'Refreshing...' : 'Refresh Score'}
 *     </Button>
 *   )
 * }
 * ```
 */
export function useRefreshCredibility() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: refreshCredibilityScore,
    onSuccess: (data) => {
      // Update the credibility data in cache
      queryClient.setQueryData(['credibility'], data.data)
    },
    onError: (error) => {
      console.error('Failed to refresh credibility:', error)
    }
  })
}

/**
 * Hook to mark a next step as completed
 *
 * @example
 * ```tsx
 * function NextStepItem({ step }) {
 *   const { mutate } = useCompleteNextStep()
 *
 *   return (
 *     <Checkbox
 *       checked={step.completed}
 *       onCheckedChange={() => mutate(step.id)}
 *     />
 *   )
 * }
 * ```
 */
export function useCompleteNextStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: completeNextStep,
    onSuccess: (_, stepId) => {
      // Optimistically update the UI
      queryClient.setQueryData(['credibility'], (old: CredibilityData | undefined) => {
        if (!old) return old

        return {
          ...old,
          nextSteps: old.nextSteps.map((step) =>
            step.id === stepId ? { ...step, completed: true } : step
          )
        }
      })

      // Refetch to get updated score
      queryClient.invalidateQueries({ queryKey: ['credibility'] })
    }
  })
}

/**
 * Hook to dismiss an insight
 *
 * @example
 * ```tsx
 * function InsightCard({ insight }) {
 *   const { mutate } = useDismissInsight()
 *
 *   return (
 *     <Card>
 *       {insight.title}
 *       <Button onClick={() => mutate(insight.id)}>Dismiss</Button>
 *     </Card>
 *   )
 * }
 * ```
 */
export function useDismissInsight() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: dismissInsight,
    onSuccess: (_, insightId) => {
      // Remove insight from UI
      queryClient.setQueryData(['credibility'], (old: CredibilityData | undefined) => {
        if (!old) return old

        return {
          ...old,
          insights: old.insights.filter((insight) => insight.id !== insightId)
        }
      })
    }
  })
}

/**
 * Hook to export credibility report as PDF
 *
 * @example
 * ```tsx
 * function ExportButton() {
 *   const { mutate, isPending } = useExportCredibility()
 *
 *   const handleExport = () => {
 *     mutate(undefined, {
 *       onSuccess: (blob) => {
 *         const url = URL.createObjectURL(blob)
 *         const a = document.createElement('a')
 *         a.href = url
 *         a.download = 'credibility-report.pdf'
 *         a.click()
 *       }
 *     })
 *   }
 *
 *   return (
 *     <Button onClick={handleExport} disabled={isPending}>
 *       {isPending ? 'Exporting...' : 'Export PDF'}
 *     </Button>
 *   )
 * }
 * ```
 */
export function useExportCredibility() {
  return useMutation({
    mutationFn: exportCredibilityReport,
    onError: (error) => {
      console.error('Failed to export credibility report:', error)
    }
  })
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook to get specific parts of credibility data without subscribing to entire dataset
 */
export function useCredibilityScore() {
  const { data, ...rest } = useCredibility()
  return {
    ...rest,
    score: data?.overallScore,
    previousScore: data?.previousScore,
    verificationLevel: data?.verificationLevel
  }
}

export function useCredibilityBreakdown() {
  const { data, ...rest } = useCredibility()
  return {
    ...rest,
    breakdown: data?.breakdown
  }
}

export function useVerificationBadges() {
  const { data, ...rest } = useCredibility()
  return {
    ...rest,
    badges: data?.badges
  }
}

export function useCredibilityInsights() {
  const { data, ...rest } = useCredibility()
  return {
    ...rest,
    insights: data?.insights,
    nextSteps: data?.nextSteps
  }
}
