const axios = require('axios');

class GitHubService {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.token = process.env.GITHUB_TOKEN;
    this.headers = {
      'Accept': 'application/vnd.github.v3+json',
      ...(this.token && { 'Authorization': `token ${this.token}` })
    };
  }

  // Parse GitHub URL to extract owner and repo
  parseRepoUrl(repoUrl) {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = repoUrl.match(regex);
    
    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }

    return {
      owner: match[1],
      repo: match[2].replace('.git', '')
    };
  }

  // Get repository information
  async getRepoInfo(repoUrl) {
    const { owner, repo } = this.parseRepoUrl(repoUrl);
    
    try {
      const response = await axios.get(
        `${this.baseURL}/repos/${owner}/${repo}`,
        { headers: this.headers }
      );

      return {
        owner,
        repo,
        name: response.data.name,
        description: response.data.description,
        language: response.data.language,
        stars: response.data.stargazers_count,
        forks: response.data.forks_count,
        defaultBranch: response.data.default_branch,
        createdAt: response.data.created_at,
        updatedAt: response.data.updated_at
      };
    } catch (error) {
      throw new Error(`Failed to fetch repository info: ${error.message}`);
    }
  }

  // Get repository file tree
  async getRepoTree(owner, repo, branch = 'main') {
    try {
      const response = await axios.get(
        `${this.baseURL}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
        { headers: this.headers }
      );

      // Filter out non-code files and directories
      const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.go', '.rb', '.php', '.swift', '.kt', '.rs'];
      
      const files = response.data.tree
        .filter(item => item.type === 'blob')
        .filter(item => codeExtensions.some(ext => item.path.endsWith(ext)))
        .map(item => ({
          path: item.path,
          sha: item.sha,
          size: item.size,
          url: item.url
        }));

      return { files, totalFiles: files.length };
    } catch (error) {
      throw new Error(`Failed to fetch repository tree: ${error.message}`);
    }
  }

  // Get file content
  async getFileContent(owner, repo, path, branch = 'main') {
    try {
      const response = await axios.get(
        `${this.baseURL}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
        { headers: this.headers }
      );

      // Decode base64 content
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');

      return {
        path,
        content,
        size: response.data.size,
        sha: response.data.sha
      };
    } catch (error) {
      throw new Error(`Failed to fetch file content: ${error.message}`);
    }
  }

  // Fetch multiple files content
  async getMultipleFilesContent(owner, repo, files, branch = 'main') {
    const fileContents = [];
    
    // Limit to prevent rate limiting (adjust as needed)
    const maxFiles = Math.min(files.length, 50);
    
    for (let i = 0; i < maxFiles; i++) {
      try {
        const content = await this.getFileContent(owner, repo, files[i].path, branch);
        fileContents.push(content);
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error fetching ${files[i].path}:`, error.message);
      }
    }

    return fileContents;
  }
}

module.exports = new GitHubService();

// Made with Bob
