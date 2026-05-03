const express = require('express');
const router = express.Router();
const analysisService = require('../services/analysisService');

// Analyze repository codebase
router.post('/analyze', async (req, res) => {
  try {
    const { owner, repo, branch } = req.body;
    
    if (!owner || !repo) {
      return res.status(400).json({ error: 'Owner and repo are required' });
    }

    const analysis = await analysisService.analyzeRepository(owner, repo, branch || 'main');
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing repository:', error);
    res.status(500).json({ 
      error: 'Failed to analyze repository',
      message: error.message 
    });
  }
});

// Generate PDF report
router.post('/generate-report', async (req, res) => {
  try {
    const { analysisData } = req.body;
    
    if (!analysisData) {
      return res.status(400).json({ error: 'Analysis data is required' });
    }

    const pdfBuffer = await analysisService.generatePDFReport(analysisData);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=bob-analysis-report.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ 
      error: 'Failed to generate PDF report',
      message: error.message 
    });
  }
});

module.exports = router;

// Made with Bob
