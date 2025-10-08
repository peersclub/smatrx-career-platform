import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { CareerRecommendation } from '@/components/career-planner/RecommendationCard'
import type { CurrentProfile, TargetRole } from '@/components/career-planner/CurrentProfileCard'
import type { SkillGap } from '@/components/career-planner/SkillGapAnalysis'
import type { LearningPath } from '@/components/career-planner/LearningPathCard'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CareerPlannerData {
  profile: CurrentProfile
  targetRole?: TargetRole
  recommendations: CareerRecommendation[]
  skillGap: SkillGap
  learningPaths: LearningPath[]
  lastAnalyzed?: Date
}

export interface UpdateProfileRequest {
  currentRole?: string
  currentCompany?: string
  currentLevel?: 'junior' | 'mid' | 'senior' | 'lead' | 'principal'
  yearsOfExperience?: number
  location?: string
  currentSalary?: number
}

export interface SetTargetRoleRequest {
  role: string
  level: 'junior' | 'mid' | 'senior' | 'lead' | 'principal'
  targetSalary?: {
    min: number
    max: number
  }
  targetCompanySize?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  targetIndustry?: string
  preferredLocation?: string
  timeframe: string
}

export interface SaveRecommendationRequest {
  recommendationId: string
  notes?: string
}

export interface EnrollInPathRequest {
  pathId: string
}

export interface UpdateResourceProgressRequest {
  resourceId: string
  progress: number
  completed?: boolean
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

const API_BASE = '/api/career-planner'

/**
 * Fetch career planner data including profile, recommendations, and learning paths
 */
async function fetchCareerPlannerData(): Promise<CareerPlannerData> {
  const response = await fetch(`${API_BASE}`)

  if (!response.ok) {
    throw new Error('Failed to fetch career planner data')
  }

  const data = await response.json()

  return {
    ...data,
    lastAnalyzed: data.lastAnalyzed ? new Date(data.lastAnalyzed) : undefined
  }
}

/**
 * Update user's current profile
 */
async function updateProfile(updates: UpdateProfileRequest): Promise<CurrentProfile> {
  const response = await fetch(`${API_BASE}/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  })

  if (!response.ok) {
    throw new Error('Failed to update profile')
  }

  return await response.json()
}

/**
 * Set or update target career role
 */
async function setTargetRole(targetRole: SetTargetRoleRequest): Promise<TargetRole> {
  const response = await fetch(`${API_BASE}/target-role`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(targetRole)
  })

  if (!response.ok) {
    throw new Error('Failed to set target role')
  }

  return await response.json()
}

/**
 * Refresh career recommendations based on current profile
 */
async function refreshRecommendations(): Promise<CareerRecommendation[]> {
  const response = await fetch(`${API_BASE}/recommendations/refresh`, {
    method: 'POST'
  })

  if (!response.ok) {
    throw new Error('Failed to refresh recommendations')
  }

  return await response.json()
}

/**
 * Save a recommendation to user's career plan
 */
async function saveRecommendation(request: SaveRecommendationRequest): Promise<void> {
  const response = await fetch(`${API_BASE}/recommendations/${request.recommendationId}/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ notes: request.notes })
  })

  if (!response.ok) {
    throw new Error('Failed to save recommendation')
  }
}

/**
 * Enroll in a learning path
 */
async function enrollInPath(request: EnrollInPathRequest): Promise<void> {
  const response = await fetch(`${API_BASE}/learning-paths/${request.pathId}/enroll`, {
    method: 'POST'
  })

  if (!response.ok) {
    throw new Error('Failed to enroll in learning path')
  }
}

/**
 * Update progress on a learning resource
 */
async function updateResourceProgress(
  request: UpdateResourceProgressRequest
): Promise<void> {
  const response = await fetch(`${API_BASE}/resources/${request.resourceId}/progress`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      progress: request.progress,
      completed: request.completed
    })
  })

  if (!response.ok) {
    throw new Error('Failed to update resource progress')
  }
}

/**
 * Get personalized skill gap analysis
 */
async function fetchSkillGap(): Promise<SkillGap> {
  const response = await fetch(`${API_BASE}/skill-gap`)

  if (!response.ok) {
    throw new Error('Failed to fetch skill gap analysis')
  }

  return await response.json()
}

// ============================================================================
// REACT QUERY HOOKS
// ============================================================================

/**
 * Hook to fetch complete career planner data
 *
 * @example
 * ```tsx
 * function CareerPlannerDashboard() {
 *   const { data, isLoading, error } = useCareerPlanner()
 *
 *   if (isLoading) return <Skeleton />
 *   if (error) return <ErrorState error={error} />
 *
 *   return (
 *     <>
 *       <CurrentProfileCard profile={data.profile} targetRole={data.targetRole} />
 *       <RecommendationsGrid recommendations={data.recommendations} />
 *     </>
 *   )
 * }
 * ```
 */
export function useCareerPlanner() {
  return useQuery({
    queryKey: ['careerPlanner'],
    queryFn: fetchCareerPlannerData,
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false // Don't refetch on window focus (expensive computation)
  })
}

/**
 * Hook to update user's current profile
 *
 * @example
 * ```tsx
 * function EditProfileForm() {
 *   const { mutate, isPending } = useUpdateProfile()
 *
 *   const handleSubmit = (formData) => {
 *     mutate({
 *       currentRole: formData.role,
 *       currentCompany: formData.company,
 *       yearsOfExperience: formData.years
 *     })
 *   }
 *
 *   return <ProfileForm onSubmit={handleSubmit} isSubmitting={isPending} />
 * }
 * ```
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedProfile) => {
      // Update the profile in cache
      queryClient.setQueryData(['careerPlanner'], (old: CareerPlannerData | undefined) => {
        if (!old) return old
        return {
          ...old,
          profile: updatedProfile
        }
      })

      // Invalidate to trigger recommendations refresh
      queryClient.invalidateQueries({ queryKey: ['careerPlanner'] })
    },
    onError: (error) => {
      console.error('Failed to update profile:', error)
    }
  })
}

/**
 * Hook to set or update target career role
 *
 * @example
 * ```tsx
 * function SetGoalModal() {
 *   const { mutate, isPending } = useSetTargetRole()
 *
 *   const handleSetGoal = (goal) => {
 *     mutate({
 *       role: 'Principal Engineer',
 *       level: 'principal',
 *       targetSalary: { min: 200000, max: 280000 },
 *       timeframe: '18-24 months'
 *     })
 *   }
 *
 *   return <GoalForm onSubmit={handleSetGoal} isSubmitting={isPending} />
 * }
 * ```
 */
export function useSetTargetRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: setTargetRole,
    onSuccess: (targetRole) => {
      // Update target role in cache
      queryClient.setQueryData(['careerPlanner'], (old: CareerPlannerData | undefined) => {
        if (!old) return old
        return {
          ...old,
          targetRole
        }
      })

      // Refresh recommendations and skill gap based on new target
      queryClient.invalidateQueries({ queryKey: ['careerPlanner'] })
    },
    onError: (error) => {
      console.error('Failed to set target role:', error)
    }
  })
}

/**
 * Hook to refresh career recommendations
 *
 * @example
 * ```tsx
 * function RefreshButton() {
 *   const { mutate, isPending } = useRefreshRecommendations()
 *
 *   return (
 *     <Button onClick={() => mutate()} disabled={isPending}>
 *       {isPending ? 'Refreshing...' : 'Refresh Recommendations'}
 *     </Button>
 *   )
 * }
 * ```
 */
export function useRefreshRecommendations() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: refreshRecommendations,
    onSuccess: (recommendations) => {
      // Update recommendations in cache
      queryClient.setQueryData(['careerPlanner'], (old: CareerPlannerData | undefined) => {
        if (!old) return old
        return {
          ...old,
          recommendations,
          lastAnalyzed: new Date()
        }
      })
    },
    onError: (error) => {
      console.error('Failed to refresh recommendations:', error)
    }
  })
}

/**
 * Hook to save a recommendation to career plan
 *
 * @example
 * ```tsx
 * function RecommendationCard({ recommendation }) {
 *   const { mutate } = useSaveRecommendation()
 *
 *   const handleSave = () => {
 *     mutate({
 *       recommendationId: recommendation.id,
 *       notes: 'Looks promising for my growth'
 *     })
 *   }
 *
 *   return <Card {...recommendation} onSave={handleSave} />
 * }
 * ```
 */
export function useSaveRecommendation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveRecommendation,
    onSuccess: () => {
      // Optionally add to saved recommendations list
      queryClient.invalidateQueries({ queryKey: ['savedRecommendations'] })
    },
    onError: (error) => {
      console.error('Failed to save recommendation:', error)
    }
  })
}

/**
 * Hook to enroll in a learning path
 *
 * @example
 * ```tsx
 * function LearningPathCard({ path }) {
 *   const { mutate, isPending } = useEnrollInPath()
 *
 *   return (
 *     <Button
 *       onClick={() => mutate({ pathId: path.id })}
 *       disabled={isPending}
 *     >
 *       {isPending ? 'Enrolling...' : 'Start Learning Path'}
 *     </Button>
 *   )
 * }
 * ```
 */
export function useEnrollInPath() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: enrollInPath,
    onSuccess: () => {
      // Refresh to show enrollment status
      queryClient.invalidateQueries({ queryKey: ['careerPlanner'] })
      queryClient.invalidateQueries({ queryKey: ['enrolledPaths'] })
    },
    onError: (error) => {
      console.error('Failed to enroll in learning path:', error)
    }
  })
}

/**
 * Hook to update progress on a learning resource
 *
 * @example
 * ```tsx
 * function ResourceItem({ resource }) {
 *   const { mutate } = useUpdateResourceProgress()
 *
 *   const handleProgressUpdate = (progress: number) => {
 *     mutate({
 *       resourceId: resource.id,
 *       progress,
 *       completed: progress === 100
 *     })
 *   }
 *
 *   return <ProgressBar value={resource.progress} onChange={handleProgressUpdate} />
 * }
 * ```
 */
export function useUpdateResourceProgress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateResourceProgress,
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['careerPlanner'] })

      // Snapshot previous value
      const previousData = queryClient.getQueryData<CareerPlannerData>(['careerPlanner'])

      // Optimistically update
      if (previousData) {
        queryClient.setQueryData<CareerPlannerData>(['careerPlanner'], {
          ...previousData,
          learningPaths: previousData.learningPaths.map(path => ({
            ...path,
            resources: path.resources.map(resource =>
              resource.id === variables.resourceId
                ? {
                    ...resource,
                    progress: variables.progress,
                    completed: variables.completed ?? resource.completed
                  }
                : resource
            )
          }))
        })
      }

      return { previousData }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(['careerPlanner'], context.previousData)
      }
      console.error('Failed to update resource progress:', err)
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['careerPlanner'] })
    }
  })
}

/**
 * Hook to fetch skill gap analysis separately (lightweight query)
 *
 * @example
 * ```tsx
 * function SkillGapWidget() {
 *   const { data: skillGap, isLoading } = useSkillGap()
 *
 *   if (isLoading) return <Skeleton />
 *
 *   return <SkillGapSummary gap={skillGap} />
 * }
 * ```
 */
export function useSkillGap() {
  return useQuery({
    queryKey: ['skillGap'],
    queryFn: fetchSkillGap,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000
  })
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook to get only recommendations without full career planner data
 */
export function useRecommendations() {
  const { data, ...rest } = useCareerPlanner()
  return {
    ...rest,
    recommendations: data?.recommendations
  }
}

/**
 * Hook to get only learning paths
 */
export function useLearningPaths() {
  const { data, ...rest } = useCareerPlanner()
  return {
    ...rest,
    learningPaths: data?.learningPaths
  }
}

/**
 * Hook to get profile and target role
 */
export function useCareerProfile() {
  const { data, ...rest } = useCareerPlanner()
  return {
    ...rest,
    profile: data?.profile,
    targetRole: data?.targetRole
  }
}
