import React from 'react';
import { MailOutlined } from '@ant-design/icons';

export default function Inbox({ messages, selectedMessageId, onSelectMessage, hasMailbox, readMessages }) {
  return (
    <section className="inbox-section" data-tutorial="inbox-section">
      <div className="section-header">
        <h2>
          <MailOutlined className="header-icon" />
          Inbox
        </h2>
        <p className="inbox-hint">
          Send an mail to the address on the left, then click Refresh.
        </p>
      </div>
      {!hasMailbox && !messages.length ? (
        <div className="inbox-list empty">
          <MailOutlined className="empty-icon" />
          <p>
            No messages yet. Share the address and refresh after sending an mail.
          </p>
        </div>
      ) : messages.length > 0 ? (
        <div className="inbox-list">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`message-card ${
                selectedMessageId === message.id ? "active" : ""
              }`}
              onClick={() => onSelectMessage(message.id)}
            >
              <div className="message-header">
                <div className="message-subject-wrapper">
                  {!readMessages.has(message.id) && (
                    <span className="message-unread-dot" title="Unread"></span>
                  )}
                  <p className="subject">{message.subject}</p>
                </div>
                <p className="meta">
                  {message.from} • {new Date(message.receivedAt).toLocaleString()}
                </p>
              </div>
              <p className="body">{message.body || "(no preview)"}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

