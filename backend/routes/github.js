const express = require('express');
const router = express.Router();
const githubService = require('../services/githubService');

// Fetch repository information
router.post('/repo-info', async (req, res) => {
  try {
    const { repoUrl } = req.body;
    
    if (!repoUrl) {
      return res.status(400).json({ error: 'Repository URL is required' });
    }

    const repoInfo = await githubService.getRepoInfo(repoUrl);
    res.json(repoInfo);
  } catch (error) {
    console.error('Error fetching repo info:', error);
    res.status(500).json({ 
      error: 'Failed to fetch repository information',
      message: error.message 
    });
  }
});

// Fetch repository file tree
router.post('/repo-tree', async (req, res) => {
  try {
    const { owner, repo, branch } = req.body;
    
    if (!owner || !repo) {
      return res.status(400).json({ error: 'Owner and repo are required' });
    }

    const tree = await githubService.getRepoTree(owner, repo, branch || 'main');
    res.json(tree);
  } catch (error) {
    console.error('Error fetching repo tree:', error);
    res.status(500).json({ 
      error: 'Failed to fetch repository tree',
      message: error.message 
    });
  }
});

// Fetch file content
router.post('/file-content', async (req, res) => {
  try {
    const { owner, repo, path, branch } = req.body;
    
    if (!owner || !repo || !path) {
      return res.status(400).json({ error: 'Owner, repo, and path are required' });
    }

    const content = await githubService.getFileContent(owner, repo, path, branch || 'main');
    res.json(content);
  } catch (error) {
    console.error('Error fetching file content:', error);
    res.status(500).json({ 
      error: 'Failed to fetch file content',
      message: error.message 
    });
  }
});

module.exports = router;

// Made with Bob
