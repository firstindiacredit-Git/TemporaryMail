import React, { useState } from 'react';
import { MailOutlined, LockOutlined, UserOutlined, CloseOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { signup } from '../utils/auth';

export default function SignupModal({ isOpen, onClose, onSignup, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('All fields are required.');
      return;
    }

    // Very basic email check
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Basic password length check
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = signup({ email: email.trim(), password });
      if (onSignup) {
        onSignup(user);
      }
      // Reset form and close modal
      setEmail('');
      setPassword('');
      setConfirmPassword('');
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
    setConfirmPassword('');
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
              <h2>Sign Up</h2>
              <p>Create an account to manage your disposable inbox.</p>
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
                placeholder="Enter a password (min 6 characters)"
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
          <label className="login-label">
            <span>
              <LockOutlined /> Confirm Password
            </span>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                style={{ paddingRight: '40px', width: '100%' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </button>
            </div>
          </label>
          {error && <div className="login-error">{error}</div>}
          <button className="primary login-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </button>
          <p className="login-hint">
            Sign up with any email and password to continue.{' '}
            Already have an account?{' '}
            <span 
              className="text-primary font-bold text-[14px] cursor-pointer hover:underline hover:text-primary-hover transition-all duration-300"
              onClick={(e) => {
                e.preventDefault();
                if (onSwitchToLogin) {
                  onSwitchToLogin();
                }
              }}
            >
              Sign in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

