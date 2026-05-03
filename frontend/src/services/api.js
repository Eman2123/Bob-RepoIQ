import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication API endpoints
export const signUp = async (name, email, password) => {
  const response = await api.post('/auth/signup', { name, email, password });
  if (response.data.token) {
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export const verifyToken = async () => {
  const response = await api.get('/auth/verify');
  return response.data;
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

// GitHub API endpoints
export const getRepoInfo = async (repoUrl) => {
  const response = await api.post('/github/repo-info', { repoUrl });
  return response.data;
};

export const getRepoTree = async (owner, repo, branch = 'main') => {
  const response = await api.post('/github/repo-tree', { owner, repo, branch });
  return response.data;
};

// Analysis API endpoints
export const analyzeRepository = async (owner, repo, branch = 'main') => {
  const response = await api.post('/analysis/analyze', { owner, repo, branch });
  return response.data;
};

export const generateReport = async (analysisData) => {
  const response = await api.post('/analysis/generate-report',
    { analysisData },
    { responseType: 'blob' }
  );
  return response.data;
};

// Chat API endpoints
export const sendChatMessage = async (message, codeContext = '', chatHistory = []) => {
  const response = await api.post('/chat/message', { message, codeContext, chatHistory });
  return response.data;
};

export const explainCode = async (code, language = 'javascript') => {
  const response = await api.post('/chat/explain', { code, language });
  return response.data;
};

// Comparison API endpoints
export const compareRepositories = async (repo1Url, repo2Url) => {
  const response = await api.post('/comparison/compare', { repo1Url, repo2Url });
  return response.data;
};

export const detectTechStack = async (owner, repo, branch = 'main') => {
  const response = await api.get(`/comparison/tech-stack/${owner}/${repo}?branch=${branch}`);
  return response.data;
};

export default api;

// Made with Bob
