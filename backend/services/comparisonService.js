const axios = require('axios');
const githubService = require('./githubService');

class ComparisonService {
  constructor() {
    this.watsonxUrl = process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com';
    this.apiKey = process.env.WATSONX_API_KEY;
    this.projectId = process.env.WATSONX_PROJECT_ID;
  }

  // Get IBM Cloud IAM token
  async getIAMToken() {
    try {
      const response = await axios.post(
        'https://iam.cloud.ibm.com/identity/token',
        new URLSearchParams({
          grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
          apikey: this.apiKey
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          }
        }
      );

      return response.data.access_token;
    } catch (error) {
      throw new Error(`Failed to get IAM token: ${error.message}`);
    }
  }

  // Detect tech stack from repository
  async detectTechStack(owner, repo, branch = 'main') {
    try {
      const { files } = await githubService.getRepoTree(owner, repo, branch);
      const techStack = new Set();

      // Analyze file extensions and common files
      files.forEach(file => {
        const path = file.path.toLowerCase();
        const ext = path.split('.').pop();

        // Languages
        if (ext === 'js' || ext === 'jsx') techStack.add('JavaScript');
        if (ext === 'ts' || ext === 'tsx') techStack.add('TypeScript');
        if (ext === 'py') techStack.add('Python');
        if (ext === 'java') techStack.add('Java');
        if (ext === 'rb') techStack.add('Ruby');
        if (ext === 'php') techStack.add('PHP');
        if (ext === 'go') techStack.add('Go');
        if (ext === 'rs') techStack.add('Rust');
        if (ext === 'cpp' || ext === 'cc' || ext === 'cxx') techStack.add('C++');
        if (ext === 'cs') techStack.add('C#');

        // Frameworks and tools
        if (path.includes('package.json')) {
          techStack.add('Node.js');
          techStack.add('npm');
        }
        if (path.includes('requirements.txt') || path.includes('pipfile')) techStack.add('pip');
        if (path.includes('pom.xml') || path.includes('build.gradle')) techStack.add('Maven/Gradle');
        if (path.includes('gemfile')) techStack.add('Bundler');
        if (path.includes('composer.json')) techStack.add('Composer');
        if (path.includes('cargo.toml')) techStack.add('Cargo');
        if (path.includes('go.mod')) techStack.add('Go Modules');
        
        // Frontend frameworks
        if (path.includes('react')) techStack.add('React');
        if (path.includes('vue')) techStack.add('Vue.js');
        if (path.includes('angular')) techStack.add('Angular');
        if (path.includes('svelte')) techStack.add('Svelte');
        
        // Backend frameworks
        if (path.includes('express')) techStack.add('Express');
        if (path.includes('django')) techStack.add('Django');
        if (path.includes('flask')) techStack.add('Flask');
        if (path.includes('spring')) techStack.add('Spring');
        if (path.includes('rails')) techStack.add('Rails');
        
        // Databases
        if (path.includes('mongodb') || path.includes('mongoose')) techStack.add('MongoDB');
        if (path.includes('postgres') || path.includes('pg')) techStack.add('PostgreSQL');
        if (path.includes('mysql')) techStack.add('MySQL');
        if (path.includes('redis')) techStack.add('Redis');
        
        // DevOps
        if (path.includes('docker')) techStack.add('Docker');
        if (path.includes('kubernetes') || path.includes('k8s')) techStack.add('Kubernetes');
        if (path.includes('.github/workflows')) techStack.add('GitHub Actions');
        if (path.includes('jenkins')) techStack.add('Jenkins');
      });

      return Array.from(techStack);
    } catch (error) {
      console.error('Tech stack detection error:', error);
      return [];
    }
  }

  // Compare two repositories
  async compareRepositories(repo1Owner, repo1Name, repo2Owner, repo2Name) {
    try {
      // Fetch repository information
      const [repo1Info, repo2Info] = await Promise.all([
        githubService.getRepoInfo(repo1Owner, repo1Name),
        githubService.getRepoInfo(repo2Owner, repo2Name)
      ]);

      // Detect tech stacks
      const [techStack1, techStack2] = await Promise.all([
        this.detectTechStack(repo1Owner, repo1Name),
        this.detectTechStack(repo2Owner, repo2Name)
      ]);

      // Calculate health scores (simplified algorithm)
      const healthScore1 = this.calculateHealthScore(repo1Info, techStack1);
      const healthScore2 = this.calculateHealthScore(repo2Info, techStack2);

      // Get AI comparison analysis
      const aiAnalysis = await this.getAIComparison(
        { ...repo1Info, techStack: techStack1, healthScore: healthScore1 },
        { ...repo2Info, techStack: techStack2, healthScore: healthScore2 }
      );

      return {
        repo1: {
          name: `${repo1Owner}/${repo1Name}`,
          description: repo1Info.description,
          healthScore: healthScore1,
          techStack: techStack1,
          stars: repo1Info.stars,
          forks: repo1Info.forks,
          openIssues: repo1Info.openIssues || 0,
          language: repo1Info.language,
          lastUpdate: repo1Info.lastUpdate,
          contributors: repo1Info.contributors || 0
        },
        repo2: {
          name: `${repo2Owner}/${repo2Name}`,
          description: repo2Info.description,
          healthScore: healthScore2,
          techStack: techStack2,
          stars: repo2Info.stars,
          forks: repo2Info.forks,
          openIssues: repo2Info.openIssues || 0,
          language: repo2Info.language,
          lastUpdate: repo2Info.lastUpdate,
          contributors: repo2Info.contributors || 0
        },
        winner: aiAnalysis.winner,
        reason: aiAnalysis.reason,
        detailedComparison: aiAnalysis.detailedComparison
      };
    } catch (error) {
      throw new Error(`Comparison failed: ${error.message}`);
    }
  }

  // Calculate health score based on various metrics
  calculateHealthScore(repoInfo, techStack) {
    let score = 5; // Base score

    // Stars contribution (max 2 points)
    if (repoInfo.stars > 10000) score += 2;
    else if (repoInfo.stars > 1000) score += 1.5;
    else if (repoInfo.stars > 100) score += 1;
    else if (repoInfo.stars > 10) score += 0.5;

    // Forks contribution (max 1 point)
    if (repoInfo.forks > 1000) score += 1;
    else if (repoInfo.forks > 100) score += 0.7;
    else if (repoInfo.forks > 10) score += 0.3;

    // Tech stack diversity (max 1 point)
    if (techStack.length > 10) score += 1;
    else if (techStack.length > 5) score += 0.7;
    else if (techStack.length > 2) score += 0.4;

    // Recent activity (max 1 point)
    if (repoInfo.lastUpdate) {
      const daysSinceUpdate = Math.floor((Date.now() - new Date(repoInfo.lastUpdate)) / (1000 * 60 * 60 * 24));
      if (daysSinceUpdate < 7) score += 1;
      else if (daysSinceUpdate < 30) score += 0.7;
      else if (daysSinceUpdate < 90) score += 0.4;
    }

    return Math.min(Math.round(score * 10) / 10, 10); // Cap at 10
  }

  // Get AI-powered comparison analysis
  async getAIComparison(repo1Data, repo2Data) {
    try {
      const prompt = `Compare these two GitHub repositories and determine which one is better:

Repository 1: ${repo1Data.name}
- Health Score: ${repo1Data.healthScore}/10
- Stars: ${repo1Data.stars}
- Forks: ${repo1Data.forks}
- Tech Stack: ${repo1Data.techStack.join(', ')}
- Language: ${repo1Data.language}

Repository 2: ${repo2Data.name}
- Health Score: ${repo2Data.healthScore}/10
- Stars: ${repo2Data.stars}
- Forks: ${repo2Data.forks}
- Tech Stack: ${repo2Data.techStack.join(', ')}
- Language: ${repo2Data.language}

Provide your analysis in JSON format:
{
  "winner": "repo1" or "repo2" or "tie",
  "reason": "Brief explanation of why",
  "detailedComparison": "Detailed comparison of both repositories"
}`;

      const token = await this.getIAMToken();

      const response = await axios.post(
        `${this.watsonxUrl}/ml/v1/text/generation?version=2023-05-29`,
        {
          input: prompt,
          model_id: 'ibm/granite-13b-chat-v2',
          project_id: this.projectId,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 1,
            top_k: 50
          }
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const analysisText = response.data.results[0].generated_text;
      
      // Try to parse JSON response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback comparison
      return this.getFallbackComparison(repo1Data, repo2Data);
    } catch (error) {
      console.error('AI comparison error:', error);
      return this.getFallbackComparison(repo1Data, repo2Data);
    }
  }

  // Fallback comparison logic
  getFallbackComparison(repo1Data, repo2Data) {
    const score1 = repo1Data.healthScore * 10 + repo1Data.stars / 100;
    const score2 = repo2Data.healthScore * 10 + repo2Data.stars / 100;

    let winner = 'tie';
    let reason = 'Both repositories have similar quality metrics and community engagement.';

    if (score1 > score2 * 1.1) {
      winner = 'repo1';
      reason = `${repo1Data.name} has a higher health score (${repo1Data.healthScore}/10) and stronger community engagement with ${repo1Data.stars} stars.`;
    } else if (score2 > score1 * 1.1) {
      winner = 'repo2';
      reason = `${repo2Data.name} has a higher health score (${repo2Data.healthScore}/10) and stronger community engagement with ${repo2Data.stars} stars.`;
    }

    return {
      winner,
      reason,
      detailedComparison: `Repository 1 (${repo1Data.name}) uses ${repo1Data.techStack.length} technologies and has ${repo1Data.stars} stars. Repository 2 (${repo2Data.name}) uses ${repo2Data.techStack.length} technologies and has ${repo2Data.stars} stars. Both repositories are actively maintained and have their own strengths.`
    };
  }
}

module.exports = new ComparisonService();

// Made with Bob