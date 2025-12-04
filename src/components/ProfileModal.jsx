import React, { useState, useRef, useEffect } from 'react';
import { UserOutlined, LockOutlined, CloseOutlined, CameraOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { updateUser, getCurrentUser } from '../utils/auth';

export default function ProfileModal({ isOpen, onClose, user, onUpdate }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Update avatar when user changes or modal opens
  useEffect(() => {
    if (isOpen && user) {
      setAvatar(user?.avatar || '');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB.');
      return;
    }

    // Read file as data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
      setError('');
      setSuccess('Avatar updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const currentUser = getCurrentUser();
    const hasExistingPassword = currentUser?.password;

    // If user has existing password, require current password
    if (hasExistingPassword) {
      if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
        setError('All password fields are required.');
        return;
      }
      // Verify current password
      if (currentPassword !== currentUser.password) {
        setError('Current password is incorrect.');
        return;
      }
    } else {
      // If no password exists, only require new password fields
      if (!newPassword.trim() || !confirmPassword.trim()) {
        setError('New password fields are required.');
        return;
      }
    }

    // Password confirmation check
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    // Basic password length check
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    // Check if new password is same as current (only if password exists)
    if (hasExistingPassword && currentPassword === newPassword) {
      setError('New password must be different from current password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedUser = updateUser({ password: newPassword });
      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (onUpdate) {
        onUpdate(updatedUser);
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProfile = () => {
    try {
      const updatedUser = updateUser({ avatar });
      setSuccess('Profile updated successfully!');
      if (onUpdate) {
        onUpdate(updatedUser);
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <div className="login-modal-overlay" onClick={handleClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-header">
          <div className="login-header-content">
            <div className="logo-circle">
              <UserOutlined />
            </div>
            <div>
              <h2>Profile Settings</h2>
              <p>Manage your profile and password</p>
            </div>
          </div>
          <button className="login-close-btn" onClick={handleClose}>
            <CloseOutlined />
          </button>
        </div>

        <div className="login-form" style={{ gap: '24px' }}>
          {/* Avatar Section */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
              Profile Avatar
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--bg-secondary)',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onClick={handleAvatarClick}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <UserOutlined style={{ fontSize: '40px', color: 'var(--text-secondary)' }} />
                )}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid white',
                  }}
                >
                  <CameraOutlined style={{ fontSize: '12px', color: 'white' }} />
                </div>
              </div>
              <div>
                <button
                  type="button"
                  className="secondary"
                  onClick={handleAvatarClick}
                  style={{ marginBottom: '4px' }}
                >
                  <CameraOutlined />
                  <span>Change Avatar</span>
                </button>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                  Click to upload a new avatar image
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Change Password Section */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
              {getCurrentUser()?.password ? 'Change Password' : 'Set Password'}
            </label>
            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {getCurrentUser()?.password && (
                <label className="login-label">
                  <span>
                    <LockOutlined /> Current Password
                  </span>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    style={{ paddingRight: '40px', width: '100%' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
                    {showCurrentPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </button>
                </div>
              </label>
              )}
              <label className="login-label">
                <span>
                  <LockOutlined /> New Password
                </span>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    style={{ paddingRight: '40px', width: '100%' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
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
                    {showNewPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </button>
                </div>
              </label>
              <label className="login-label">
                <span>
                  <LockOutlined /> Confirm New Password
                </span>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
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
              {success && <div style={{ padding: '8px 12px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '8px', fontSize: '12px' }}>{success}</div>}
              <button className="primary login-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Save Profile Button */}
          {avatar !== (user?.avatar || '') && (
            <button className="primary login-submit" onClick={handleSaveProfile}>
              Save Profile Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

