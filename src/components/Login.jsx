import React, { useState } from 'react';
import { MailOutlined, LockOutlined, UserOutlined, CloseOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { login } from '../utils/auth';

export default function LoginModal({ isOpen, onClose, onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    // Very basic email check
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = login({ email: email.trim(), password: password.trim() });
      if (onLogin) {
        onLogin(user);
      }
      // Reset form and close modal
      setEmail('');
      setPassword('');
      setError('');
      onClose();
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div className="login-modal-overlay" onClick={handleClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-header">
          <div className="login-header-content">
            <div className="logo-circle">
              <MailOutlined />
            </div>
            <div>
              <h2>Sign In</h2>
              <p>Sign in to manage your disposable inbox.</p>
            </div>
          </div>
          <button className="login-close-btn" onClick={handleClose}>
            <CloseOutlined />
          </button>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">
            <span>
              <UserOutlined /> Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label className="login-label">
            <span>
              <LockOutlined /> Password
            </span>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter any password"
                style={{ paddingRight: '40px', width: '100%' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  zIndex: 1,
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </button>
            </div>
          </label>
          {error && <div className="login-error">{error}</div>}
          <button className="primary login-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
          <p className="login-hint">
            Use any email and password to continue.{' '}
            <span 
              className="text-primary font-bold text-[14px] cursor-pointer hover:underline hover:text-primary-hover transition-all duration-300"
              onClick={(e) => {
                e.preventDefault();
                if (onSwitchToSignup) {
                  onSwitchToSignup();
                }
              }}
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

