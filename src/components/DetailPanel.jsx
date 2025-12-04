import React, { useEffect, useRef } from 'react';
import { MailOutlined } from '@ant-design/icons';
import { sanitizeHtml, enhanceLinks } from '../utils/helpers';

export default function DetailPanel({ message }) {
  const detailBodyRef = useRef(null);

  useEffect(() => {
    if (!detailBodyRef.current) return;
    
    if (!message) {
      detailBodyRef.current.innerHTML = "";
      return;
    }

    // Force white background and black text on container
    detailBodyRef.current.style.backgroundColor = "white";
    detailBodyRef.current.style.color = "#000000";

    // Small delay for rendering
    setTimeout(() => {
      if (!detailBodyRef.current) return;

      if (message.html) {
        const cleaned = sanitizeHtml(message.html);
        detailBodyRef.current.innerHTML = cleaned;
        enhanceLinks(detailBodyRef.current);
        
        // Convert verify links to buttons within the content
        const allLinks = detailBodyRef.current.querySelectorAll("a[href]");
        allLinks.forEach((link) => {
          const text = (link.textContent || link.href).trim().toLowerCase();
          // Check if it's a verify/confirm link
          if (/verify|confirm|activate|validate|click here|get started/i.test(text)) {
            link.classList.add("verify-link-button");
          }
        });
        
        // Force white background and black text on ALL child elements
        const allElements = detailBodyRef.current.querySelectorAll("*");
        allElements.forEach((el) => {
          el.style.backgroundColor = "transparent";
          el.style.background = "transparent";
          el.style.color = "#000000";
          el.style.bgcolor = "";
          // Remove any classes that might have styling
          if (el.classList) {
            el.classList.forEach((cls) => {
              if (cls.includes("bg-") || cls.includes("text-") || cls.includes("dark")) {
                el.classList.remove(cls);
              }
            });
          }
        });
        
        // Force container styles again after rendering
        detailBodyRef.current.style.backgroundColor = "white";
        detailBodyRef.current.style.color = "#000000";
      } else if (message.body) {
        detailBodyRef.current.textContent = message.body;
      } else {
        detailBodyRef.current.textContent = "(no content)";
      }
    }, 100);
  }, [message]);

  return (
    <section className="detail-panel" data-tutorial="detail-panel">
      <header className="detail-header">
        <div>
          <p className="label">Selected message</p>
          {message ? (
            <h3>{message.subject}</h3>
          ) : (
            <h3 className="detail-empty-title">No message selected</h3>
          )}
        </div>
        {message && (
          <div className="detail-meta">
            <p>{message.from}</p>
            <p>{new Date(message.receivedAt).toLocaleString()}</p>
          </div>
        )}
      </header>
      {message ? (
        <div 
          className="detail-body bg-white text-gray-900" 
          ref={detailBodyRef}
          onClick={(e) => {
            const link = e.target.closest("a[href]");
            if (link) {
              e.preventDefault();
              window.open(link.href, "_blank", "noopener");
            }
          }}
        />
      ) : (
        <div className="detail-body detail-body-empty">
          <MailOutlined className="detail-empty-icon" />
          <p className="detail-empty-message">Select a message from the inbox to view its content</p>
          <p className="detail-empty-message">Or click on the <span className="font-bold">"Generate Mail"</span> button to create a temporary mail.</p>
          <p className="detail-empty-message">Or send an mail to the address on the left, then click Refresh.</p>
        </div>
      )}
    </section>
  );
}

