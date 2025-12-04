import React, { useState, useEffect } from 'react';
import { CloseOutlined, CopyOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatRelativeTime } from '../utils/helpers';

export default function HistoryModal({ isOpen, onClose }) {
  const [history, setHistory] = useState([]);
  const [copyStatus, setCopyStatus] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem('tempMail_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Sort by created date, newest first
        const sorted = parsed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setHistory(sorted);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error('Error loading history:', error);
      setHistory([]);
    }
  };

  const handleCopy = async (address) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopyStatus({ [address]: true });
      setTimeout(() => {
        setCopyStatus({ [address]: false });
      }, 1500);
    } catch {
      alert("Clipboard copy failed");
    }
  };

  const handleDelete = (mailboxId) => {
    try {
      const stored = localStorage.getItem('tempMail_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        const filtered = parsed.filter(item => item.mailboxId !== mailboxId);
        localStorage.setItem('tempMail_history', JSON.stringify(filtered));
        loadHistory();
      }
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('tempMail_history');
      setHistory([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="history-modal-overlay" onClick={onClose}>
      <div className="history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="history-modal-header">
          <h2>Mail History</h2>
          <button className="history-close-btn" onClick={onClose}>
            <CloseOutlined />
          </button>
        </div>
        <div className="history-modal-content">
          {history.length === 0 ? (
            <div className="history-empty">
              <p>No mail history found.</p>
            </div>
          ) : (
            <>
              <div className="history-actions">
                <button className="history-clear-btn" onClick={handleClearAll}>
                  <DeleteOutlined />
                  Clear All
                </button>
              </div>
              <div className="history-list">
                {history.map((item) => (
                  <div key={item.mailboxId} className="history-item">
                    <div className="history-item-content">
                      <div className="history-item-address">
                        <span className="history-email">{item.address}</span>
                        <button
                          className="history-copy-btn"
                          onClick={() => handleCopy(item.address)}
                          title={copyStatus[item.address] ? "Copied!" : "Copy address"}
                        >
                          {copyStatus[item.address] ? <CheckOutlined /> : <CopyOutlined />}
                        </button>
                      </div>
                      <div className="history-item-meta">
                        <span className="history-date">
                          Created: {new Date(item.createdAt).toLocaleString()}
                        </span>
                        {item.expiresAt && (
                          <span className="history-expiry">
                            Expired: {new Date(item.expiresAt) < new Date() ? 'Yes' : formatRelativeTime(item.expiresAt)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      className="history-delete-btn"
                      onClick={() => handleDelete(item.mailboxId)}
                      title="Delete"
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

