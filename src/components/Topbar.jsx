import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReloadOutlined, CopyOutlined, CheckOutlined, LoadingOutlined, MailOutlined, SettingOutlined, HistoryOutlined, CodeOutlined, UserOutlined, LogoutOutlined, LoginOutlined, SaveOutlined, UserAddOutlined, ProfileOutlined } from '@ant-design/icons';
import { formatRelativeTime } from '../utils/helpers';

export default function Topbar({ user, emailAddress, mailbox, onGenerate, onRefresh, isRefreshing, isGenerating, canRefresh, onShowHistory, onLogout, onShowLogin, onShowSignup, onShowSaveLogin, onShowProfile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [copyStatus, setCopyStatus] = useState({ copied: false });
  const [expiryTime, setExpiryTime] = useState("--");
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const settingsRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    if (!mailbox) {
      setExpiryTime("--");
      return;
    }

    const tick = () => {
      setExpiryTime(formatRelativeTime(mailbox.expiresAt));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [mailbox]);

  const handleCopy = async () => {
    if (!emailAddress) return;
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopyStatus({ copied: true });
      setTimeout(() => {
        setCopyStatus({ copied: false });
      }, 1500);
    } catch {
      alert("Clipboard copy failed");
    }
  };

  const handleLogoutClick = () => {
    setShowUserMenu(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    if (onShowProfile) {
      onShowProfile();
    }
  };

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showSettings || showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings, showUserMenu]);

  const handleHistoryClick = () => {
    setShowSettings(false);
    if (onShowHistory) {
      onShowHistory();
    }
  };

  const handleApiDocsClick = () => {
    setShowSettings(false);
    navigate('/api-docs');
  };

  const handleSaveLoginClick = () => {
    setShowSettings(false);
    if (onShowSaveLogin) {
      onShowSaveLogin();
    }
  };

  const handleLoginClick = () => {
    setShowSettings(false);
    if (onShowLogin) {
      onShowLogin();
    }
  };

  const handleUserClick = () => {
    setShowUserMenu(!showUserMenu);
    setShowSettings(false);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="logo-circle">
          <MailOutlined />
        </div>
        <div className="topbar-title">
          <h1>Temporary Mail</h1>
          <p>Disposable inbox with mail layout after the refresh the page the mail will be changed</p>
        </div>
      </div>
      <div className="topbar-center">
        <div className="search-bar fake-search">
          <div className="search-content">
            {isGenerating && !emailAddress ? (
              <span className="search-placeholder" data-tutorial="email-address" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LoadingOutlined spin />
                <span>Generating mail...</span>
              </span>
            ) : (
              <span className="search-placeholder" data-tutorial="email-address">
                {emailAddress || "No address generated"}
              </span>
            )}
          </div>
          {emailAddress && (
            <button
              className="search-copy-btn"
              onClick={handleCopy}
              title={copyStatus.copied ? "Copied!" : "Copy address"}
            >
              {copyStatus.copied ? <CheckOutlined /> : <CopyOutlined />}
              <span>{copyStatus.copied ? "Copied!" : "Copy"}</span>
            </button>
          )}
        </div>
        {emailAddress && expiryTime !== "--" && (
          <span className="expiry-time" data-tutorial="expiry-time">Expires: {expiryTime}</span>
        )}
      </div>
      <div className="topbar-right">
        
        <button 
          className="primary" 
          onClick={onGenerate} 
          disabled={isGenerating}
          data-tutorial="generate-btn"
        >
          {isGenerating ? <LoadingOutlined spin /> : <ReloadOutlined />}
          <span>{isGenerating ? 'Generating...' : 'Generate Mail'}</span>
        </button>
        <button 
          className="secondary" 
          onClick={onRefresh}
          disabled={!canRefresh || isRefreshing}
          title={isRefreshing ? "Refreshing..." : "Refresh"}
          data-tutorial="refresh-btn"
        >
          {isRefreshing ? <LoadingOutlined spin /> : <ReloadOutlined />}
        </button>
        <div className="settings-container" ref={settingsRef}>
          <button 
            className="secondary" 
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            <SettingOutlined />
          </button>
          {showSettings && (
            <div className="settings-dropdown">
             
              <button className="settings-item" onClick={handleHistoryClick}>
                <HistoryOutlined />
                <span>History</span>
              </button>
              <button className="settings-item" onClick={handleApiDocsClick}>
                <CodeOutlined />
                <span>API Docs</span>
              </button>
              <button className="settings-item" onClick={handleSaveLoginClick}>
                <SaveOutlined />
                <span>Save Mail Details</span>
              </button>
            </div>
          )}
        </div>
        {!user && (
          <>
            
            <button className="secondary login-btn" onClick={handleLoginClick}>
              <LoginOutlined />
              <span>Login</span>
            </button>
          </>
        )}
        {user && (
          <div className="settings-container" ref={userRef}>
            <button className="secondary user-btn" onClick={handleUserClick} style={{ position: 'relative' }}>
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Avatar" 
                  style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    objectFit: 'cover' 
                  }} 
                />
              ) : (
                <UserOutlined />
              )}
            </button>
            {showUserMenu && (
              <div className="settings-dropdown">
                <button className="settings-item" onClick={handleProfileClick}>
                  <ProfileOutlined />
                  <span>Profile</span>
                </button>
                <button className="settings-item" onClick={handleLogoutClick}>
                  <LogoutOutlined />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

