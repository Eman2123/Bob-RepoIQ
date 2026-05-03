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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden particle-bg">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-pulse-slow"></div>
      </div>

      {/* Navigation */}
      <nav className="glass-strong shadow-lg sticky top-0 z-50 animate-slideInDown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-glow">
                <CodeIcon className="w-6 h-6 text-white animate-bounce" />
              </div>
              <span className="text-xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 animate-fadeIn">Bob Repo IQ</span>
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
                    className="gradient-cosmic hover:animate-gradient text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 transform hover:scale-110 hover:shadow-2xl hover:rotate-2 active:scale-95 hover-glow"
                  >
                    <span>Compare</span>
                  </button>
                  <button
                    onClick={() => navigate('/analyze')}
                    className="gradient-ocean hover:animate-gradient text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 transform hover:scale-110 hover:shadow-2xl hover:-rotate-2 active:scale-95 hover-glow"
                  >
                    <span>Analyze Repo</span>
                    <ArrowRightIcon className="w-4 h-4 animate-bounce" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-gray-900 font-medium transition-all duration-200 hover:scale-105"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-gray-700 hover:text-gray-900 font-medium transition-all duration-200 hover:scale-105"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    <span>Get Started</span>
                    <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
        <div className="text-center animate-zoomIn">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8 transform hover:scale-110 hover:rotate-2 transition-all duration-300 hover-glow animate-float">
            <GithubIcon className="w-4 h-4 animate-rotate" />
            <span>Powered by IBM watsonx.ai Granite Model</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight animate-slideInUp">
            Translate Code into
            <span className="block text-transparent bg-clip-text gradient-animated animate-gradient">
              Plain English
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Understand any GitHub repository instantly. Bob analyzes your codebase and explains 
            what it does, identifies issues, and suggests fixes in business-friendly language.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up animation-delay-200">
            {loggedIn ? (
              <>
                <button
                  onClick={() => navigate('/analyze')}
                  className="w-full sm:w-auto gradient-animated text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-2xl transform hover:scale-110 hover:rotate-2 active:scale-95 hover-glow neon-border"
                >
                  <span className="animate-pulse-slow">Analyze Repository</span>
                  <ArrowRightIcon className="w-5 h-5 animate-bounce" />
                </button>
                <div className="text-center">
                  <p className="text-gray-600">Welcome back, <span className="font-semibold text-blue-600">{user?.name}</span>!</p>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full sm:w-auto gradient-animated text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-2xl transform hover:scale-110 hover:rotate-2 active:scale-95 hover-glow neon-border"
                >
                  <span className="animate-pulse-slow">Start Analyzing</span>
                  <ArrowRightIcon className="w-5 h-5 animate-bounce" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto glass-strong text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 border-2 border-blue-200 hover:border-blue-400 transform hover:scale-110 hover:-rotate-2 active:scale-95 hover-glow"
                >
                  View Demo
                </button>
              </>
            )}
          </div>
        </div>

        {/* Fancy Dashboard Preview Box */}
        <div className="mt-16 relative animate-zoomIn animation-delay-4000">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 transform hover:scale-[1.05] hover:rotate-1 transition-all duration-500 card-3d hover-glow">
            {/* Header Section */}
            <div className="gradient-animated p-6 animate-gradient">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg animate-bounce hover:animate-rotate">
                    <ChartIcon className="w-8 h-8 animate-pulse-slow" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold animate-fadeIn">Dashboard Preview</h3>
                    <p className="text-blue-100 text-sm animate-slideInLeft">Real-time Code Analysis</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full animate-pulse-slow">
                    <span className="font-semibold">Live</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Stat Card 1 */}
                <div className="bg-white rounded-xl p-6 shadow-lg hover-lift hover-glow animate-slideInLeft card-3d">
                  <div className="flex items-center justify-between mb-4">
                    <div className="gradient-ocean p-3 rounded-lg animate-float">
                      <CodeIcon className="w-6 h-6 text-white animate-wiggle" />
                    </div>
                    <span className="text-3xl font-bold text-blue-600 animate-heartbeat">247</span>
                  </div>
                  <p className="text-gray-600 font-medium">Files Analyzed</p>
                  <div className="mt-2 flex items-center text-green-600 text-sm">
                    <CheckCircleIcon className="w-4 h-4 mr-1 animate-bounce" />
                    <span>Complete</span>
                  </div>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-white rounded-xl p-6 shadow-lg hover-lift hover-glow animate-zoomIn card-3d">
                  <div className="flex items-center justify-between mb-4">
                    <div className="gradient-cosmic p-3 rounded-lg animate-float">
                      <ChartIcon className="w-6 h-6 text-white animate-wiggle" />
                    </div>
                    <span className="text-3xl font-bold text-purple-600 animate-heartbeat">8.5</span>
                  </div>
                  <p className="text-gray-600 font-medium">Quality Score</p>
                  <div className="mt-2 flex items-center text-purple-600 text-sm">
                    <StarIcon className="w-4 h-4 mr-1 animate-bounce" />
                    <span>Excellent</span>
                  </div>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-white rounded-xl p-6 shadow-lg hover-lift hover-glow animate-slideInRight card-3d">
                  <div className="flex items-center justify-between mb-4">
                    <div className="gradient-mint p-3 rounded-lg animate-float">
                      <CheckCircleIcon className="w-6 h-6 text-white animate-wiggle" />
                    </div>
                    <span className="text-3xl font-bold text-green-600 animate-heartbeat">12</span>
                  </div>
                  <p className="text-gray-600 font-medium">Issues Found</p>
                  <div className="mt-2 flex items-center text-green-600 text-sm">
                    <LightbulbIcon className="w-4 h-4 mr-1 animate-bounce" />
                    <span>Fixable</span>
                  </div>
                </div>
              </div>

              {/* Visual Representation */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover-lift hover-glow animate-flipIn">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-900 animate-slideInLeft">Code Health Overview</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-slow"></div>
                    <span className="text-sm text-gray-600 animate-fadeIn">Active</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center animate-slideInLeft">
                    <span className="text-sm text-gray-600 w-32">Security</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden hover-scale">
                      <div className="gradient-mint h-full rounded-full animate-shimmer" style={{width: '85%'}}></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 ml-3 animate-heartbeat">85%</span>
                  </div>
                  <div className="flex items-center animate-slideInLeft animation-delay-200">
                    <span className="text-sm text-gray-600 w-32">Performance</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden hover-scale">
                      <div className="gradient-ocean h-full rounded-full animate-shimmer" style={{width: '92%'}}></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 ml-3 animate-heartbeat">92%</span>
                  </div>
                  <div className="flex items-center animate-slideInLeft animation-delay-400">
                    <span className="text-sm text-gray-600 w-32">Maintainability</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden hover-scale">
                      <div className="gradient-cosmic h-full rounded-full animate-shimmer" style={{width: '78%'}}></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 ml-3 animate-heartbeat">78%</span>
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
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition hover-scale flex items-center space-x-2">
                <span>Try Now</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:scale-105 hover:-translate-y-2">
            <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6 transform hover:rotate-12 transition-transform duration-300">
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
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:scale-105 hover:-translate-y-2">
            <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6 transform hover:rotate-12 transition-transform duration-300">
              <CodeIcon className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Plain English Explanations
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Get clear, jargon-free descriptions of what the code does and how it works. 
              Perfect for business decisions.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:scale-105 hover:-translate-y-2">
            <div className="bg-red-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6 transform hover:rotate-12 transition-transform duration-300">
              <SearchIcon className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Issue Detection
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Automatically identify broken code, security vulnerabilities, and problematic 
              areas that need attention.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:scale-105 hover:-translate-y-2">
            <div className="bg-yellow-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6 transform hover:rotate-12 transition-transform duration-300">
              <LightbulbIcon className="w-7 h-7 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Smart Suggestions
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Receive actionable recommendations and fix suggestions explained in simple, 
              understandable terms.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:scale-105 hover:-translate-y-2">
            <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6 transform hover:rotate-12 transition-transform duration-300">
              <ChartIcon className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Quality Scoring
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Get an overall code quality score with detailed breakdowns of strengths 
              and areas for improvement.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:scale-105 hover:-translate-y-2">
            <div className="bg-indigo-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6 transform hover:rotate-12 transition-transform duration-300">
              <GithubIcon className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              PDF Reports
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Export comprehensive analysis reports as PDF for sharing with your team 
              or stakeholders.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to understand any codebase
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 transform hover:rotate-12 transition-transform duration-300 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Paste Repository URL</h3>
              <p className="text-gray-600">
                Copy any public GitHub repository URL and paste it into Bob
              </p>
            </div>

            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 transform hover:rotate-12 transition-transform duration-300 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Analysis</h3>
              <p className="text-gray-600">
                IBM watsonx.ai Granite model analyzes the entire codebase
              </p>
            </div>

            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 transform hover:rotate-12 transition-transform duration-300 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Insights</h3>
              <p className="text-gray-600">
                View plain English explanations, issues, and recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Understand Your Code?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of business owners and managers who use Bob to make informed decisions about their software projects
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 inline-flex items-center space-x-2 shadow-lg transform hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            <span>Get Started Free</span>
            <ArrowRightIcon className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <CodeIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Bob Repo IQ</span>
              </div>
              <p className="text-gray-400 mb-4">
                Translating technical code into plain English for business owners and non-technical stakeholders.
              </p>
              <p className="text-sm text-gray-500">
                Powered by IBM watsonx.ai Granite Model
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 Bob Repo IQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;

// Made with Bob
