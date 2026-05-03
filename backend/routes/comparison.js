const express = require('express');
const router = express.Router();
const comparisonService = require('../services/comparisonService');

// Compare two repositories
router.post('/compare', async (req, res) => {
  try {
    const { repo1Url, repo2Url } = req.body;

    if (!repo1Url || !repo2Url) {
      return res.status(400).json({ error: 'Both repository URLs are required' });
    }

    // Parse GitHub URLs
    const parseGitHubUrl = (url) => {
      const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (match) {
        return { owner: match[1], repo: match[2].replace('.git', '') };
      }
      return null;
    };

    const repo1 = parseGitHubUrl(repo1Url);
    const repo2 = parseGitHubUrl(repo2Url);

    if (!repo1 || !repo2) {
      return res.status(400).json({ error: 'Invalid GitHub repository URLs' });
    }

    const comparison = await comparisonService.compareRepositories(
      repo1.owner,
      repo1.repo,
      repo2.owner,
      repo2.repo
    );

    res.json(comparison);
  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({ 
      error: 'Failed to compare repositories',
      message: error.message 
    });
  }
});

// Detect tech stack for a single repository
router.get('/tech-stack/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const branch = req.query.branch || 'main';

    const techStack = await comparisonService.detectTechStack(owner, repo, branch);
    res.json({ techStack });
  } catch (error) {
    console.error('Tech stack detection error:', error);
    res.status(500).json({ 
      error: 'Failed to detect tech stack',
      message: error.message 
    });
  }
});

module.exports = router;

// Made with Bob