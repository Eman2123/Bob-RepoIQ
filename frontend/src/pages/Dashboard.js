import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateReport } from '../services/api';
import {
  CodeIcon,
  GithubIcon,
  StarIcon,
  ChartIcon,
  CheckCircleIcon,
  ExclamationIcon,
  LightbulbIcon,
  DocumentIcon,
  DownloadIcon,
  ArrowLeftIcon,
  UserIcon
} from '../components/Icons';

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { repoInfo, analysis } = location.state || {};
  const [exportingPDF, setExportingPDF] = useState(false);

  // Redirect if no data
  useEffect(() => {
    if (!repoInfo || !analysis) {
      navigate('/');
    }
  }, [repoInfo, analysis, navigate]);

  // Don't render if no data
  if (!repoInfo || !analysis) {
    return null;
  }

  const handleExportPDF = async () => {
    setExportingPDF(true);
    try {
      const pdfBlob = await generateReport(analysis);
      
      // Ensure the blob has the correct MIME type
      const blob = new Blob([pdfBlob], { type: 'application/pdf' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bob-analysis-${repoInfo.owner}-${repoInfo.repo}.pdf`;
      link.setAttribute('type', 'application/pdf');
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setExportingPDF(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <ExclamationIcon className="w-5 h-5 text-red-600" />;
      case 'medium':
        return <ExclamationIcon className="w-5 h-5 text-yellow-600" />;
      case 'low':
        return <ExclamationIcon className="w-5 h-5 text-blue-600" />;
      default:
        return <ExclamationIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                  <CodeIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Bob Repo IQ</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExportPDF}
                disabled={exportingPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 flex items-center space-x-2"
              >
                <DownloadIcon className="w-5 h-5" />
                <span>{exportingPDF ? 'Exporting...' : 'Export PDF'}</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <UserIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Repository Info Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <GithubIcon className="w-8 h-8 text-gray-700" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {repoInfo.owner}/{repoInfo.repo}
                </h2>
              </div>
              {repoInfo.description && (
                <p className="text-gray-600 mb-4 text-lg">{repoInfo.description}</p>
              )}
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <StarIcon className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">{repoInfo.stars.toLocaleString()} stars</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 12h12m-7 5h7" />
                  </svg>
                  <span className="font-medium">{repoInfo.forks.toLocaleString()} forks</span>
                </div>
                {repoInfo.language && (
                  <div className="flex items-center space-x-2">
                    <CodeIcon className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">{repoInfo.language}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right ml-6">
              <div className="text-sm text-gray-500 mb-1">Files Analyzed</div>
              <div className="text-4xl font-bold text-blue-600">
                {analysis.filesAnalyzed}
              </div>
              <div className="text-sm text-gray-500">of {analysis.totalFiles}</div>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <DocumentIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">What This App Does</h3>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            {analysis.summary}
          </p>
        </div>

        {/* Code Quality Score */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <ChartIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Code Quality Score</h3>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-5xl font-bold text-blue-600">
                {analysis.codeQuality.score}
              </div>
              <div className="text-2xl text-gray-400 font-medium">/10</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-green-50 rounded-lg p-5 border border-green-200">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                <h4 className="font-semibold text-gray-900 text-lg">Strengths</h4>
              </div>
              <ul className="space-y-3">
                {analysis.codeQuality.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
              <div className="flex items-center space-x-2 mb-4">
                <LightbulbIcon className="w-6 h-6 text-blue-600" />
                <h4 className="font-semibold text-gray-900 text-lg">Suggested Improvements</h4>
              </div>
              <ul className="space-y-3">
                {analysis.codeQuality.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <LightbulbIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Issues Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-red-100 p-2 rounded-lg">
              <ExclamationIcon className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Issues Found ({analysis.issues.length})
            </h3>
          </div>

          {analysis.issues.length === 0 ? (
            <div className="text-center py-12 bg-green-50 rounded-lg border border-green-200">
              <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <p className="text-gray-700 text-lg font-medium">
                No issues found! The code looks good.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {analysis.issues.map((issue, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition duration-200 bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {getSeverityIcon(issue.severity)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(
                            issue.severity
                          )}`}
                        >
                          {issue.severity.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">
                          Line {issue.line}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <CodeIcon className="w-5 h-5 text-gray-500" />
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {issue.file}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700">
                      <span className="font-semibold text-gray-900">Issue: </span>
                      {issue.issue}
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <LightbulbIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 mb-1">How to Fix:</p>
                        <p className="text-gray-700">{issue.suggestion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Analysis powered by{' '}
            <span className="font-semibold text-blue-600">
              IBM watsonx.ai Granite Model
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

// Made with Bob
