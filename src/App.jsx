import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { api } from './utils/api';
import { getCurrentUser, logout } from './utils/auth';
import Topbar from './components/Topbar';
import Tutorial from './components/Tutorial';
import Inbox from './components/Inbox';
import DetailPanel from './components/DetailPanel';
import HistoryModal from './components/HistoryModal';
import LoginModal from './components/Login';
import SignupModal from './components/Signup';
import ProfileModal from './components/ProfileModal';
import LoginInfoSection from './components/LoginInfoSection';
import SignupInfoSection from './components/SignupInfoSection';
import TempMailAnimationSection from './components/TempMailAnimationSection';
import ApiDocs from './components/ApiDocs';
import SaveLoginDetails from './components/SaveLoginDetails';

function HomePage({ user, onLogout, onLogin }) {
  const [mailbox, setMailbox] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [readMessages, setReadMessages] = useState(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSaveLogin, setShowSaveLogin] = useState(false);

  const selectedMessage = messages.find((msg) => msg.id === selectedMessageId);

  // Mark message as read when selected
  const handleSelectMessage = (messageId) => {
    setSelectedMessageId(messageId);
    setReadMessages(prev => new Set([...prev, messageId]));
  };

  const refreshInbox = useCallback(async () => {
    if (!mailbox) return;
    setIsRefreshing(true);
    try {
      const { messages: newMessages } = await api.getMessages(mailbox.mailboxId);
      setMessages(newMessages);
      
      // Auto-select first message if none selected or selected message is gone
      if (!selectedMessageId || !newMessages.find((msg) => msg.id === selectedMessageId)) {
        if (newMessages.length > 0) {
          const firstMessageId = newMessages[0].id;
          setSelectedMessageId(firstMessageId);
          setReadMessages(prev => new Set([...prev, firstMessageId]));
        } else {
          setSelectedMessageId(null);
        }
      }
    } catch (error) {
      console.error(error);
      if (error.message.includes("404") || error.message.includes("not found")) {
        alert(
          "Mailbox not found. This usually happens after a server restart. Please generate a new address."
        );
        setMailbox(null);
        setMessages([]);
        setSelectedMessageId(null);
      } else {
        alert(error.message);
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [mailbox, selectedMessageId]);

  // Polling for new messages
  useEffect(() => {
    if (!mailbox) return;
    const interval = setInterval(refreshInbox, 6000);
    return () => clearInterval(interval);
  }, [mailbox, refreshInbox]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const newMailbox = await api.createMailbox();
      setMailbox(newMailbox);
      setMessages([]);
      setSelectedMessageId(null);
      
      // Save to history
      try {
        const stored = localStorage.getItem('tempMail_history');
        const history = stored ? JSON.parse(stored) : [];
        history.push({
          mailboxId: newMailbox.mailboxId,
          address: newMailbox.address,
          createdAt: new Date().toISOString(),
          expiresAt: newMailbox.expiresAt
        });
        localStorage.setItem('tempMail_history', JSON.stringify(history));
      } catch (error) {
        console.error('Error saving to history:', error);
      }
      
      await refreshInbox();
    } catch (error) {
      // Handle rate-limit errors from the backend more gracefully
      const message = error?.message || '';

      // If all domains are currently rate-limited, don't spam the user with alerts
      if (
        message.includes('All domains are currently rate-limited') ||
        message.includes('Unable to allocate mailbox') ||
        message.includes('temporarily unavailable')
      ) {
        console.warn('Mailbox service is currently unavailable. Please wait a few seconds and try again.');
        // Optionally, you could show a subtle UI notice/toast here instead of an alert
        return;
      }

      // Handle NOT_FOUND errors specifically
      if (message.includes('page could not be found') || message.includes('NOT_FOUND')) {
        console.warn('Mail.tm service is temporarily unavailable. Please try again in a few moments.');
        return;
      }

      console.error(error);
      alert(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExtend = async () => {
    if (!mailbox) return;
    setIsExtending(true);
    try {
      const updatedMailbox = await api.extendMailbox(mailbox.mailboxId);
      setMailbox(updatedMailbox);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsExtending(false);
    }
  };

  return (
    <div className="layout-root">
      <Tutorial />
      <Topbar
        user={user}
        emailAddress={mailbox?.address}
        mailbox={mailbox}
        onGenerate={handleGenerate}
        onRefresh={refreshInbox}
        isRefreshing={isRefreshing}
        isGenerating={isGenerating}
        canRefresh={!!mailbox}
        onShowHistory={() => {
          setShowHistory(true);
        }}
        onLogout={onLogout}
        onShowLogin={() => setShowLogin(true)}
        onShowSignup={() => setShowSignup(true)}
        onShowProfile={() => setShowProfile(true)}
        onShowSaveLogin={() => setShowSaveLogin(true)}
      />
      <HistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onLogin={onLogin}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />
      <SignupModal 
        isOpen={showSignup} 
        onClose={() => setShowSignup(false)} 
        onSignup={onLogin}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
      <ProfileModal 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
        user={user}
        onUpdate={(updatedUser) => {
          onLogin(updatedUser);
        }}
      />
      <SaveLoginDetails isOpen={showSaveLogin} onClose={() => setShowSaveLogin(false)} />
      <main className="app-main">
        <Inbox
          messages={messages}
          selectedMessageId={selectedMessageId}
          onSelectMessage={handleSelectMessage}
          hasMailbox={!!mailbox}
          readMessages={readMessages}
        />
        <DetailPanel message={selectedMessage} />
      </main>
      {!user && <SignupInfoSection />}
      {user && <LoginInfoSection />}
      <TempMailAnimationSection />
    </div>
  );
}

function ApiDocsPage({ user, onLogout, onLogin }) {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="layout-root">
      <Topbar
        user={user}
        emailAddress={null}
        mailbox={null}
        onGenerate={() => navigate('/')}
        onRefresh={() => {}}
        isRefreshing={false}
        canRefresh={false}
        onShowHistory={() => {}}
        onLogout={onLogout}
        onShowLogin={() => setShowLogin(true)}
        onShowSignup={() => setShowSignup(true)}
        onShowProfile={() => setShowProfile(true)}
        onShowSaveLogin={() => {}}
      />
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onLogin={onLogin}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />
      <SignupModal 
        isOpen={showSignup} 
        onClose={() => setShowSignup(false)} 
        onSignup={onLogin}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
      <ProfileModal 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
        user={user}
        onUpdate={(updatedUser) => {
          onLogin(updatedUser);
        }}
      />
      <main className="api-docs-page">
        <div className="api-docs-container">
          <button className="api-docs-back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          <ApiDocs />
        </div>
      </main>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const existing = getCurrentUser();
    if (existing) {
      setUser(existing);
    }
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage user={user} onLogout={handleLogout} onLogin={handleLogin} />}
      />
      <Route 
        path="/api-docs" 
        element={<ApiDocsPage user={user} onLogout={handleLogout} onLogin={handleLogin} />} 
      />
      <Route 
        path="*" 
        element={
          <div className="layout-root" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: '1rem' }}>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <button 
              onClick={() => window.location.href = '/'}
              style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
            >
              Go to Home
            </button>
          </div>
        } 
      />
    </Routes>
  );
}

export default App;

