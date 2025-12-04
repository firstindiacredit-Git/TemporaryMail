import React, { useState, useEffect, useRef } from 'react';
import { MailOutlined, ReloadOutlined, CopyOutlined, CheckOutlined, ArrowRightOutlined, PlayCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';

const STEPS = [
  {
    id: 1,
    title: 'Generate Email Address',
    description: 'Click the "Generate Mail" button to create a temporary email address instantly.',
    icon: <ReloadOutlined />,
    color: '#1a73e8'
  },
  {
    id: 2,
    title: 'Copy Your Address',
    description: 'Copy the generated email address and use it anywhere you need to receive emails.',
    icon: <CopyOutlined />,
    color: '#34a853'
  },
  {
    id: 3,
    title: 'Receive Emails',
    description: 'All emails sent to your temporary address will appear in your inbox automatically.',
    icon: <MailOutlined />,
    color: '#ea4335'
  },
  {
    id: 4,
    title: 'View Messages',
    description: 'Click on any email to read its full content. Your inbox refreshes every 6 seconds.',
    icon: <CheckOutlined />,
    color: '#fbbc04'
  }
];

export default function TempMailAnimationSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [cardAnimations, setCardAnimations] = useState({
    0: true,
    1: true,
    2: true,
    3: true
  });
  const sectionRef = useRef(null);

  // Show all components immediately with effects
  useEffect(() => {
    setIsVisible(true);
    // All cards visible immediately
    STEPS.forEach((_, index) => {
      setCardAnimations((prev) => ({
        ...prev,
        [index]: true
      }));
    });
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleStepClick = (index) => {
    setActiveStep(index);
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <section className="temp-mail-animation-section" ref={sectionRef}>
      {/* Animated Background Elements */}
      <div className="animation-bg-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="animation-particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}></div>
        ))}
      </div>
      
      {/* Floating Icons */}
      <div className="animation-floating-icons">
        <div className="floating-icon icon-1"><MailOutlined /></div>
        <div className="floating-icon icon-2"><ReloadOutlined /></div>
        <div className="floating-icon icon-3"><CopyOutlined /></div>
        <div className="floating-icon icon-4"><CheckOutlined /></div>
      </div>

      <div className="animation-section-container visible">
        {/* Header */}
        <header className="animation-section-header fade-in-up">
          <div className="animation-header-content">
            <div className="animation-header-icon">
              <ThunderboltOutlined className="icon-sparkle" />
              <PlayCircleOutlined className="icon-main" />
            </div>
            <div className="animation-header-text">
              <h2 className="animation-section-title">
                <span className="title-word word-1">How</span>
                <span className="title-word word-2">to</span>
                <span className="title-word word-3">Use</span>
                <span className="title-word word-4">Temp</span>
                <span className="title-word word-5">Mail</span>
              </h2>
              <p className="animation-section-subtitle">
                Follow these simple steps to get started with temporary email addresses
              </p>
            </div>
          </div>
          {!isPlaying && (
            <button className="animation-play-btn" onClick={handlePlay} title="Play animation">
              <PlayCircleOutlined />
            </button>
          )}
        </header>

        {/* Steps Grid */}
        <div className="animation-steps-grid">
          {STEPS.map((step, index) => {
            const isActive = activeStep === index;
            const isCompleted = activeStep > index;
            const isCardVisible = cardAnimations[index];
            
            return (
              <div
                key={step.id}
                className={`animation-step-card ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isCardVisible ? 'card-visible' : ''}`}
                onClick={() => handleStepClick(index)}
                style={{ '--step-color': step.color }}
              >
                {/* Shimmer Effect */}
                <div className="card-shimmer"></div>
                
                {/* Glow Effect */}
                {isActive && <div className="card-glow" style={{ boxShadow: `0 0 30px ${step.color}40` }}></div>}
                
                <div className="animation-step-number">
                  <span className="number-text">{step.id}</span>
                  {isActive && <div className="number-ripple"></div>}
                </div>
                
                <div 
                  className={`animation-step-icon ${isActive ? 'icon-active' : ''}`}
                  style={{ 
                    backgroundColor: isActive || isCompleted ? step.color : 'var(--bg-sidebar)',
                    color: isActive || isCompleted ? '#fff' : 'var(--text-secondary)'
                  }}
                >
                  <div className="icon-wrapper">
                    {step.icon}
                  </div>
                  {isActive && (
                    <>
                      <div className="icon-ring"></div>
                      <div className="icon-sparkles">
                        {[...Array(6)].map((_, i) => (
                          <span key={i} className="sparkle" style={{
                            '--sparkle-delay': `${i * 0.1}s`,
                            '--sparkle-angle': `${i * 60}deg`
                          }}></span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
                <div className="animation-step-content">
                  <h3 className="animation-step-title">
                    <span className="title-highlight">{step.title}</span>
                  </h3>
                  <p className="animation-step-description">{step.description}</p>
                </div>
                
                {isActive && (
                  <>
                    <div className="animation-step-indicator">
                      <div className="animation-pulse-dot"></div>
                      <div className="pulse-ring"></div>
                    </div>
                   
                  </>
                )}
                {isCompleted && (
                  <div className="animation-step-check">
                    <CheckOutlined />
                    <div className="check-ripple"></div>
                  </div>
                )}
                
                {/* Connection Line */}
                {index < STEPS.length - 1 && (
                  <div className={`step-connector ${isCompleted ? 'completed' : ''}`}>
                    <div className="connector-line"></div>
                    <div className="connector-arrow">
                      <ArrowRightOutlined />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="animation-progress-container fade-in-up">
          <div className="animation-progress-bar">
            {STEPS.map((_, index) => (
              <div
                key={index}
                className={`animation-progress-dot ${activeStep >= index ? 'active' : ''}`}
                style={{
                  backgroundColor: activeStep >= index ? STEPS[index].color : 'var(--border-subtle)',
                  '--dot-color': STEPS[index].color
                }}
              >
                {activeStep >= index && (
                  <div className="dot-pulse" style={{ backgroundColor: STEPS[index].color }}></div>
                )}
              </div>
            ))}
          </div>
          <div className="animation-progress-line">
            <div 
              className="animation-progress-fill"
              style={{
                width: `${((activeStep + 1) / STEPS.length) * 100}%`,
                background: `linear-gradient(90deg, ${STEPS[0].color}, ${STEPS[1].color}, ${STEPS[2].color}, ${STEPS[3].color})`
              }}
            >
              <div className="progress-shimmer"></div>
            </div>
          </div>
          <div className="progress-label">
            Step {activeStep + 1} of {STEPS.length}
          </div>
        </div>

        {/* Animated Arrow */}
        <div className="animation-arrow-container">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={`animation-arrow ${activeStep === index ? 'visible' : ''}`}
              style={{ 
                color: STEPS[index].color,
                animationDelay: `${index * 0.1}s`
              }}
            >
              <ArrowRightOutlined />
              <div className="arrow-trail"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

