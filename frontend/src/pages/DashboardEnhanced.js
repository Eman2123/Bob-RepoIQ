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
  UserIcon,
  ChatIcon,
  CpuIcon,
  FireIcon,
  ShieldIcon
} from '../components/Icons';

function DashboardEnhanced() {
  const location = useLocation();
  const navigate = useNavigate();
  const { repoInfo, analysis } = location.state || {};
  const [exportingPDF, setExportingPDF] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

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
      const blob = new Blob([pdfBlob], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bob-analysis-${repoInfo.owner}-${repoInfo.repo}.pdf`;
      link.setAttribute('type', 'application/pdf');
      document.body.appendChild(link);
      link.click();
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

  // Tech stack detection
  const detectTechStack = () => {
    const techStack = [];
    const language = repoInfo.language?.toLowerCase() || '';
    
    // Detect based on primary language
    if (language.includes('javascript') || language.includes('typescript')) {
      techStack.push({ name: 'JavaScript', color: 'bg-yellow-400 text-gray-900' });
      techStack.push({ name: 'Node.js', color: 'bg-green-500 text-white' });
    }
    if (language.includes('python')) {
      techStack.push({ name: 'Python', color: 'bg-blue-500 text-white' });
    }
    if (language.includes('java')) {
      techStack.push({ name: 'Java', color: 'bg-red-500 text-white' });
    }
    if (language.includes('react')) {
      techStack.push({ name: 'React', color: 'bg-cyan-400 text-gray-900' });
    }
    
    // Add generic ones
    techStack.push({ name: 'Git', color: 'bg-orange-500 text-white' });
    techStack.push({ name: 'GitHub', color: 'bg-gray-700 text-white' });
    
    return techStack;
  };

  const techStack = detectTechStack();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition hover-scale"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3 animate-slideInLeft">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg animate-glow">
                  <CodeIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Bob Repo IQ</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 animate-slideInRight">
              <button
                onClick={() => setShowChat(!showChat)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 hover-lift flex items-center space-x-2"
              >
                <ChatIcon className="w-5 h-5" />
                <span>Chat with Bob</span>
              </button>
              <button
                onClick={handleExportPDF}
                disabled={exportingPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 flex items-center space-x-2 hover-lift"
              >
                <DownloadIcon className="w-5 h-5" />
                <span>{exportingPDF ? 'Exporting...' : 'Export PDF'}</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition hover-scale">
                <UserIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Repository Info Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200 hover-lift animate-scaleIn">
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
                <div className="flex items-center space-x-2 hover-scale">
                  <StarIcon className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">{repoInfo.stars.toLocaleString()} stars</span>
                </div>
                <div className="flex items-center space-x-2 hover-scale">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 12h12m-7 5h7" />
                  </svg>
                  <span className="font-medium">{repoInfo.forks.toLocaleString()} forks</span>
                </div>
                {repoInfo.language && (
                  <div className="flex items-center space-x-2 hover-scale">
                    <CodeIcon className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">{repoInfo.language}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Compact Stats Card */}
            <div className="ml-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-4 text-white shadow-lg hover-lift min-w-[140px]">
                <div className="flex items-center justify-between mb-2">
                  <DocumentIcon className="w-5 h-5 opacity-80" />
                  <ChartIcon className="w-5 h-5 opacity-80" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    {analysis.filesAnalyzed}
                  </div>
                  <div className="text-xs opacity-90">of {analysis.totalFiles} files</div>
                  <div className="mt-2 pt-2 border-t border-white border-opacity-30">
                    <div className="text-xs font-semibold">Analysis Complete</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200 hover-lift animate-fadeIn">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
              <CpuIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Tech Stack Detected</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className={`${tech.color} px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover-scale animate-scaleIn shadow-sm`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CodeIcon className="w-4 h-4" />
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200 hover-lift animate-slideInLeft">
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
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200 hover-lift animate-slideInRight">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <ChartIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Code Quality Score</h3>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse-slow">
                {analysis.codeQuality.score}
              </div>
              <div className="text-2xl text-gray-400 font-medium">/10</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-200 hover-lift">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                <h4 className="font-semibold text-gray-900 text-lg">Strengths</h4>
              </div>
              <ul className="space-y-3">
                {analysis.codeQuality.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-2 animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-5 border border-blue-200 hover-lift">
              <div className="flex items-center space-x-2 mb-4">
                <LightbulbIcon className="w-6 h-6 text-blue-600" />
                <h4 className="font-semibold text-gray-900 text-lg">Suggested Improvements</h4>
              </div>
              <ul className="space-y-3">
                {analysis.codeQuality.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start space-x-2 animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                    <LightbulbIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Issues Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 animate-fadeIn">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-red-100 p-2 rounded-lg">
              <ExclamationIcon className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Issues Found ({analysis.issues.length})
            </h3>
          </div>

          {analysis.issues.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 animate-scaleIn">
              <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-4 animate-float" />
              <p className="text-gray-700 text-lg font-medium">
                No issues found! The code looks good.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {analysis.issues.map((issue, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition duration-200 bg-gradient-to-br from-gray-50 to-white hover-lift animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
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

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
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
        <div className="mt-8 text-center animate-fadeIn">
          <p className="text-sm text-gray-500">
            Analysis powered by{' '}
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              IBM watsonx.ai Granite Model
            </span>
          </p>
        </div>
      </main>

      {/* Chat with Bob Modal */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-scaleIn">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChatIcon className="w-6 h-6" />
              <h3 className="font-bold">Chat with Bob</h3>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="h-96 overflow-y-auto p-4 bg-gray-50">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                <ChatIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="font-medium">Ask me anything about your code!</p>
                <p className="text-sm mt-2">I'm here to help you understand your repository.</p>
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div key={idx} className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'}`}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about your code..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && chatInput.trim()) {
                    setChatMessages([...chatMessages, { sender: 'user', text: chatInput }]);
                    setChatInput('');
                    setTimeout(() => {
                      setChatMessages(prev => [...prev, { 
                        sender: 'bob', 
                        text: 'I\'m analyzing your question. This feature will be fully integrated with IBM watsonx.ai soon!' 
                      }]);
                    }, 1000);
                  }
                }}
              />
              <button
                onClick={() => {
                  if (chatInput.trim()) {
                    setChatMessages([...chatMessages, { sender: 'user', text: chatInput }]);
                    setChatInput('');
                    setTimeout(() => {
                      setChatMessages(prev => [...prev, { 
                        sender: 'bob', 
                        text: 'I\'m analyzing your question. This feature will be fully integrated with IBM watsonx.ai soon!' 
                      }]);
                    }, 1000);
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition hover-scale flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardEnhanced;

// Made with Bob