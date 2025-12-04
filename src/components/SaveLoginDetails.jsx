import React, { useState, useRef, useEffect } from 'react';
import { CloseOutlined, SaveOutlined, DragOutlined, MinusOutlined, BorderOutlined, CompressOutlined, DeleteOutlined, EditOutlined, CopyOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

export default function SaveLoginDetails({ isOpen, onClose }) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowState, setWindowState] = useState('normal'); // 'normal', 'minimized', 'maximized'
  const [savedPosition, setSavedPosition] = useState({ x: 100, y: 100 });
  const [savedSize, setSavedSize] = useState({ width: 420, height: 'auto' });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    website: '',
    notes: ''
  });
  const [savedEntries, setSavedEntries] = useState([]);
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'saved'
  const [favicons, setFavicons] = useState({}); // Store favicons by entry id
  const [editingId, setEditingId] = useState(null); // Track which entry is being edited
  const [showPassword, setShowPassword] = useState(false); // Track password visibility
  const popupRef = useRef(null);
  const headerRef = useRef(null);

  // Function to get favicon URL
  const getFaviconUrl = (url) => {
    if (!url) return null;
    try {
      // Add protocol if missing
      let fullUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        fullUrl = 'https://' + url;
      }
      const urlObj = new URL(fullUrl);
      const domain = urlObj.hostname;
      // Try multiple favicon sources
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch (e) {
      return null;
    }
  };

  // Fetch favicon for entries
  useEffect(() => {
    if (activeTab === 'saved' && savedEntries.length > 0) {
      savedEntries.forEach((entry) => {
        if (entry.website && !favicons[entry.id]) {
          const faviconUrl = getFaviconUrl(entry.website);
          if (faviconUrl) {
            // Test if favicon loads
            const img = new Image();
            img.onload = () => {
              setFavicons(prev => {
                if (!prev[entry.id]) {
                  return { ...prev, [entry.id]: faviconUrl };
                }
                return prev;
              });
            };
            img.onerror = () => {
              // If favicon fails, don't set it
            };
            img.src = faviconUrl;
          }
        }
      });
    }
  }, [activeTab, savedEntries.length]);

  // Load saved entries from localStorage
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('savedLoginDetails');
      if (saved) {
        try {
          setSavedEntries(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading saved entries:', e);
        }
      } else {
        setSavedEntries([]);
      }
    }
  }, [isOpen, activeTab]);

  // Drag handlers
  const handleMouseDown = (e) => {
    // Don't drag if clicking on window controls or if maximized
    if (e.target.closest('.save-login-window-controls') || windowState === 'maximized') {
      return;
    }
    if (headerRef.current && headerRef.current.contains(e.target)) {
      setIsDragging(true);
      const rect = popupRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!formData.email && !formData.website) {
      alert('Please enter at least Email or Website');
      return;
    }

    const newEntry = {
      id: editingId || Date.now(),
      ...formData,
      createdAt: editingId ? savedEntries.find(e => e.id === editingId)?.createdAt || new Date().toISOString() : new Date().toISOString()
    };

    let updatedEntries;
    if (editingId) {
      // Update existing entry
      updatedEntries = savedEntries.map(entry => entry.id === editingId ? newEntry : entry);
      setEditingId(null);
    } else {
      // Add new entry
      updatedEntries = [...savedEntries, newEntry];
    }

    setSavedEntries(updatedEntries);
    localStorage.setItem('savedLoginDetails', JSON.stringify(updatedEntries));

    // Reset form
    setFormData({
      email: '',
      password: '',
      website: '',
      notes: ''
    });

    // Switch to saved tab after saving
    setActiveTab('saved');
    alert(editingId ? 'Login details updated successfully!' : 'Login details saved successfully!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      const updatedEntries = savedEntries.filter(entry => entry.id !== id);
      setSavedEntries(updatedEntries);
      localStorage.setItem('savedLoginDetails', JSON.stringify(updatedEntries));
    }
  };

  const handleEdit = (entry) => {
    setFormData({
      email: entry.email || '',
      password: entry.password || '',
      website: entry.website || '',
      notes: entry.notes || ''
    });
    setEditingId(entry.id);
    // Switch to Add tab
    setActiveTab('add');
  };

  const handleCopy = async (text, type) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      alert(`${type} copied to clipboard!`);
    } catch (err) {
      alert('Failed to copy to clipboard');
    }
  };

  const handleMinimize = () => {
    setWindowState('minimized');
  };

  const handleMaximize = () => {
    if (windowState === 'maximized') {
      setWindowState('normal');
      setPosition(savedPosition);
    } else {
      setSavedPosition(position);
      setSavedSize({
        width: popupRef.current?.offsetWidth || 420,
        height: popupRef.current?.offsetHeight || 'auto'
      });
      setWindowState('maximized');
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleRestore = () => {
    setWindowState('normal');
  };

  const handleCloseClick = (e) => {
    e.stopPropagation();
    setWindowState('normal');
    onClose();
  };

  if (!isOpen) return null;

  const isMinimized = windowState === 'minimized';
  const isMaximized = windowState === 'maximized';

  return (
    <>
      {/* Minimized indicator */}
      {isMinimized && (
        <div
          className="save-login-minimized-indicator"
          onClick={handleRestore}
          title="Click to restore"
        >
          <SaveOutlined />
          <span>Login Details</span>
        </div>
      )}

      {/* Main popup */}
      {!isMinimized && (
        <div className="save-login-overlay" onClick={onClose}>
          <div
            ref={popupRef}
            className={`save-login-popup ${isMaximized ? 'maximized' : ''}`}
            style={{
              left: isMaximized ? '0' : `${position.x}px`,
              top: isMaximized ? '0' : `${position.y}px`,
              width: isMaximized ? '100%' : savedSize.width,
              height: isMaximized ? '100vh' : savedSize.height,
              cursor: isDragging ? 'grabbing' : 'default'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              ref={headerRef}
              className="save-login-header"
              onMouseDown={handleMouseDown}
            >
              <div className="save-login-header-left">
                <DragOutlined className="drag-handle" />
                <SaveOutlined />
                <span>Save Login Details</span>
              </div>
              <div className="save-login-window-controls">
                <button
                  className="save-login-window-btn minimize-btn"
                  onClick={handleMinimize}
                  title="Minimize"
                >
                  <MinusOutlined />
                </button>
                <button
                  className="save-login-window-btn maximize-btn"
                  onClick={handleMaximize}
                  title={isMaximized ? "Restore" : "Maximize"}
                >
                  {isMaximized ? <CompressOutlined /> : <BorderOutlined />}
                </button>
                <button
                  className="save-login-window-btn close-btn"
                  onClick={handleCloseClick}
                  title="Close"
                >
                  <CloseOutlined />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="save-login-tabs">
              <button
                className={`save-login-tab ${activeTab === 'add' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('add');
                  if (!editingId) {
                    setFormData({ email: '', password: '', website: '', notes: '' });
                  }
                }}
              >
                {editingId ? 'Edit Entry' : 'Add New'}
              </button>
              <button
                className={`save-login-tab ${activeTab === 'saved' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('saved');
                  setEditingId(null);
                  setFormData({ email: '', password: '', website: '', notes: '' });
                }}
              >
                Saved ({savedEntries.length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="save-login-content">
              {activeTab === 'add' && (
                <div className="save-login-form">
                  <div className="save-login-field">
                    <label>Email / Login ID</label>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="save-login-field">
                    <label>Password</label>
                    <div className="save-login-password-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter password"
                        className="save-login-password-input"
                      />
                      <button
                        type="button"
                        className="save-login-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                      </button>
                    </div>
                  </div>

                  <div className="save-login-field">
                    <label>Website / URL</label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="example.com"
                    />
                  </div>

                  <div className="save-login-field">
                    <label>Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Additional notes..."
                      rows="3"
                    />
                  </div>

                  <button className="save-login-save-btn" onClick={handleSave}>
                    <SaveOutlined />
                    {editingId ? 'Update Details' : 'Save Details'}
                  </button>
                </div>
              )}

              {activeTab === 'saved' && (
                <div className="save-login-saved">
                  {savedEntries.length === 0 ? (
                    <div className="save-login-empty">
                      <SaveOutlined />
                      <p>No saved entries yet</p>
                      <p className="save-login-empty-hint">Go to "Add New" tab to save your login details</p>
                    </div>
                  ) : (
                    <>
                      <div className="save-login-entries">
                        {savedEntries.map((entry) => {
                          const hasFavicon = favicons[entry.id];
                          return (
                            <div key={entry.id} className="save-login-entry" id={`entry-${entry.id}`}>
                              <div className="save-login-entry-content">
                                {entry.website && (
                                  <div className="save-login-entry-item save-login-website-item">
                                    {hasFavicon ? (
                                      <div className="save-login-favicon-container">
                                        <img
                                          src={favicons[entry.id]}
                                          alt={entry.website}
                                          className="save-login-favicon"
                                          title={entry.website}
                                          onError={(e) => {
                                            e.target.style.display = 'none';
                                            const textSpan = e.target.parentElement.querySelector('.save-login-website-text');
                                            if (textSpan) textSpan.style.display = 'block';
                                          }}
                                        />
                                        <span className="save-login-website-text" style={{ display: 'none' }}>
                                          {entry.website.length > 30 ? `${entry.website.substring(0, 30)}...` : entry.website}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="save-login-website-text" title={entry.website}>
                                        {entry.website.length > 30 ? `${entry.website.substring(0, 30)}...` : entry.website}
                                      </span>
                                    )}
                                  </div>
                                )}
                                {entry.email && (
                                  <div className="save-login-entry-item save-login-email-item">
                                    <strong>Email:</strong> 
                                    <span className="save-login-truncate">{entry.email.length > 25 ? `${entry.email.substring(0, 25)}...` : entry.email}</span>
                                  </div>
                                )}
                                {entry.password && (
                                  <div className="save-login-entry-item save-login-password-item">
                                    <strong>Password:</strong> ••••••••
                                  </div>
                                )}
                                {entry.notes && (
                                  <div className="save-login-entry-item">
                                    <strong>Notes:</strong> 
                                    <span className="save-login-truncate">{entry.notes.length > 40 ? `${entry.notes.substring(0, 40)}...` : entry.notes}</span>
                                  </div>
                                )}
                              </div>
                              <div className="save-login-entry-actions">
                                <div className="save-login-action-buttons">
                                  <button
                                    className="save-login-edit-btn"
                                    onClick={() => handleEdit(entry)}
                                    title="Edit"
                                  >
                                    <EditOutlined />
                                  </button>
                                  <button
                                    className="save-login-delete-btn"
                                    onClick={() => handleDelete(entry.id)}
                                    title="Delete"
                                  >
                                    <DeleteOutlined />
                                  </button>
                                </div>
                                <div className="save-login-copy-buttons">
                                  {entry.email && (
                                    <button
                                      className="save-login-copy-btn-action save-login-copy-email-btn"
                                      onClick={() => handleCopy(entry.email, 'Email')}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.closest('.save-login-entry')?.classList.add('hover-email-copy');
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.closest('.save-login-entry')?.classList.remove('hover-email-copy');
                                      }}
                                      title="Copy Email"
                                    >
                                      <CopyOutlined />
                                    </button>
                                  )}
                                  {entry.password && (
                                    <button
                                      className="save-login-copy-btn-action save-login-copy-password-btn"
                                      onClick={() => handleCopy(entry.password, 'Password')}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.closest('.save-login-entry')?.classList.add('hover-password-copy');
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.closest('.save-login-entry')?.classList.remove('hover-password-copy');
                                      }}
                                      title="Copy Password"
                                    >
                                      <CopyOutlined />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
      </div>
    </div>
      )}
    </>
  );
}

