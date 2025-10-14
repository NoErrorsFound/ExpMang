import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.userName.trim()) {
      newErrors.userName = 'Username is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await apiService.register(formData);
      setSuccess('Registration successful! Redirecting to login...');
      setFormData({ userName: '', email: '', password: '' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <motion.div 
          className="auth-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="auth-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="url(#gradient2)" strokeWidth="2" fill="none"/>
              <path d="M6 21C6 17.134 8.686 14 12 14C15.314 14 18 17.134 18 21" stroke="url(#gradient2)" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="8" r="2" fill="url(#gradient2)"/>
              <defs>
                <linearGradient id="gradient2" x1="6" y1="4" x2="18" y2="21">
                  <stop offset="0%" stopColor="#f97316"/>
                  <stop offset="100%" stopColor="#fb923c"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Sign up to start tracking your expenses</p>
        </motion.div>

        {/* Form */}
        <motion.form 
          onSubmit={handleSubmit} 
          className="auth-form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {error && (
            <motion.div 
              className="error-banner"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1" fill="currentColor"/>
              </svg>
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              className="success-banner"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {success}
            </motion.div>
          )}

          <div className="form-group">
            <label htmlFor="userName" className="form-label">
              Username
            </label>
            <div 
              className={`input-wrapper ${focusedField === 'userName' ? 'focused' : ''} ${errors.userName ? 'error' : ''}`}
              onClick={() => document.getElementById('userName')?.focus()}
            >
              <input
                id="userName"
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('userName')}
                onBlur={() => setFocusedField(null)}
                placeholder="Choose a username"
                className="form-input"
                autoComplete="username"
              />
            </div>
            {errors.userName && (
              <motion.span 
                className="error-text"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.userName}
              </motion.span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <div 
              className={`input-wrapper ${focusedField === 'email' ? 'focused' : ''} ${errors.email ? 'error' : ''}`}
              onClick={() => document.getElementById('email')?.focus()}
            >
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your email"
                className="form-input"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <motion.span 
                className="error-text"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.email}
              </motion.span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div 
              className={`input-wrapper ${focusedField === 'password' ? 'focused' : ''} ${errors.password ? 'error' : ''}`}
              onClick={() => document.getElementById('password')?.focus()}
            >
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="Create a password"
                className="form-input"
                autoComplete="new-password"
              />
            </div>
            {errors.password && (
              <motion.span 
                className="error-text"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.password}
              </motion.span>
            )}
          </div>

          <motion.button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading ? (
              <span className="btn-loading">
                <svg className="spinner" width="20" height="20" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75"/>
                </svg>
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </motion.button>
        </motion.form>

        {/* Footer */}
        <motion.div 
          className="auth-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p>
            Already have an account?{' '}
            <button 
              type="button"
              onClick={() => navigate('/login')}
              className="link-button"
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <div className="auth-decoration auth-decoration--top"></div>
      <div className="auth-decoration auth-decoration--bottom"></div>
    </div>
  );
};

export default Register;
