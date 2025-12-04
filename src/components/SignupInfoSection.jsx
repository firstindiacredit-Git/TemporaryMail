import React, { useState, useRef } from 'react';
import { UserAddOutlined, CheckCircleOutlined } from '@ant-design/icons';

function ColorMotionCard({ children, className = '' }) {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      className={`login-modern-card color-motion-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--mouse-x': `${mousePosition.x}%`,
        '--mouse-y': `${mousePosition.y}%`,
      }}
    >
      {children}
    </div>
  );
}

export default function SignupInfoSection() {
  return (
    <section className="login-info-section">
      <div className="w-full">
        {/* Header card */}
        <header className="flex justify-center mb-10">
          <div className="login-modern-card-header">
            <div className="login-modern-card-icon">
              <UserAddOutlined />
            </div>
            <div className="login-modern-card-content">
              <h2 className="login-modern-card-title">Create your account today</h2>
              <p className="login-modern-card-text">
                Sign up now to get started with your disposable email inbox and enjoy all the benefits
                of a secure, temporary email service.
              </p>
            </div>
          </div>
        </header>

        {/* Benefit cards */}
        <div className="grid gap-4 md:gap-[0.5rem] md:grid-cols-3">
          {/* Quick setup */}
          <ColorMotionCard>
            <div className="login-modern-card-icon-small">
              <CheckCircleOutlined />
            </div>
            <h3 className="login-modern-card-title-small">Quick setup</h3>
            <p className="login-modern-card-text-small">
              Get started in seconds with a simple signup process. No lengthy forms or
              complicated verification steps required.
            </p>
          </ColorMotionCard>

          {/* Secure & private */}
          <ColorMotionCard>
            <div className="login-modern-card-icon-small">
              <CheckCircleOutlined />
            </div>
            <h3 className="login-modern-card-title-small">Secure &amp; private</h3>
            <p className="login-modern-card-text-small">
              Your account information is kept safe and private. We prioritize your
              <span className="text-primary"> security and privacy</span>.
            </p>
          </ColorMotionCard>

          {/* Full access */}
          <ColorMotionCard>
            <div className="login-modern-card-icon-small">
              <CheckCircleOutlined />
            </div>
            <h3 className="login-modern-card-title-small">Full access</h3>
            <p className="login-modern-card-text-small">
              Unlock all features including email history, saved details, and
              <span className="text-primary"> advanced inbox management</span>.
            </p>
          </ColorMotionCard>
        </div>
      </div>
    </section>
  );
}

