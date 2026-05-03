import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GithubIcon, CodeIcon, SearchIcon, LightbulbIcon, ChartIcon, ArrowRightIcon, UserIcon, StarIcon, CheckCircleIcon } from '../components/Icons';
import { getCurrentUser, isAuthenticated, logout } from '../services/api';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <CodeIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Bob Repo IQ</span>
            </div>
            <div className="flex items-center space-x-4">
              {loggedIn ? (
                <>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <UserIcon className="w-5 h-5" />
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <button
                    onClick={() => navigate('/compare')}
                    className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Compare
                  </button>
                  <button
                    onClick={() => navigate('/analyze')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <span>Analyze Repo</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <span>Get Started</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <GithubIcon className="w-4 h-4" />
            <span>Powered by IBM watsonx.ai Granite Model</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Translate Code into
            <span className="block text-blue-600">
              Plain English
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Understand any GitHub repository instantly. Bob analyzes your codebase and explains 
            what it does, identifies issues, and suggests fixes in business-friendly language.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {loggedIn ? (
              <>
                <button
                  onClick={() => navigate('/analyze')}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2 shadow-lg"
                >
                  <span>Analyze Repository</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
                <div className="text-center">
                  <p className="text-gray-600">Welcome back, <span className="font-semibold text-blue-600">{user?.name}</span>!</p>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2 shadow-lg"
                >
                  <span>Start Analyzing</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors border-2 border-gray-200"
                >
                  View Demo
                </button>
              </>
            )}
          </div>
        </div>

        {/* Dashboard Preview Box */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* Header Section */}
            <div className="bg-blue-600 p-6">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <ChartIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Dashboard Preview</h3>
                    <p className="text-blue-100 text-sm">Real-time Code Analysis</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-white/20 px-4 py-2 rounded-full">
                    <span className="font-semibold">Live</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Stat Card 1 */}
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <CodeIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-3xl font-bold text-blue-600">247</span>
                  </div>
                  <p className="text-gray-600 font-medium">Files Analyzed</p>
                  <div className="mt-2 flex items-center text-green-600 text-sm">
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    <span>Complete</span>
                  </div>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <ChartIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-3xl font-bold text-purple-600">8.5</span>
                  </div>
                  <p className="text-gray-600 font-medium">Quality Score</p>
                  <div className="mt-2 flex items-center text-purple-600 text-sm">
                    <StarIcon className="w-4 h-4 mr-1" />
                    <span>Excellent</span>
                  </div>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-3xl font-bold text-green-600">12</span>
                  </div>
                  <p className="text-gray-600 font-medium">Issues Found</p>
                  <div className="mt-2 flex items-center text-green-600 text-sm">
                    <LightbulbIcon className="w-4 h-4 mr-1" />
                    <span>Fixable</span>
                  </div>
                </div>
              </div>

              {/* Visual Representation */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-900">Code Health Overview</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Active</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 w-32">Security</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{width: '85%'}}></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 ml-3">85%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 w-32">Performance</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{width: '92%'}}></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 ml-3">92%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 w-32">Maintainability</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{width: '78%'}}></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 ml-3">78%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 px-8 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-600">
                <GithubIcon className="w-5 h-5" />
                <span className="text-sm">Powered by IBM watsonx.ai</span>
              </div>
              <button 
                onClick={() => navigate('/signup')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <span>Try Now</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Understand Code
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed for business owners, managers, and non-technical stakeholders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <SearchIcon className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Instant Analysis
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Simply paste a GitHub repository URL and get comprehensive analysis in seconds. 
              No technical knowledge required.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <CodeIcon className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Plain English Explanations
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Get clear, jargon-free explanations of what the code does, how it works, 
              and what problems it might have.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <LightbulbIcon className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Smart Recommendations
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Receive actionable suggestions for improvements, security fixes, 
              and best practices to enhance your codebase.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="bg-yellow-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <ChartIcon className="w-7 h-7 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Tech Stack Detection
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Automatically identify all technologies, frameworks, and libraries used in the repository.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="bg-pink-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <GithubIcon className="w-7 h-7 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Repository Comparison
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Compare two repositories side-by-side to see which one is better maintained and more reliable.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="bg-indigo-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <StarIcon className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Chat with Bob
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Ask questions about your code and get instant answers powered by IBM watsonx.ai.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <CodeIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Bob Repo IQ</span>
            </div>
            <p className="text-gray-400 mb-6">
              Powered by IBM watsonx.ai Granite Model
            </p>
            <p className="text-gray-500 text-sm">
              © 2026 Bob Repo IQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;

// Made with Bob
