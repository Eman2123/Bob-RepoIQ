import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRepoInfo, analyzeRepository } from '../services/api';
import {
  CodeIcon,
  GithubIcon,
  SearchIcon,
  ChartIcon,
  LightbulbIcon,
  SpinnerIcon,
  ArrowLeftIcon
} from '../components/Icons';

function LandingPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate URL
      if (!repoUrl.includes('github.com')) {
        throw new Error('Please enter a valid GitHub repository URL');
      }

      // Get repository information
      const repoInfo = await getRepoInfo(repoUrl);
      
      // Analyze repository
      const analysis = await analyzeRepository(
        repoInfo.owner,
        repoInfo.repo,
        repoInfo.defaultBranch
      );

      // Navigate to dashboard with analysis data
      navigate('/dashboard', { 
        state: { 
          repoInfo,
          analysis 
        } 
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to analyze repository');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                <CodeIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bob Repo IQ
              </h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Understand Any Codebase
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Paste a GitHub repository URL and Bob will analyze the code, 
            explain what it does in plain English, and identify any issues.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label 
                htmlFor="repoUrl" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                GitHub Repository URL
              </label>
              <input
                type="text"
                id="repoUrl"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <SpinnerIcon className="w-5 h-5" />
                  <span>Analyzing Repository...</span>
                </>
              ) : (
                <>
                  <SearchIcon className="w-5 h-5" />
                  <span>Analyze Repository</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <ChartIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Simple Explanations
            </h3>
            <p className="text-gray-600">
              Get plain English descriptions of what the code does
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Issue Detection
            </h3>
            <p className="text-gray-600">
              Identify broken or problematic code areas automatically
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <LightbulbIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Fix Suggestions
            </h3>
            <p className="text-gray-600">
              Get actionable recommendations to improve your code
            </p>
          </div>
        </div>

        {/* Powered By */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
            <GithubIcon className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-700">
              Powered by <span className="font-semibold text-blue-600">IBM watsonx.ai</span> Granite Model
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;

// Made with Bob
