import { Octokit } from '@octokit/rest';

interface GitHubAnalysisResult {
  languages: Record<string, number>;
  frameworks: Set<string>;
  tools: Set<string>;
  topics: Set<string>;
  totalCommits: number;
  totalStars: number;
  contributions: {
    commits: number;
    pullRequests: number;
    issues: number;
    reviews: number;
  };
  recentActivity: Date | null;
  primaryLanguage: string | null;
  repositoryDetails: Array<{
    name: string;
    description: string | null;
    language: string | null;
    stars: number;
    commits: number;
    lastUpdated: Date;
    topics: string[];
    frameworks: string[];
  }>;
}

export class GitHubAnalyzer {
  private octokit: Octokit;
  private userId: string;

  constructor(accessToken: string, userId: string) {
    this.octokit = new Octokit({ auth: accessToken });
    this.userId = userId;
  }

  async analyze(onProgress?: (progress: number, message: string) => void): Promise<GitHubAnalysisResult> {
    const result: GitHubAnalysisResult = {
      languages: {},
      frameworks: new Set(),
      tools: new Set(),
      topics: new Set(),
      totalCommits: 0,
      totalStars: 0,
      contributions: {
        commits: 0,
        pullRequests: 0,
        issues: 0,
        reviews: 0,
      },
      recentActivity: null,
      primaryLanguage: null,
      repositoryDetails: [],
    };

    try {
      // Get user info
      onProgress?.(5, 'Fetching user information...');
      const { data: user } = await this.octokit.users.getAuthenticated();

      // Fetch all repositories (including pagination)
      onProgress?.(10, 'Fetching repositories...');
      const repos = await this.fetchAllRepos();
      
      // Analyze each repository
      let processedRepos = 0;
      for (const repo of repos) {
        processedRepos++;
        const progress = 10 + (processedRepos / repos.length) * 60;
        onProgress?.(progress, `Analyzing ${repo.name}...`);

        // Collect basic repo data
        result.totalStars += repo.stargazers_count || 0;
        
        if (repo.language) {
          result.languages[repo.language] = (result.languages[repo.language] || 0) + 1;
        }

        if (repo.topics) {
          repo.topics.forEach((topic: string) => result.topics.add(topic));
        }

        // Get detailed language stats
        try {
          const { data: languages } = await this.octokit.repos.listLanguages({
            owner: repo.owner.login,
            repo: repo.name,
          });

          Object.entries(languages).forEach(([lang, bytes]) => {
            result.languages[lang] = (result.languages[lang] || 0) + (bytes as number);
          });
        } catch (error) {
          console.error(`Failed to fetch languages for ${repo.name}:`, error);
        }

        // Analyze repository files for frameworks and tools
        const detectedItems = await this.detectFrameworksAndTools(repo.owner.login, repo.name);
        detectedItems.frameworks.forEach(fw => result.frameworks.add(fw));
        detectedItems.tools.forEach(tool => result.tools.add(tool));

        // Get commit count
        let commitCount = 0;
        try {
          const { data: commits } = await this.octokit.repos.listCommits({
            owner: repo.owner.login,
            repo: repo.name,
            author: user.login,
            per_page: 1,
          });
          
          // Get total count from headers
          const linkHeader = commits.length > 0 ? '1' : '0';
          commitCount = parseInt(linkHeader);
          result.totalCommits += commitCount;
        } catch (error) {
          console.error(`Failed to fetch commits for ${repo.name}:`, error);
        }

        // Store repository details
        result.repositoryDetails.push({
          name: repo.name,
          description: repo.description,
          language: repo.language,
          stars: repo.stargazers_count || 0,
          commits: commitCount,
          lastUpdated: new Date(repo.updated_at),
          topics: repo.topics || [],
          frameworks: Array.from(detectedItems.frameworks),
        });

        // Update recent activity
        if (!result.recentActivity || new Date(repo.updated_at) > result.recentActivity) {
          result.recentActivity = new Date(repo.updated_at);
        }
      }

      // Fetch contribution stats
      onProgress?.(75, 'Analyzing contributions...');
      await this.fetchContributionStats(result, user.login);

      // Determine primary language
      if (Object.keys(result.languages).length > 0) {
        result.primaryLanguage = Object.entries(result.languages)
          .sort(([, a], [, b]) => b - a)[0][0];
      }

      onProgress?.(100, 'Analysis complete!');
      return result;
    } catch (error) {
      console.error('GitHub analysis error:', error);
      throw error;
    }
  }

  private async fetchAllRepos(): Promise<any[]> {
    const repos: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const { data } = await this.octokit.repos.listForAuthenticatedUser({
        per_page: 100,
        page,
        sort: 'updated',
        direction: 'desc',
      });

      repos.push(...data);
      hasMore = data.length === 100;
      page++;
    }

    return repos;
  }

  private async detectFrameworksAndTools(owner: string, repo: string): Promise<{ frameworks: Set<string>, tools: Set<string> }> {
    const frameworks = new Set<string>();
    const tools = new Set<string>();

    try {
      // Check for common configuration files
      const filesToCheck = [
        { path: 'package.json', detector: this.detectFromPackageJson },
        { path: 'requirements.txt', detector: this.detectFromRequirements },
        { path: 'Gemfile', detector: this.detectFromGemfile },
        { path: 'pom.xml', detector: this.detectFromPomXml },
        { path: 'build.gradle', detector: this.detectFromGradle },
        { path: 'Cargo.toml', detector: this.detectFromCargo },
        { path: 'go.mod', detector: this.detectFromGoMod },
        { path: 'composer.json', detector: this.detectFromComposer },
        { path: '.github/workflows', detector: this.detectFromGitHubActions },
        { path: 'Dockerfile', detector: () => ({ frameworks: new Set<string>(), tools: new Set(['Docker']) }) },
        { path: 'docker-compose.yml', detector: () => ({ frameworks: new Set<string>(), tools: new Set(['Docker', 'Docker Compose']) }) },
        { path: '.gitlab-ci.yml', detector: () => ({ frameworks: new Set<string>(), tools: new Set(['GitLab CI']) }) },
        { path: 'Jenkinsfile', detector: () => ({ frameworks: new Set<string>(), tools: new Set(['Jenkins']) }) },
      ];

      for (const { path, detector } of filesToCheck) {
        try {
          const { data } = await this.octokit.repos.getContent({
            owner,
            repo,
            path,
          });

          if ('content' in data && data.content) {
            const content = Buffer.from(data.content, 'base64').toString('utf-8');
            const detected = detector(content);
            if (detected instanceof Set) {
              // Old format, assume all are frameworks
              detected.forEach(fw => frameworks.add(fw));
            } else {
              // New format with separate frameworks and tools
              detected.frameworks.forEach(fw => frameworks.add(fw));
              detected.tools.forEach(tool => tools.add(tool));
            }
          }
        } catch (error) {
          // File doesn't exist, continue
        }
      }
    } catch (error) {
      console.error(`Failed to detect frameworks for ${owner}/${repo}:`, error);
    }

    return { frameworks, tools };
  }

  private detectFromPackageJson(content: string): { frameworks: Set<string>, tools: Set<string> } {
    const frameworks = new Set<string>();
    const tools = new Set<string>();
    
    try {
      const pkg = JSON.parse(content);
      const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
      };

      // Framework detection patterns
      const patterns = {
        'React': ['react', 'react-dom'],
        'Next.js': ['next'],
        'Vue.js': ['vue'],
        'Nuxt.js': ['nuxt'],
        'Angular': ['@angular/core'],
        'Svelte': ['svelte'],
        'Express': ['express'],
        'NestJS': ['@nestjs/core'],
        'Gatsby': ['gatsby'],
        'Redux': ['redux', '@reduxjs/toolkit'],
        'TypeScript': ['typescript'],
        'Jest': ['jest'],
        'Webpack': ['webpack'],
        'Vite': ['vite'],
        'ESLint': ['eslint'],
        'Prettier': ['prettier'],
        'Tailwind CSS': ['tailwindcss'],
        'Material-UI': ['@mui/material', '@material-ui/core'],
        'Styled Components': ['styled-components'],
        'GraphQL': ['graphql', 'apollo-server', '@apollo/client'],
        'Prisma': ['prisma', '@prisma/client'],
        'MongoDB': ['mongodb', 'mongoose'],
        'PostgreSQL': ['pg', 'postgres'],
        'Redis': ['redis', 'ioredis'],
        'Socket.io': ['socket.io'],
        'Electron': ['electron'],
        'React Native': ['react-native'],
      };

      Object.entries(patterns).forEach(([framework, deps]) => {
        if (deps.some(dep => dep in allDeps)) {
          frameworks.add(framework);
        }
      });

      // Testing tools
      const testingPatterns = {
        'Jest': ['jest'],
        'Mocha': ['mocha'],
        'Cypress': ['cypress'],
        'Playwright': ['playwright'],
      };
      
      Object.entries(testingPatterns).forEach(([tool, deps]) => {
        if (deps.some(dep => dep in allDeps)) {
          tools.add(tool);
        }
      });

      // Build tools
      if ('webpack' in allDeps) tools.add('Webpack');
      if ('vite' in allDeps) tools.add('Vite');
      if ('eslint' in allDeps) tools.add('ESLint');
      if ('prettier' in allDeps) tools.add('Prettier');

      // Also add Node.js if it's a Node project
      if (pkg.engines?.node) {
        frameworks.add('Node.js');
      }
    } catch (error) {
      console.error('Failed to parse package.json:', error);
    }

    return { frameworks, tools };
  }

  private detectFromRequirements(content: string): Set<string> {
    const frameworks = new Set<string>();
    frameworks.add('Python');

    const patterns = {
      'Django': ['django'],
      'Flask': ['flask'],
      'FastAPI': ['fastapi'],
      'NumPy': ['numpy'],
      'Pandas': ['pandas'],
      'TensorFlow': ['tensorflow'],
      'PyTorch': ['torch', 'pytorch'],
      'Scikit-learn': ['scikit-learn', 'sklearn'],
      'Jupyter': ['jupyter', 'notebook'],
      'Pytest': ['pytest'],
      'SQLAlchemy': ['sqlalchemy'],
      'Celery': ['celery'],
      'Beautiful Soup': ['beautifulsoup4', 'bs4'],
      'Requests': ['requests'],
      'Matplotlib': ['matplotlib'],
      'Selenium': ['selenium'],
    };

    const lines = content.toLowerCase().split('\n');
    Object.entries(patterns).forEach(([framework, deps]) => {
      if (deps.some(dep => lines.some(line => line.includes(dep)))) {
        frameworks.add(framework);
      }
    });

    return frameworks;
  }

  private detectFromGemfile(content: string): Set<string> {
    const frameworks = new Set<string>();
    frameworks.add('Ruby');

    const patterns = {
      'Ruby on Rails': ['rails'],
      'Sinatra': ['sinatra'],
      'RSpec': ['rspec'],
      'Sidekiq': ['sidekiq'],
      'Devise': ['devise'],
      'Puma': ['puma'],
      'Capistrano': ['capistrano'],
    };

    const lines = content.toLowerCase().split('\n');
    Object.entries(patterns).forEach(([framework, deps]) => {
      if (deps.some(dep => lines.some(line => line.includes(`gem '${dep}'`) || line.includes(`gem "${dep}"`)))) {
        frameworks.add(framework);
      }
    });

    return frameworks;
  }

  private detectFromPomXml(content: string): Set<string> {
    const frameworks = new Set<string>();
    frameworks.add('Java');
    frameworks.add('Maven');

    const patterns = {
      'Spring Boot': ['spring-boot'],
      'Spring': ['springframework'],
      'JUnit': ['junit'],
      'Hibernate': ['hibernate'],
      'Apache Kafka': ['kafka'],
      'Jackson': ['jackson'],
      'Log4j': ['log4j'],
    };

    const contentLower = content.toLowerCase();
    Object.entries(patterns).forEach(([framework, deps]) => {
      if (deps.some(dep => contentLower.includes(dep))) {
        frameworks.add(framework);
      }
    });

    return frameworks;
  }

  private detectFromGradle(content: string): Set<string> {
    const frameworks = new Set<string>();
    frameworks.add('Java');
    frameworks.add('Gradle');

    const patterns = {
      'Spring Boot': ['spring-boot'],
      'Android': ['com.android.application', 'com.android.library'],
      'Kotlin': ['kotlin'],
    };

    const contentLower = content.toLowerCase();
    Object.entries(patterns).forEach(([framework, deps]) => {
      if (deps.some(dep => contentLower.includes(dep))) {
        frameworks.add(framework);
      }
    });

    return frameworks;
  }

  private detectFromCargo(content: string): Set<string> {
    const frameworks = new Set<string>();
    frameworks.add('Rust');

    const patterns = {
      'Tokio': ['tokio'],
      'Actix': ['actix-web'],
      'Rocket': ['rocket'],
      'Serde': ['serde'],
      'Diesel': ['diesel'],
    };

    const lines = content.toLowerCase().split('\n');
    Object.entries(patterns).forEach(([framework, deps]) => {
      if (deps.some(dep => lines.some(line => line.includes(dep)))) {
        frameworks.add(framework);
      }
    });

    return frameworks;
  }

  private detectFromGoMod(content: string): Set<string> {
    const frameworks = new Set<string>();
    frameworks.add('Go');

    const patterns = {
      'Gin': ['github.com/gin-gonic/gin'],
      'Echo': ['github.com/labstack/echo'],
      'Fiber': ['github.com/gofiber/fiber'],
      'GORM': ['gorm.io/gorm'],
      'Cobra': ['github.com/spf13/cobra'],
    };

    const lines = content.toLowerCase().split('\n');
    Object.entries(patterns).forEach(([framework, deps]) => {
      if (deps.some(dep => lines.some(line => line.includes(dep)))) {
        frameworks.add(framework);
      }
    });

    return frameworks;
  }

  private detectFromComposer(content: string): Set<string> {
    const frameworks = new Set<string>();
    frameworks.add('PHP');

    try {
      const composer = JSON.parse(content);
      const allDeps = {
        ...composer.require,
        ...composer['require-dev'],
      };

      const patterns = {
        'Laravel': ['laravel/framework'],
        'Symfony': ['symfony/'],
        'Slim': ['slim/slim'],
        'PHPUnit': ['phpunit/phpunit'],
        'Composer': ['composer'],
      };

      Object.entries(patterns).forEach(([framework, deps]) => {
        if (deps.some(dep => Object.keys(allDeps).some(key => key.includes(dep)))) {
          frameworks.add(framework);
        }
      });
    } catch (error) {
      console.error('Failed to parse composer.json:', error);
    }

    return frameworks;
  }

  private detectFromGitHubActions(content: string): { frameworks: Set<string>, tools: Set<string> } {
    const frameworks = new Set<string>();
    const tools = new Set<string>();
    tools.add('GitHub Actions');
    tools.add('CI/CD');
    return { frameworks, tools };
  }

  private async fetchContributionStats(result: GitHubAnalysisResult, username: string): Promise<void> {
    try {
      // Fetch user events for contribution analysis
      const { data: events } = await this.octokit.activity.listPublicEventsForUser({
        username,
        per_page: 100,
      });

      events.forEach(event => {
        switch (event.type) {
          case 'PushEvent':
            result.contributions.commits += (event.payload as any).commits?.length || 1;
            break;
          case 'PullRequestEvent':
            result.contributions.pullRequests++;
            break;
          case 'IssuesEvent':
            result.contributions.issues++;
            break;
          case 'PullRequestReviewEvent':
            result.contributions.reviews++;
            break;
        }
      });
    } catch (error) {
      console.error('Failed to fetch contribution stats:', error);
    }
  }
}
