/**
 * Enhanced GitHub Integration Service
 *
 * Fetches comprehensive GitHub data for credibility scoring
 *
 * Features:
 * - Complete repository analysis (commits, PRs, issues, stars)
 * - Contribution consistency tracking (daily commit patterns)
 * - Code quality scoring (PR reviews, issue engagement, documentation)
 * - Language proficiency analysis
 * - Open source contributions tracking
 * - Repository impact assessment
 *
 * API Requirements:
 * - GitHub OAuth App with repo, read:user, and user:email scopes
 * - Rate limit: 5000 requests/hour (authenticated)
 */

import { prisma } from '@/lib/prisma'
import { Octokit } from '@octokit/rest'

export interface GitHubUser {
  id: number
  login: string
  name: string | null
  email: string | null
  bio: string | null
  company: string | null
  location: string | null
  avatarUrl: string
  profileUrl: string
  publicRepos: number
  publicGists: number
  followers: number
  following: number
  createdAt: Date
  updatedAt: Date
}

export interface GitHubRepository {
  id: number
  name: string
  fullName: string
  description: string | null
  language: string | null
  stars: number
  forks: number
  watchers: number
  openIssues: number
  size: number
  isPrivate: boolean
  isFork: boolean
  topics: string[]
  createdAt: Date
  updatedAt: Date
  pushedAt: Date
  homepageUrl: string | null
}

export interface GitHubCommitActivity {
  totalCommits: number
  commitsLast30Days: number
  commitsLast90Days: number
  commitsLast365Days: number
  contributionsByDay: { date: string; count: number }[]
  longestStreak: number
  currentStreak: number
  consistencyScore: number // 0-100
}

export interface GitHubCodeQuality {
  totalPullRequests: number
  mergedPullRequests: number
  totalIssues: number
  closedIssues: number
  codeReviews: number
  commentsOnPRs: number
  commentsOnIssues: number
  hasReadme: number // percentage of repos with README
  hasTests: number // percentage of repos with tests
  hasDocumentation: number // percentage with docs
  qualityScore: number // 0-100
}

export interface GitHubLanguageStats {
  primaryLanguage: string | null
  languages: { name: string; bytes: number; percentage: number }[]
  totalBytesWritten: number
}

export interface GitHubContributions {
  totalContributions: number
  totalCommitContributions: number
  totalPullRequestContributions: number
  totalPullRequestReviewContributions: number
  totalIssueContributions: number
  totalRepositoryContributions: number
}

export interface GitHubAnalytics {
  user: GitHubUser
  repositories: GitHubRepository[]
  commitActivity: GitHubCommitActivity
  codeQuality: GitHubCodeQuality
  languageStats: GitHubLanguageStats
  contributions: GitHubContributions
  contributionScore: number // 0-100
  overallScore: number // 0-100
}

/**
 * Create Octokit instance with access token
 */
function createOctokit(accessToken: string): Octokit {
  return new Octokit({ auth: accessToken })
}

/**
 * Fetch authenticated user information
 */
export async function fetchGitHubUser(accessToken: string): Promise<GitHubUser> {
  const octokit = createOctokit(accessToken)
  const { data } = await octokit.users.getAuthenticated()

  return {
    id: data.id,
    login: data.login,
    name: data.name,
    email: data.email,
    bio: data.bio,
    company: data.company,
    location: data.location,
    avatarUrl: data.avatar_url,
    profileUrl: data.html_url,
    publicRepos: data.public_repos,
    publicGists: data.public_gists,
    followers: data.followers,
    following: data.following,
    createdAt: new Date(data.created_at || Date.now()),
    updatedAt: new Date(data.updated_at || Date.now())
  }
}

/**
 * Fetch all repositories for authenticated user
 */
export async function fetchGitHubRepositories(
  accessToken: string,
  includePrivate: boolean = false
): Promise<GitHubRepository[]> {
  const octokit = createOctokit(accessToken)
  const repositories: GitHubRepository[] = []

  // Fetch all pages
  let page = 1
  let hasMore = true

  while (hasMore) {
    const { data } = await octokit.repos.listForAuthenticatedUser({
      per_page: 100,
      page,
      sort: 'updated',
      direction: 'desc',
      visibility: includePrivate ? 'all' : 'public'
    })

    data.forEach(repo => {
      if (!includePrivate && repo.private) return

      repositories.push({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        watchers: repo.watchers_count || 0,
        openIssues: repo.open_issues_count || 0,
        size: repo.size || 0,
        isPrivate: repo.private,
        isFork: repo.fork,
        topics: repo.topics || [],
        createdAt: new Date(repo.created_at || Date.now()),
        updatedAt: new Date(repo.updated_at || Date.now()),
        pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : new Date(),
        homepageUrl: repo.homepage
      })
    })

    hasMore = data.length === 100
    page++
  }

  return repositories
}

/**
 * Analyze commit activity and consistency
 */
export async function analyzeCommitActivity(
  accessToken: string,
  username: string,
  repositories: GitHubRepository[]
): Promise<GitHubCommitActivity> {
  const octokit = createOctokit(accessToken)
  const commitsByDay = new Map<string, number>()
  let totalCommits = 0

  // Fetch commits from recent activity events (last 90 days)
  try {
    const { data: events } = await octokit.activity.listPublicEventsForUser({
      username,
      per_page: 100
    })

    events.forEach(event => {
      if (event.type === 'PushEvent') {
        const payload = event.payload as any
        const commitCount = payload.commits?.length || 1
        totalCommits += commitCount

        const date = new Date(event.created_at || Date.now()).toISOString().split('T')[0]
        commitsByDay.set(date, (commitsByDay.get(date) || 0) + commitCount)
      }
    })
  } catch (error) {
    console.error('Failed to fetch commit events:', error)
  }

  // For more accurate commit counts, check top repositories
  const topRepos = repositories
    .filter(r => !r.isFork)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 10)

  for (const repo of topRepos) {
    try {
      // Get commit activity statistics
      const { data: commitActivity } = await octokit.repos.getCommitActivityStats({
        owner: repo.fullName.split('/')[0],
        repo: repo.name
      })

      if (Array.isArray(commitActivity)) {
        commitActivity.forEach(week => {
          totalCommits += week.total || 0
        })
      }
    } catch (error) {
      // Repo may be empty or inaccessible
    }
  }

  // Calculate time-based metrics
  const sortedDates = Array.from(commitsByDay.keys()).sort()
  const today = new Date()
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)
  const oneYearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000)

  let commitsLast30Days = 0
  let commitsLast90Days = 0
  let commitsLast365Days = 0

  commitsByDay.forEach((count, dateStr) => {
    const date = new Date(dateStr)
    if (date >= thirtyDaysAgo) commitsLast30Days += count
    if (date >= ninetyDaysAgo) commitsLast90Days += count
    if (date >= oneYearAgo) commitsLast365Days += count
  })

  // Calculate streaks
  const { longestStreak, currentStreak } = calculateStreaks(sortedDates)

  // Calculate consistency score (0-100)
  const consistencyScore = calculateConsistencyScore(
    commitsByDay,
    sortedDates,
    commitsLast365Days
  )

  // Convert to array for storage
  const contributionsByDay = Array.from(commitsByDay.entries()).map(([date, count]) => ({
    date,
    count
  }))

  return {
    totalCommits: Math.max(totalCommits, commitsLast365Days),
    commitsLast30Days,
    commitsLast90Days,
    commitsLast365Days,
    contributionsByDay,
    longestStreak,
    currentStreak,
    consistencyScore
  }
}

/**
 * Calculate longest and current commit streaks
 */
function calculateStreaks(sortedDates: string[]): { longestStreak: number; currentStreak: number } {
  if (sortedDates.length === 0) {
    return { longestStreak: 0, currentStreak: 0 }
  }

  let longestStreak = 1
  let currentStreak = 1
  let tempStreak = 1

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1])
    const currDate = new Date(sortedDates[i])
    const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000))

    if (dayDiff === 1) {
      tempStreak++
    } else {
      longestStreak = Math.max(longestStreak, tempStreak)
      tempStreak = 1
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak)

  // Calculate current streak
  const lastCommitDate = sortedDates[sortedDates.length - 1]
  if (lastCommitDate === today || lastCommitDate === yesterday) {
    currentStreak = 1
    for (let i = sortedDates.length - 2; i >= 0; i--) {
      const prevDate = new Date(sortedDates[i])
      const currDate = new Date(sortedDates[i + 1])
      const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000))

      if (dayDiff === 1) {
        currentStreak++
      } else {
        break
      }
    }
  } else {
    currentStreak = 0
  }

  return { longestStreak, currentStreak }
}

/**
 * Calculate commit consistency score (0-100)
 */
function calculateConsistencyScore(
  commitsByDay: Map<string, number>,
  sortedDates: string[],
  commitsLast365Days: number
): number {
  if (sortedDates.length === 0 || commitsLast365Days === 0) return 0

  // Factor 1: Activity frequency (40 points)
  const daysWithActivity = commitsByDay.size
  const frequencyScore = Math.min(40, (daysWithActivity / 365) * 100)

  // Factor 2: Regular distribution (30 points)
  const gaps: number[] = []
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1])
    const currDate = new Date(sortedDates[i])
    const dayGap = Math.floor((currDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000))
    gaps.push(dayGap)
  }

  const avgGap = gaps.length > 0 ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0
  const stdDev = calculateStdDev(gaps, avgGap)
  const coefficientOfVariation = avgGap > 0 ? stdDev / avgGap : 1
  const distributionScore = Math.max(0, 30 - coefficientOfVariation * 10)

  // Factor 3: Recent activity (30 points)
  const lastCommitDate = new Date(sortedDates[sortedDates.length - 1])
  const daysSinceLastCommit = Math.floor((Date.now() - lastCommitDate.getTime()) / (24 * 60 * 60 * 1000))
  const recencyScore = Math.max(0, 30 - daysSinceLastCommit)

  const totalScore = frequencyScore + distributionScore + recencyScore
  return Math.min(100, Math.round(totalScore))
}

/**
 * Calculate standard deviation
 */
function calculateStdDev(values: number[], mean: number): number {
  if (values.length === 0) return 0
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2))
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length
  return Math.sqrt(avgSquaredDiff)
}

/**
 * Analyze code quality metrics
 */
export async function analyzeCodeQuality(
  accessToken: string,
  username: string,
  repositories: GitHubRepository[]
): Promise<GitHubCodeQuality> {
  const octokit = createOctokit(accessToken)

  let totalPullRequests = 0
  let mergedPullRequests = 0
  let totalIssues = 0
  let closedIssues = 0
  let codeReviews = 0
  let commentsOnPRs = 0
  let commentsOnIssues = 0
  let reposWithReadme = 0
  let reposWithTests = 0
  let reposWithDocs = 0

  // Analyze user's own repositories (not forks)
  const ownRepos = repositories.filter(r => !r.isFork)

  for (const repo of ownRepos) {
    try {
      const [owner, repoName] = repo.fullName.split('/')

      // Check for README
      try {
        await octokit.repos.getReadme({ owner, repo: repoName })
        reposWithReadme++
      } catch (error) {
        // No README
      }

      // Check for tests (common test directories)
      try {
        const { data: contents } = await octokit.repos.getContent({ owner, repo: repoName, path: '' })
        if (Array.isArray(contents)) {
          const hasTests = contents.some(item =>
            item.type === 'dir' &&
            (item.name === 'test' || item.name === 'tests' || item.name === '__tests__' || item.name === 'spec')
          )
          if (hasTests) reposWithTests++

          const hasDocs = contents.some(item =>
            item.type === 'dir' && (item.name === 'docs' || item.name === 'documentation')
          )
          if (hasDocs) reposWithDocs++
        }
      } catch (error) {
        // Failed to read contents
      }
    } catch (error) {
      console.error(`Failed to analyze repo ${repo.fullName}:`, error)
    }
  }

  // Fetch PR and issue stats from events
  try {
    const { data: events } = await octokit.activity.listPublicEventsForUser({
      username,
      per_page: 100
    })

    events.forEach(event => {
      switch (event.type) {
        case 'PullRequestEvent':
          totalPullRequests++
          if ((event.payload as any).action === 'closed' && (event.payload as any).pull_request?.merged) {
            mergedPullRequests++
          }
          break
        case 'IssuesEvent':
          totalIssues++
          if ((event.payload as any).action === 'closed') {
            closedIssues++
          }
          break
        case 'PullRequestReviewEvent':
          codeReviews++
          break
        case 'PullRequestReviewCommentEvent':
          commentsOnPRs++
          break
        case 'IssueCommentEvent':
          commentsOnIssues++
          break
      }
    })
  } catch (error) {
    console.error('Failed to fetch events for code quality:', error)
  }

  // Calculate quality score (0-100)
  const qualityScore = calculateQualityScore({
    totalPullRequests,
    mergedPullRequests,
    totalIssues,
    closedIssues,
    codeReviews,
    commentsOnPRs,
    commentsOnIssues,
    reposWithReadme,
    reposWithTests,
    reposWithDocs,
    totalRepos: ownRepos.length
  })

  return {
    totalPullRequests,
    mergedPullRequests,
    totalIssues,
    closedIssues,
    codeReviews,
    commentsOnPRs,
    commentsOnIssues,
    hasReadme: ownRepos.length > 0 ? Math.round((reposWithReadme / ownRepos.length) * 100) : 0,
    hasTests: ownRepos.length > 0 ? Math.round((reposWithTests / ownRepos.length) * 100) : 0,
    hasDocumentation: ownRepos.length > 0 ? Math.round((reposWithDocs / ownRepos.length) * 100) : 0,
    qualityScore
  }
}

/**
 * Calculate code quality score (0-100)
 */
function calculateQualityScore(metrics: {
  totalPullRequests: number
  mergedPullRequests: number
  totalIssues: number
  closedIssues: number
  codeReviews: number
  commentsOnPRs: number
  commentsOnIssues: number
  reposWithReadme: number
  reposWithTests: number
  reposWithDocs: number
  totalRepos: number
}): number {
  // Factor 1: PR success rate (20 points)
  const prSuccessRate =
    metrics.totalPullRequests > 0 ? metrics.mergedPullRequests / metrics.totalPullRequests : 0
  const prScore = prSuccessRate * 20

  // Factor 2: Issue resolution rate (15 points)
  const issueResolutionRate = metrics.totalIssues > 0 ? metrics.closedIssues / metrics.totalIssues : 0
  const issueScore = issueResolutionRate * 15

  // Factor 3: Code review participation (20 points)
  const reviewScore = Math.min(20, metrics.codeReviews * 2)

  // Factor 4: Collaboration (15 points)
  const collaborationScore = Math.min(15, (metrics.commentsOnPRs + metrics.commentsOnIssues) * 0.5)

  // Factor 5: Documentation practices (30 points)
  const readmeScore = metrics.totalRepos > 0 ? (metrics.reposWithReadme / metrics.totalRepos) * 10 : 0
  const testScore = metrics.totalRepos > 0 ? (metrics.reposWithTests / metrics.totalRepos) * 10 : 0
  const docScore = metrics.totalRepos > 0 ? (metrics.reposWithDocs / metrics.totalRepos) * 10 : 0
  const documentationScore = readmeScore + testScore + docScore

  const totalScore = prScore + issueScore + reviewScore + collaborationScore + documentationScore
  return Math.min(100, Math.round(totalScore))
}

/**
 * Analyze language usage statistics
 */
export async function analyzeLanguageStats(
  accessToken: string,
  repositories: GitHubRepository[]
): Promise<GitHubLanguageStats> {
  const octokit = createOctokit(accessToken)
  const languageBytes: Record<string, number> = {}

  for (const repo of repositories) {
    if (repo.isFork) continue // Skip forked repos

    try {
      const [owner, repoName] = repo.fullName.split('/')
      const { data: languages } = await octokit.repos.listLanguages({ owner, repo: repoName })

      Object.entries(languages).forEach(([lang, bytes]) => {
        languageBytes[lang] = (languageBytes[lang] || 0) + (bytes as number)
      })
    } catch (error) {
      // Skip repos where we can't fetch language stats
    }
  }

  const totalBytes = Object.values(languageBytes).reduce((sum, bytes) => sum + bytes, 0)
  const languages = Object.entries(languageBytes)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 100 * 10) / 10 : 0
    }))
    .sort((a, b) => b.bytes - a.bytes)

  return {
    primaryLanguage: languages.length > 0 ? languages[0].name : null,
    languages,
    totalBytesWritten: totalBytes
  }
}

/**
 * Fetch GitHub contribution data
 */
export async function fetchGitHubContributions(
  accessToken: string,
  username: string
): Promise<GitHubContributions> {
  const octokit = createOctokit(accessToken)

  let totalCommitContributions = 0
  let totalPullRequestContributions = 0
  let totalPullRequestReviewContributions = 0
  let totalIssueContributions = 0
  let totalRepositoryContributions = 0

  try {
    const { data: events } = await octokit.activity.listPublicEventsForUser({
      username,
      per_page: 100
    })

    events.forEach(event => {
      switch (event.type) {
        case 'PushEvent':
          totalCommitContributions += (event.payload as any).commits?.length || 1
          break
        case 'PullRequestEvent':
          totalPullRequestContributions++
          break
        case 'PullRequestReviewEvent':
          totalPullRequestReviewContributions++
          break
        case 'IssuesEvent':
          totalIssueContributions++
          break
        case 'CreateEvent':
          if ((event.payload as any).ref_type === 'repository') {
            totalRepositoryContributions++
          }
          break
      }
    })
  } catch (error) {
    console.error('Failed to fetch contributions:', error)
  }

  const totalContributions =
    totalCommitContributions +
    totalPullRequestContributions +
    totalPullRequestReviewContributions +
    totalIssueContributions +
    totalRepositoryContributions

  return {
    totalContributions,
    totalCommitContributions,
    totalPullRequestContributions,
    totalPullRequestReviewContributions,
    totalIssueContributions,
    totalRepositoryContributions
  }
}

/**
 * Calculate overall GitHub contribution score (0-100)
 */
export function calculateContributionScore(
  user: GitHubUser,
  repositories: GitHubRepository[],
  commitActivity: GitHubCommitActivity,
  codeQuality: GitHubCodeQuality,
  contributions: GitHubContributions
): number {
  // Factor 1: Repository impact (25 points)
  const ownRepos = repositories.filter(r => !r.isFork)
  const totalStars = ownRepos.reduce((sum, r) => sum + r.stars, 0)
  const totalForks = ownRepos.reduce((sum, r) => sum + r.forks, 0)
  const impactScore = Math.min(25, Math.log10(totalStars + totalForks + 1) * 5)

  // Factor 2: Commit activity (25 points)
  const activityScore = Math.min(25, Math.log10(commitActivity.commitsLast365Days + 1) * 6)

  // Factor 3: Consistency (20 points)
  const consistencyScore = (commitActivity.consistencyScore / 100) * 20

  // Factor 4: Code quality (20 points)
  const qualityScore = (codeQuality.qualityScore / 100) * 20

  // Factor 5: Community engagement (10 points)
  const engagementScore = Math.min(
    10,
    Math.log10(contributions.totalPullRequestContributions + contributions.totalIssueContributions + 1) * 3
  )

  const totalScore = impactScore + activityScore + consistencyScore + qualityScore + engagementScore
  return Math.min(100, Math.round(totalScore))
}

/**
 * Complete GitHub analytics fetch and analysis
 */
export async function getGitHubAnalytics(accessToken: string): Promise<GitHubAnalytics> {
  // Fetch user info
  const user = await fetchGitHubUser(accessToken)

  // Fetch repositories
  const repositories = await fetchGitHubRepositories(accessToken, false)

  // Analyze commit activity
  const commitActivity = await analyzeCommitActivity(accessToken, user.login, repositories)

  // Analyze code quality
  const codeQuality = await analyzeCodeQuality(accessToken, user.login, repositories)

  // Analyze language stats
  const languageStats = await analyzeLanguageStats(accessToken, repositories)

  // Fetch contributions
  const contributions = await fetchGitHubContributions(accessToken, user.login)

  // Calculate contribution score
  const contributionScore = calculateContributionScore(
    user,
    repositories,
    commitActivity,
    codeQuality,
    contributions
  )

  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    contributionScore * 0.4 +
      commitActivity.consistencyScore * 0.3 +
      codeQuality.qualityScore * 0.3
  )

  return {
    user,
    repositories,
    commitActivity,
    codeQuality,
    languageStats,
    contributions,
    contributionScore,
    overallScore
  }
}

/**
 * Save or update GitHub profile in database
 */
export async function saveGitHubProfile(userId: string, analytics: GitHubAnalytics) {
  const { user, repositories, commitActivity, codeQuality, languageStats, contributions, contributionScore, overallScore } = analytics

  // Prepare top repositories (sorted by stars)
  const topRepos = repositories
    .filter(r => !r.isFork)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 10)
    .map(r => ({
      name: r.name,
      description: r.description,
      language: r.language,
      stars: r.stars,
      forks: r.forks,
      url: `https://github.com/${r.fullName}`
    }))

  return prisma.gitHubProfile.upsert({
    where: {
      userId
    },
    create: {
      userId,
      username: user.login,
      profileUrl: user.profileUrl,
      totalRepos: repositories.filter(r => !r.isFork).length,
      totalCommits: commitActivity.totalCommits,
      totalPRs: contributions.totalPullRequestContributions,
      totalIssues: contributions.totalIssueContributions,
      totalStars: repositories.reduce((sum, r) => sum + r.stars, 0),
      languagesUsed: languageStats.languages.reduce((acc, lang) => {
        acc[lang.name] = lang.percentage
        return acc
      }, {} as Record<string, number>),
      contributionScore,
      consistencyScore: commitActivity.consistencyScore,
      codeQualityScore: codeQuality.qualityScore,
      topRepos,
      contributionGraph: commitActivity.contributionsByDay,
      lastFetchedAt: new Date()
    },
    update: {
      username: user.login,
      profileUrl: user.profileUrl,
      totalRepos: repositories.filter(r => !r.isFork).length,
      totalCommits: commitActivity.totalCommits,
      totalPRs: contributions.totalPullRequestContributions,
      totalIssues: contributions.totalIssueContributions,
      totalStars: repositories.reduce((sum, r) => sum + r.stars, 0),
      languagesUsed: languageStats.languages.reduce((acc, lang) => {
        acc[lang.name] = lang.percentage
        return acc
      }, {} as Record<string, number>),
      contributionScore,
      consistencyScore: commitActivity.consistencyScore,
      codeQualityScore: codeQuality.qualityScore,
      topRepos,
      contributionGraph: commitActivity.contributionsByDay,
      lastFetchedAt: new Date()
    }
  })
}

/**
 * Sync GitHub data for a user
 */
export async function syncGitHubData(userId: string, accessToken: string): Promise<void> {
  try {
    // Update sync status to 'syncing'
    await prisma.dataSourceSync.upsert({
      where: {
        userId_source: {
          userId,
          source: 'github'
        }
      },
      create: {
        userId,
        source: 'github',
        status: 'syncing',
        syncFrequency: 'daily'
      },
      update: {
        status: 'syncing'
      }
    })

    // Fetch and analyze GitHub data
    const analytics = await getGitHubAnalytics(accessToken)

    // Save to database
    await saveGitHubProfile(userId, analytics)

    // Update sync status to 'completed'
    await prisma.dataSourceSync.update({
      where: {
        userId_source: {
          userId,
          source: 'github'
        }
      },
      data: {
        status: 'completed',
        lastSyncAt: new Date(),
        nextSyncAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
        error: null
      }
    })

    console.log(`✓ GitHub sync completed for user ${userId}`)
  } catch (error) {
    console.error('GitHub sync error:', error)

    // Update sync status to 'failed'
    await prisma.dataSourceSync.update({
      where: {
        userId_source: {
          userId,
          source: 'github'
        }
      },
      data: {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })

    throw error
  }
}
