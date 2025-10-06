import { Octokit } from '@octokit/rest';

interface SimpleGitHubResult {
  languages: Record<string, number>;
  frameworks: string[];
  totalRepos: number;
  primaryLanguage: string | null;
}

export class SimpleGitHubAnalyzer {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({ auth: accessToken });
  }

  async analyze(onProgress?: (progress: number, message: string) => void): Promise<SimpleGitHubResult> {
    const result: SimpleGitHubResult = {
      languages: {},
      frameworks: [],
      totalRepos: 0,
      primaryLanguage: null,
    };

    try {
      // Get user repos
      onProgress?.(10, 'Fetching repositories...');
      const { data: repos } = await this.octokit.repos.listForAuthenticatedUser({
        per_page: 100,
        sort: 'updated',
      });

      result.totalRepos = repos.length;
      
      // Analyze languages
      onProgress?.(30, 'Analyzing languages...');
      for (let i = 0; i < repos.length; i++) {
        const repo = repos[i];
        
        if (repo.language) {
          result.languages[repo.language] = (result.languages[repo.language] || 0) + 1;
        }

        // Progress update
        const progress = 30 + (i / repos.length) * 50;
        onProgress?.(Math.floor(progress), `Analyzing ${repo.name}...`);
      }

      // Detect frameworks from common files
      onProgress?.(80, 'Detecting frameworks...');
      const frameworksSet = new Set<string>();
      
      // Sample a few repos for framework detection
      const reposToSample = repos.slice(0, Math.min(5, repos.length));
      
      for (const repo of reposToSample) {
        try {
          // Check for package.json
          const { data } = await this.octokit.repos.getContent({
            owner: repo.owner.login,
            repo: repo.name,
            path: 'package.json',
          }).catch(() => ({ data: null }));

          if (data && 'content' in data) {
            const content = Buffer.from(data.content, 'base64').toString('utf-8');
            const pkg = JSON.parse(content);
            
            // Simple framework detection
            if (pkg.dependencies?.react || pkg.devDependencies?.react) frameworksSet.add('React');
            if (pkg.dependencies?.vue || pkg.devDependencies?.vue) frameworksSet.add('Vue.js');
            if (pkg.dependencies?.angular || pkg.devDependencies?.angular) frameworksSet.add('Angular');
            if (pkg.dependencies?.next || pkg.devDependencies?.next) frameworksSet.add('Next.js');
            if (pkg.dependencies?.express || pkg.devDependencies?.express) frameworksSet.add('Express');
            if (pkg.dependencies?.nestjs || pkg.devDependencies?.nestjs) frameworksSet.add('NestJS');
          }
        } catch (error) {
          // Ignore errors for individual repos
        }
      }

      result.frameworks = Array.from(frameworksSet);

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
}
