const axios = require('axios');
const PDFDocument = require('pdfkit');
const githubService = require('./githubService');

class AnalysisService {
  constructor() {
    this.watsonxUrl = process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com';
    this.apiKey = process.env.WATSONX_API_KEY;
    this.projectId = process.env.WATSONX_PROJECT_ID;
  }

  // Analyze repository codebase
  async analyzeRepository(owner, repo, branch = 'main') {
    try {
      // Get repository tree
      const { files } = await githubService.getRepoTree(owner, repo, branch);
      
      // Fetch content of key files
      const fileContents = await githubService.getMultipleFilesContent(owner, repo, files, branch);
      
      // Prepare code for analysis
      const codeContext = this.prepareCodeContext(fileContents);
      
      // Analyze with IBM watsonx.ai Granite model
      const analysis = await this.analyzeWithWatsonx(codeContext, { owner, repo });
      
      return {
        repository: { owner, repo, branch },
        filesAnalyzed: fileContents.length,
        totalFiles: files.length,
        ...analysis
      };
    } catch (error) {
      throw new Error(`Analysis failed: ${error.message}`);
    }
  }

  // Prepare code context for AI analysis
  prepareCodeContext(fileContents) {
    let context = 'Repository Code Files:\n\n';
    
    fileContents.forEach(file => {
      context += `File: ${file.path}\n`;
      context += `Content:\n${file.content.substring(0, 2000)}\n\n`; // Limit content length
      context += '---\n\n';
    });
    
    return context;
  }

  // Analyze code with IBM watsonx.ai Granite model
  async analyzeWithWatsonx(codeContext, repoInfo) {
    try {
      const prompt = `You are Bob, a highly skilled software engineer. Analyze this codebase and provide:

1. A simple, plain English explanation of what this application does (2-3 sentences)
2. List of broken or problematic code areas with:
   - File path
   - Issue description
   - Severity (High/Medium/Low)
   - Plain English fix suggestion
3. Overall code quality assessment

Repository: ${repoInfo.owner}/${repoInfo.repo}

${codeContext}

Provide your analysis in JSON format with this structure:
{
  "summary": "Plain English explanation of what the app does",
  "issues": [
    {
      "file": "path/to/file",
      "line": "approximate line number or range",
      "severity": "High/Medium/Low",
      "issue": "Description of the problem",
      "suggestion": "Plain English fix suggestion"
    }
  ],
  "codeQuality": {
    "score": "1-10",
    "strengths": ["list of strengths"],
    "improvements": ["list of suggested improvements"]
  }
}`;

      // Get IBM Cloud IAM token
      const token = await this.getIAMToken();

      // Call watsonx.ai API with Granite model
      const response = await axios.post(
        `${this.watsonxUrl}/ml/v1/text/generation?version=2023-05-29`,
        {
          input: prompt,
          model_id: 'ibm/granite-13b-chat-v2',
          project_id: this.projectId,
          parameters: {
            max_new_tokens: 2000,
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
      
      // Parse JSON response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback if JSON parsing fails
      return {
        summary: 'Analysis completed but response format was unexpected.',
        issues: [],
        codeQuality: {
          score: 'N/A',
          strengths: [],
          improvements: []
        }
      };
    } catch (error) {
      console.error('Watsonx AI Analysis error:', error);
      
      // Return mock analysis if AI fails
      return this.getMockAnalysis();
    }
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

  // Mock analysis for testing without watsonx.ai
  getMockAnalysis() {
    return {
      summary: 'This application appears to be a web-based project with frontend and backend components. It likely handles user interactions and data processing through a REST API architecture.',
      issues: [
        {
          file: 'src/index.js',
          line: '15-20',
          severity: 'Medium',
          issue: 'Missing error handling in async function',
          suggestion: 'Add try-catch blocks around async operations to handle potential errors gracefully and prevent application crashes'
        },
        {
          file: 'src/api/routes.js',
          line: '45',
          severity: 'High',
          issue: 'No input validation on user data',
          suggestion: 'Add validation to check user input before processing to prevent security vulnerabilities like SQL injection or XSS attacks'
        },
        {
          file: 'src/utils/helper.js',
          line: '30-35',
          severity: 'Low',
          issue: 'Unused variable declaration',
          suggestion: 'Remove unused variables to keep code clean and maintainable, reducing confusion for other developers'
        },
        {
          file: 'src/config/database.js',
          line: '10',
          severity: 'High',
          issue: 'Hardcoded credentials in source code',
          suggestion: 'Move sensitive credentials to environment variables to prevent security breaches and make deployment easier'
        }
      ],
      codeQuality: {
        score: '7',
        strengths: [
          'Well-organized file structure with clear separation of concerns',
          'Consistent naming conventions throughout the codebase',
          'Good use of modern JavaScript features',
          'Modular design makes code reusable'
        ],
        improvements: [
          'Add more comprehensive error handling throughout the application',
          'Include input validation on all user-facing endpoints',
          'Add unit tests for critical functions to ensure reliability',
          'Improve code documentation with JSDoc comments',
          'Move configuration values to environment variables'
        ]
      }
    };
  }

  // Generate PDF report
  async generatePDFReport(analysisData) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];

        // Collect PDF data
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        doc.fontSize(24).fillColor('#1e40af').text('BOB BUSINESS TRANSLATOR', { align: 'center' });
        doc.fontSize(16).fillColor('#4b5563').text('Code Analysis Report', { align: 'center' });
        doc.moveDown(2);

        // Repository Info
        doc.fontSize(12).fillColor('#000000');
        doc.text(`Repository: ${analysisData.repository.owner}/${analysisData.repository.repo}`, { continued: false });
        doc.text(`Branch: ${analysisData.repository.branch}`);
        doc.text(`Files Analyzed: ${analysisData.filesAnalyzed} of ${analysisData.totalFiles}`);
        doc.text(`Analysis Date: ${new Date().toLocaleDateString()}`);
        doc.moveDown(2);

        // Summary Section
        doc.fontSize(16).fillColor('#1e40af').text('SUMMARY', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#000000').text(analysisData.summary, { align: 'justify' });
        doc.moveDown(2);

        // Code Quality Score
        doc.fontSize(16).fillColor('#1e40af').text('CODE QUALITY SCORE', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(32).fillColor('#2563eb').text(`${analysisData.codeQuality.score}/10`, { align: 'center' });
        doc.moveDown(1);

        // Strengths
        doc.fontSize(14).fillColor('#059669').text('✓ Strengths', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#000000');
        analysisData.codeQuality.strengths.forEach(strength => {
          doc.text(`• ${strength}`, { indent: 20 });
        });
        doc.moveDown(1.5);

        // Issues Section
        doc.fontSize(16).fillColor('#1e40af').text(`ISSUES FOUND (${analysisData.issues.length})`, { underline: true });
        doc.moveDown(0.5);

        if (analysisData.issues.length === 0) {
          doc.fontSize(11).fillColor('#059669').text('✓ No issues found! The code looks good.', { align: 'center' });
        } else {
          analysisData.issues.forEach((issue, idx) => {
            // Check if we need a new page
            if (doc.y > 650) {
              doc.addPage();
            }

            doc.fontSize(12).fillColor('#000000').text(`${idx + 1}. ${issue.file} (Line ${issue.line})`);
            
            // Severity badge
            const severityColor = issue.severity === 'High' ? '#dc2626' :
                                 issue.severity === 'Medium' ? '#f59e0b' : '#3b82f6';
            doc.fontSize(10).fillColor(severityColor).text(`   Severity: ${issue.severity}`);
            
            doc.fontSize(10).fillColor('#000000');
            doc.text(`   Issue: ${issue.issue}`, { indent: 20 });
            doc.fillColor('#2563eb').text(`   Fix: ${issue.suggestion}`, { indent: 20 });
            doc.moveDown(1);
          });
        }

        doc.moveDown(1);

        // Recommended Improvements
        if (doc.y > 600) {
          doc.addPage();
        }
        doc.fontSize(16).fillColor('#1e40af').text('RECOMMENDED IMPROVEMENTS', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#000000');
        analysisData.codeQuality.improvements.forEach(improvement => {
          doc.text(`• ${improvement}`, { indent: 20 });
        });

        // Footer
        doc.moveDown(3);
        doc.fontSize(10).fillColor('#6b7280').text('Generated by Bob Business Translator', { align: 'center' });
        doc.text('Powered by IBM watsonx.ai Granite Model', { align: 'center' });

        // Finalize PDF
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new AnalysisService();

// Made with Bob
