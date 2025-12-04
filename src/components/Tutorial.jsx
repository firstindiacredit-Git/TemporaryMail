import React, { useState, useEffect, useRef } from 'react';
import { RightOutlined, LeftOutlined, CloseOutlined } from '@ant-design/icons';

const TUTORIAL_STEPS = [
  {
    id: 'generate',
    title: 'Generate Email Address',
    description: 'Click on "Generate Email" button to create a temporary email address. This address will be used to receive emails.',
    target: 'generate-btn',
    position: 'bottom'
  },
  {
    id: 'address',
    title: 'Your Email Address',
    description: 'This is your temporary email address. You can copy it and use it anywhere to receive emails. Click the copy button to copy the address.',
    target: 'email-address',
    position: 'bottom'
  },
  {
    id: 'expiry',
    title: 'Expiry Time',
    description: 'This shows when your email address will expire. After expiry, you won\'t be able to receive new emails on this address.',
    target: 'expiry-time',
    position: 'top'
  },
  {
    id: 'refresh',
    title: 'Refresh Button',
    description: 'Click this button to manually refresh and check for new emails. The inbox also auto-refreshes every 6 seconds.',
    target: 'refresh-btn',
    position: 'bottom'
  },
  {
    id: 'inbox',
    title: 'Inbox Section',
    description: 'All your received emails will appear here. Click on any email to view its full content in the preview panel.',
    target: 'inbox-section',
    position: 'right'
  },
  {
    id: 'preview',
    title: 'Message Preview',
    description: 'When you click on an email, its full content will be displayed here. You can read the complete message, including HTML content.',
    target: 'detail-panel',
    position: 'left'
  }
];

export default function Tutorial({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const overlayRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    // Check if user has seen tutorial before
    const hasSeenTutorial = localStorage.getItem('tempMail_tutorial_completed');
    if (!hasSeenTutorial) {
      setIsVisible(true);
      document.body.classList.add('tutorial-active');
    }

    return () => {
      document.body.classList.remove('tutorial-active');
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Remove highlight from all elements
    const allTutorialElements = document.querySelectorAll('[data-tutorial]');
    allTutorialElements.forEach(el => {
      el.classList.remove('tutorial-highlight');
    });

    const updatePosition = () => {
      const step = TUTORIAL_STEPS[currentStep];
      const targetElement = document.querySelector(`[data-tutorial="${step.target}"]`);
      
      if (targetElement && tooltipRef.current && overlayRef.current) {
        // Add highlight class only to current element
        targetElement.classList.add('tutorial-highlight');
        
        // Scroll element into view and center it
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        
        // Wait for scroll to complete, then position tooltip and create cutout
        setTimeout(() => {
          highlightElement(targetElement, tooltipRef.current, step.position);
        }, 300);
      }
    };

    // Initial position
    setTimeout(updatePosition, 100);

    // Update on scroll/resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      // Cleanup: remove highlight when step changes
      const allTutorialElements = document.querySelectorAll('[data-tutorial]');
      allTutorialElements.forEach(el => {
        el.classList.remove('tutorial-highlight');
      });
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [currentStep, isVisible]);

  const highlightElement = (element, tooltip, position) => {
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Center the highlighted element
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

    let top = 0;
    let left = 0;
    const gap = 16; // Gap between tooltip and highlighted component

    if (position === 'bottom') {
      top = rect.bottom + scrollY + gap;
      left = rect.left + scrollX + (rect.width / 2);
      tooltip.style.transform = 'translateX(-50%)';
    } else if (position === 'top') {
      top = rect.top + scrollY - tooltipRect.height - gap;
      left = rect.left + scrollX + (rect.width / 2);
      tooltip.style.transform = 'translateX(-50%)';
    } else if (position === 'right') {
      top = rect.top + scrollY + (rect.height / 2);
      left = rect.right + scrollX + gap;
      tooltip.style.transform = 'translateY(-50%)';
    } else if (position === 'left') {
      top = rect.top + scrollY + (rect.height / 2);
      left = rect.left + scrollX - tooltipRect.width - gap;
      tooltip.style.transform = 'translate(-100%, -50%)';
    }

    // Keep tooltip within viewport
    const padding = 20;
    if (top < padding) top = padding;
    if (top + tooltipRect.height > window.innerHeight - padding) {
      top = window.innerHeight - tooltipRect.height - padding;
    }
    if (left < padding) left = padding;
    if (left + tooltipRect.width > window.innerWidth - padding) {
      left = window.innerWidth - tooltipRect.width - padding;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;

    // Create cutout in overlay for highlighted element (remove blur from highlighted area)
    if (overlayRef.current) {
      const overlay = overlayRef.current;
      const elementRect = element.getBoundingClientRect();
      const padding = 10; // Extra padding around element
      
      const x1 = Math.max(0, elementRect.left - padding);
      const y1 = Math.max(0, elementRect.top - padding);
      const x2 = Math.min(window.innerWidth, elementRect.right + padding);
      const y2 = Math.min(window.innerHeight, elementRect.bottom + padding);
      
      // Create clip-path to cut out the highlighted area
      overlay.style.clipPath = `polygon(
        0% 0%, 
        0% 100%, 
        ${x1}px 100%, 
        ${x1}px ${y1}px, 
        ${x2}px ${y1}px, 
        ${x2}px ${y2}px, 
        ${x1}px ${y2}px, 
        ${x1}px 100%, 
        100% 100%, 
        100% 0%
      )`;
    }
  };

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('tempMail_tutorial_completed', 'true');
    document.body.classList.remove('tutorial-active');
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  return (
    <>
      <div className="tutorial-overlay" ref={overlayRef} />
      <div className="tutorial-tooltip" ref={tooltipRef}>
        <div className="tutorial-header">
          <h3>{step.title}</h3>
          <button className="tutorial-close" onClick={handleSkip} title="Skip tutorial">
            <CloseOutlined />
          </button>
        </div>
        <p className="tutorial-description">{step.description}</p>
        <div className="tutorial-footer">
          <div className="tutorial-progress">
            Step {currentStep + 1} of {TUTORIAL_STEPS.length}
          </div>
          <div className="tutorial-actions">
            {!isFirstStep && (
              <button className="tutorial-btn secondary" onClick={handlePrevious}>
                <LeftOutlined />
                Previous
              </button>
            )}
            <button className="tutorial-btn primary" onClick={handleNext}>
              {isLastStep ? 'Got it!' : (
                <>
                  Next
                  <RightOutlined />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

