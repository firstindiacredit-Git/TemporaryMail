import React from 'react';
import { SaveOutlined, CheckCircleOutlined } from '@ant-design/icons';

export default function LoginInfoSection() {
  return (
    <section className="login-info-section">
      <div className="w-full">
        {/* Header card */}
        <header className="flex justify-center mb-10">
          <div className="login-modern-card-header">
            <div className="login-modern-card-icon">
              <SaveOutlined />
            </div>
            <div className="login-modern-card-content">
              <h2 className="login-modern-card-title">Save your login details safely</h2>
              <p className="login-modern-card-text">
                Keep your Login ID, Password, and Mail written here so you can log in faster next
                time without remembering everything.
              </p>
            </div>
          </div>
        </header>

        {/* Benefit cards */}
        <div className="grid gap-4 md:gap-[0.5rem] md:grid-cols-3">
          {/* All your details together */}
          <div className="login-modern-card">
            <div className="login-modern-card-icon-small">
              <CheckCircleOutlined />
            </div>
            <h3 className="login-modern-card-title-small">All your details together</h3>
            <p className="login-modern-card-text-small">
              Store your login ID, password, and email in one secure place so you don&apos;t
              have to search for them again and again.
            </p>
          </div>

          {/* Faster next login */}
          <div className="login-modern-card">
            <div className="login-modern-card-icon-small">
              <CheckCircleOutlined />
            </div>
            <h3 className="login-modern-card-title-small">Faster next login</h3>
            <p className="login-modern-card-text-small">
              Next time you visit, your saved details are already here so you can log in with click {' '}
              <span className="text-primary">just a few clicks</span>.
            </p>
          </div>

          {/* Simple & easy to use */}
          <div className="login-modern-card">
            <div className="login-modern-card-icon-small">
              <CheckCircleOutlined />
            </div>
            <h3 className="login-modern-card-title-small">Simple &amp; easy to use</h3>
            <p className="login-modern-card-text-small">
              Just write your information once and relax, the interface keeps everything
              <span className="text-primary"> clear, tidy, and easy to read.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

