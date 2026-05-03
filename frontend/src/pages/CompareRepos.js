import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CodeIcon,
  ArrowLeftIcon,
  GithubIcon,
  StarIcon,
  ChartIcon,
  TrophyIcon,
  CompareIcon,
  FireIcon,
  UsersIcon,
  ClockIcon,
  ExclamationIcon
} from '../components/Icons';

function CompareRepos() {
  const navigate = useNavigate();
  const [repo1Url, setRepo1Url] = useState('');
  const [repo2Url, setRepo2Url] = useState('');
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);

  const parseGitHubUrl = (url) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
      return { owner: match[1], repo: match[2].replace('.git', '') };
    }
    return null;
  };

  const handleCompare = async () => {
    const parsed1 = parseGitHubUrl(repo1Url);
    const parsed2 = parseGitHubUrl(repo2Url);

    if (!parsed1 || !parsed2) {
      alert('Please enter valid GitHub repository URLs');
      return;
    }

    setComparing(true);

    // Simulate comparison (in real implementation, call backend API)
    setTimeout(() => {
      const mockComparison = {
        repo1: {
          name: `${parsed1.owner}/${parsed1.repo}`,
          healthScore: Math.floor(Math.random() * 3) + 7,
          techStack: ['React', 'Node.js', 'MongoDB', 'Express'],
          issuesCount: Math.floor(Math.random() * 20) + 5,
          stars: Math.floor(Math.random() * 5000) + 1000,
          forks: Math.floor(Math.random() * 1000) + 100,
          contributors: Math.floor(Math.random() * 50) + 10,
          lastUpdate: '2 days ago'
        },
        repo2: {
          name: `${parsed2.owner}/${parsed2.repo}`,
          healthScore: Math.floor(Math.random() * 3) + 7,
          techStack: ['Vue.js', 'Python', 'PostgreSQL', 'Django'],
          issuesCount: Math.floor(Math.random() * 20) + 5,
          stars: Math.floor(Math.random() * 5000) + 1000,
          forks: Math.floor(Math.random() * 1000) + 100,
          contributors: Math.floor(Math.random() * 50) + 10,
          lastUpdate: '5 days ago'
        }
      };

      // Determine winner
      const score1 = mockComparison.repo1.healthScore * 10 - mockComparison.repo1.issuesCount;
      const score2 = mockComparison.repo2.healthScore * 10 - mockComparison.repo2.issuesCount;
      
      mockComparison.winner = score1 > score2 ? 'repo1' : score2 > score1 ? 'repo2' : 'tie';
      mockComparison.reason = score1 > score2 
        ? 'Repository 1 has a higher health score and fewer critical issues'
        : score2 > score1
        ? 'Repository 2 has a higher health score and fewer critical issues'
        : 'Both repositories have similar quality metrics';

      setComparisonResult(mockComparison);
      setComparing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
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
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-lg animate-glow">
                  <CompareIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Compare Repositories</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6 border border-gray-200 animate-scaleIn">
          <div className="flex items-center space-x-3 mb-6">
            <CompareIcon className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Repository Battle</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="animate-slideInLeft">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Repository 1 URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GithubIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={repo1Url}
                  onChange={(e) => setRepo1Url(e.target.value)}
                  placeholder="https://github.com/owner/repo1"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                />
              </div>
            </div>
            
            <div className="animate-slideInRight">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Repository 2 URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GithubIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={repo2Url}
                  onChange={(e) => setRepo2Url(e.target.value)}
                  placeholder="https://github.com/owner/repo2"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleCompare}
            disabled={comparing || !repo1Url || !repo2Url}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-lg transition duration-200 disabled:opacity-50 hover-lift flex items-center justify-center space-x-2"
          >
            {comparing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyzing Repositories...</span>
              </>
            ) : (
              <>
                <FireIcon className="w-5 h-5" />
                <span>Compare Now</span>
              </>
            )}
          </button>
        </div>

        {/* Comparison Results */}
        {comparisonResult && (
          <div className="space-y-6 animate-fadeIn">
            {/* Winner Declaration */}
            <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-xl shadow-lg p-8 text-white text-center animate-scaleIn">
              <TrophyIcon className="w-16 h-16 mx-auto mb-4 animate-float" />
              <h2 className="text-3xl font-bold mb-2">
                {comparisonResult.winner === 'tie' 
                  ? "It's a Tie!" 
                  : `Winner: ${comparisonResult.winner === 'repo1' ? comparisonResult.repo1.name : comparisonResult.repo2.name}`}
              </h2>
              <p className="text-lg opacity-90">{comparisonResult.reason}</p>
            </div>

            {/* Side by Side Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Repository 1 */}
              <div className={`bg-white rounded-xl shadow-md p-6 border-2 ${comparisonResult.winner === 'repo1' ? 'border-yellow-400 ring-2 ring-yellow-200' : 'border-gray-200'} hover-lift animate-slideInLeft`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <GithubIcon className="w-6 h-6 text-gray-700" />
                    <h3 className="text-xl font-bold text-gray-900">{comparisonResult.repo1.name}</h3>
                  </div>
                  {comparisonResult.winner === 'repo1' && (
                    <TrophyIcon className="w-8 h-8 text-yellow-500 animate-float" />
                  )}
                </div>

                {/* Health Score */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ChartIcon className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-700">Health Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold text-blue-600">{comparisonResult.repo1.healthScore}</span>
                      <span className="text-gray-500">/10</span>
                    </div>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CodeIcon className="w-5 h-5 text-gray-600" />
                    <h4 className="text-sm font-semibold text-gray-700">Tech Stack</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {comparisonResult.repo1.techStack.map((tech, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <ExclamationIcon className="w-4 h-4" />
                      <span>Issues</span>
                    </div>
                    <span className="font-semibold text-gray-900">{comparisonResult.repo1.issuesCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <StarIcon className="w-4 h-4" />
                      <span>Stars</span>
                    </div>
                    <span className="font-semibold text-gray-900">{comparisonResult.repo1.stars.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 12h12m-7 5h7" />
                      </svg>
                      <span>Forks</span>
                    </div>
                    <span className="font-semibold text-gray-900">{comparisonResult.repo1.forks.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <UsersIcon className="w-4 h-4" />
                      <span>Contributors</span>
                    </div>
                    <span className="font-semibold text-gray-900">{comparisonResult.repo1.contributors}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <ClockIcon className="w-4 h-4" />
                      <span>Last Update</span>
                    </div>
                    <span className="font-semibold text-gray-900">{comparisonResult.repo1.lastUpdate}</span>
                  </div>
                </div>
              </div>

              {/* Repository 2 */}
              <div className={`bg-white rounded-xl shadow-md p-6 border-2 ${comparisonResult.winner === 'repo2' ? 'border-yellow-400 ring-2 ring-yellow-200' : 'border-gray-200'} hover-lift animate-slideInRight`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <GithubIcon className="w-6 h-6 text-gray-700" />
                    <h3 className="text-xl font-bold text-gray-900">{comparisonResult.repo2.name}</h3>
                  </div>
                  {comparisonResult.winner === 'repo2' && (
                    <TrophyIcon className="w-8 h-8 text-yellow-500 animate-float" />
                  )}
                </div>

                {/* Health Score */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ChartIcon className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-semibold text-gray-700">Health Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold text-purple-600">{comparisonResult.repo2.healthScore}</span>
                      <span className="text-gray-500">/10</span>
                    </div>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CodeIcon className="w-5 h-5 text-gray-600" />
                    <h4 className="text-sm font-semibold text-gray-700">Tech Stack</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {comparisonResult.repo2.techStack.map((tech, idx) => (
                      <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <ExclamationIcon className="w-4 h-4" />
                      <span>Issues</span>
                    </div>
                    <span className="font-semibold text-gray-900">{comparisonResult.repo2.issuesCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <StarIcon className="w-4 h-4" />
                      <span>Stars</span>
                    </div>
                    <span className="font-semibold text-gray-900">{comparisonResult.repo2.stars.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 12h12m-7 5h7" />
                      </svg>
                      <span>Forks</span>
                    </div>
                    <span className="font-semibold text-gray-900">{comparisonResult.repo2.forks.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <UsersIcon className="w-4 h-4" />
                      <span>Contributors</span>
                    </div>
                    <span className="font-semibold text-gray-900">{comparisonResult.repo2.contributors}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <ClockIcon className="w-4 h-4" />
                      <span>Last Update</span>
                    </div>
                    <span className="font-semibold text-gray-900">{comparisonResult.repo2.lastUpdate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center animate-fadeIn">
          <p className="text-sm text-gray-500">
            Comparison powered by{' '}
            <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              IBM watsonx.ai Granite Model
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}

export default CompareRepos;

// Made with Bob