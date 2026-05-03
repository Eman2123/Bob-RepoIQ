import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserIcon, MailIcon, LockIcon, GithubIcon, CodeIcon, ArrowRightIcon } from '../components/Icons';
import { signUp } from '../services/api';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.name, formData.email, formData.password);
      // Navigate to home page after successful signup
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ 
        submit: error.response?.data?.message || 'Failed to create account. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 right-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="max-w-md w-full animate-fade-in-up">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <CodeIcon className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Bob Repo IQ</span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-600">Start analyzing repositories in minutes</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transform hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-white/90">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="transform hover:scale-[1.02] transition-transform duration-200">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-300 group-focus-within:scale-110">
                    <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 hover:border-blue-300`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 animate-shake">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="transform hover:scale-[1.02] transition-transform duration-200">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-300 group-focus-within:scale-110">
                    <MailIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 hover:border-blue-300`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 animate-shake">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="transform hover:scale-[1.02] transition-transform duration-200">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-300 group-focus-within:scale-110">
                    <LockIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 hover:border-blue-300`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 animate-shake">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="transform hover:scale-[1.02] transition-transform duration-200">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-300 group-focus-within:scale-110">
                    <LockIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 hover:border-blue-300`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 animate-shake">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-shake">
                  <p className="text-sm text-red-800">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] hover:shadow-xl active:scale-95"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRightIcon className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <button
                type="button"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-[1.02] hover:shadow-xl active:scale-95"
              >
                <GithubIcon className="w-5 h-5" />
                <span>Sign up with GitHub</span>
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 transition-all duration-200 hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-gray-500">
            By signing up, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline transition-all duration-200">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline transition-all duration-200">Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Right Side - Info */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 to-indigo-600 p-12 items-center justify-center relative overflow-hidden">
        {/* 3D floating elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-20 h-20 bg-white/10 rounded-lg transform -rotate-12 animate-float"></div>
          <div className="absolute bottom-40 left-20 w-16 h-16 bg-white/10 rounded-lg transform rotate-12 animate-float animation-delay-2000"></div>
          <div className="absolute top-1/2 right-10 w-12 h-12 bg-white/10 rounded-lg transform -rotate-45 animate-float animation-delay-4000"></div>
        </div>

        <div className="max-w-md text-white relative z-10 animate-fade-in-up animation-delay-200">
          <h2 className="text-4xl font-bold mb-6 transform hover:scale-105 transition-transform duration-300">
            Join thousands of users
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Understand any codebase in plain English. Make informed decisions about your software projects.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 transform hover:scale-105 hover:translate-x-2 transition-all duration-300">
              <div className="bg-white/20 p-2 rounded-lg mt-1 transform hover:rotate-12 transition-transform duration-300">
                <CodeIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Instant Analysis</h3>
                <p className="text-blue-100 text-sm">Get comprehensive code analysis in seconds</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 transform hover:scale-105 hover:translate-x-2 transition-all duration-300">
              <div className="bg-white/20 p-2 rounded-lg mt-1 transform hover:rotate-12 transition-transform duration-300">
                <GithubIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">GitHub Integration</h3>
                <p className="text-blue-100 text-sm">Works with any public GitHub repository</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 transform hover:scale-105 hover:translate-x-2 transition-all duration-300">
              <div className="bg-white/20 p-2 rounded-lg mt-1 transform hover:rotate-12 transition-transform duration-300">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Business Friendly</h3>
                <p className="text-blue-100 text-sm">Plain English explanations for everyone</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

// Made with Bob
