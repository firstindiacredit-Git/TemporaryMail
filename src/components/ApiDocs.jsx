import React, { useState, useEffect } from 'react';
import { CopyOutlined, CheckOutlined, CodeOutlined, GlobalOutlined, WarningOutlined } from '@ant-design/icons';

// Static API documentation as fallback
const STATIC_API_DOCS = {
  name: "Temp Mail API",
  version: "1.0.0",
  description: "RESTful API for temporary email addresses",
  baseUrl: `${window.location.origin}/api`,
  endpoints: {
    health: {
      method: "GET",
      path: "/api/health",
      description: "Check API health status",
      example: `${window.location.origin}/api/health`,
      response: {
        status: "ok",
        mailboxes: 5
      }
    },
    createMailbox: {
      method: "POST",
      path: "/api/mailboxes",
      description: "Create a new temporary email address",
      example: `${window.location.origin}/api/mailboxes`,
      requestBody: "None (optional: { domain: 'preferred-domain.com' })",
      response: {
        mailboxId: "string",
        address: "string",
        domain: "string",
        createdAt: "ISO8601",
        expiresAt: "ISO8601",
        messageCount: "number"
      }
    },
    getMailbox: {
      method: "GET",
      path: "/api/mailboxes/:mailboxId",
      description: "Get mailbox information",
      example: `${window.location.origin}/api/mailboxes/{mailboxId}`,
      response: {
        mailboxId: "string",
        address: "string",
        domain: "string",
        createdAt: "ISO8601",
        expiresAt: "ISO8601",
        messageCount: "number"
      }
    },
    getMessages: {
      method: "GET",
      path: "/api/mailboxes/:mailboxId/messages",
      description: "Get all messages for a mailbox",
      example: `${window.location.origin}/api/mailboxes/{mailboxId}/messages`,
      response: {
        mailbox: "object",
        messages: [
          {
            id: "string",
            from: "string",
            subject: "string",
            body: "string",
            html: "string",
            receivedAt: "ISO8601"
          }
        ]
      }
    },
    extendMailbox: {
      method: "POST",
      path: "/api/mailboxes/:mailboxId/extend",
      description: "Extend mailbox expiration time by 15 minutes",
      example: `${window.location.origin}/api/mailboxes/{mailboxId}/extend`,
      response: {
        mailboxId: "string",
        address: "string",
        expiresAt: "ISO8601"
      }
    }
  },
  usage: {
    javascript: `// Create mailbox
const response = await fetch('${window.location.origin}/api/mailboxes', { method: 'POST' });
const mailbox = await response.json();
console.log('Email:', mailbox.address);

// Get messages
const messagesRes = await fetch(\`${window.location.origin}/api/mailboxes/\${mailbox.mailboxId}/messages\`);
const data = await messagesRes.json();
console.log('Messages:', data.messages);

// Poll for new messages
setInterval(async () => {
  const res = await fetch(\`${window.location.origin}/api/mailboxes/\${mailbox.mailboxId}/messages\`);
  const { messages } = await res.json();
  console.log('New messages:', messages);
}, 6000); // Poll every 6 seconds`,
    curl: `# Create mailbox
curl -X POST ${window.location.origin}/api/mailboxes

# Get messages
curl ${window.location.origin}/api/mailboxes/{mailboxId}/messages

# Extend mailbox
curl -X POST ${window.location.origin}/api/mailboxes/{mailboxId}/extend`,
    python: `import requests
import time

# Create mailbox
response = requests.post('${window.location.origin}/api/mailboxes')
mailbox = response.json()
print(f"Email: {mailbox['address']}")

# Get messages
messages = requests.get(
    f"${window.location.origin}/api/mailboxes/{mailbox['mailboxId']}/messages"
)
print(messages.json())

# Poll for new messages
while True:
    res = requests.get(
        f"${window.location.origin}/api/mailboxes/{mailbox['mailboxId']}/messages"
    )
    data = res.json()
    print(f"Messages: {len(data['messages'])}")
    time.sleep(6)`
  },
  notes: [
    "Mailboxes expire after 15 minutes of inactivity",
    "You can extend mailbox lifetime using the extend endpoint",
    "All endpoints support CORS and can be used from any domain",
    "No authentication required - mailboxes are identified by mailboxId"
  ]
};

export default function ApiDocs() {
  const [apiInfo, setApiInfo] = useState(STATIC_API_DOCS);
  const [copyStatus, setCopyStatus] = useState({});
  const [activeTab, setActiveTab] = useState('javascript');
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    // Try to fetch live API docs, fallback to static if fails
    fetch('/api')
      .then(res => {
        if (!res.ok) throw new Error('API not available');
        return res.json();
      })
      .then(data => {
        setApiInfo(data);
        setApiError(false);
      })
      .catch(err => {
        console.warn('API endpoint not available, using static documentation:', err);
        setApiError(true);
        setApiInfo(STATIC_API_DOCS);
      });
  }, []);

  const handleCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus({ [key]: true });
      setTimeout(() => {
        setCopyStatus({ [key]: false });
      }, 1500);
    } catch {
      alert("Clipboard copy failed");
    }
  };

  if (!apiInfo) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading API documentation...</p>
      </div>
    );
  }

  const baseUrl = window.location.origin;

  return (
    <div className="api-docs">
      {apiError && (
        <div className="api-warning">
          <WarningOutlined />
          <div>
            <strong>API Server Not Running</strong>
           
            <p>This documentation shows how to use the API once the server is running.</p>
          </div>
        </div>
      )}
      
      <div className="api-docs-header">
        <div>
          <h1>
            <GlobalOutlined /> {apiInfo.name}
          </h1>
          <p className="api-version">Version {apiInfo.version}</p>
          <p className="api-description">{apiInfo.description}</p>
        </div>
        <div className="api-base-url">
          <strong>Base URL:</strong>
          <code>{apiInfo.baseUrl}</code>
          <button
            className="api-copy-btn"
            onClick={() => handleCopy(apiInfo.baseUrl, 'baseUrl')}
            title="Copy base URL"
          >
            {copyStatus.baseUrl ? <CheckOutlined /> : <CopyOutlined />}
          </button>
        </div>
      </div>

      <div className="api-setup-instructions">
        <h2>🚀 Getting Started</h2>
        <div className="setup-steps">
          <div className="setup-step">
            <strong>Step 1: Start the API Server</strong>
           
            <p>This starts the Express server on <code>http://domain.com:3000</code></p>
          </div>
          <div className="setup-step">
            <strong>Step 2: Use the API</strong>
            <p>You can now make API requests to:</p>
            <code>http://domain.com:3000/api</code>
            <p>All <code>/api/*</code> requests are automatically proxied to the backend server.</p>
          </div>
          <div className="setup-step">
            <strong>Step 3: Test the API</strong>
            <p>Try creating a mailbox:</p>
            <code>curl -X POST http://domain.com:3000/api/mailboxes</code>
          </div>
        </div>
      </div>

      <div className="api-endpoints">
        <h2>API Endpoints</h2>
        
        {Object.entries(apiInfo.endpoints).map(([key, endpoint]) => (
          <div key={key} className="api-endpoint">
            <div className="endpoint-header">
              <div className="endpoint-method">{endpoint.method}</div>
              <div className="endpoint-path">{endpoint.path}</div>
            </div>
            <p className="endpoint-description">{endpoint.description}</p>
            <div className="endpoint-example">
              <strong>Example:</strong>
              <code>{endpoint.example}</code>
              <button
                className="api-copy-btn"
                onClick={() => handleCopy(endpoint.example, key)}
                title="Copy URL"
              >
                {copyStatus[key] ? <CheckOutlined /> : <CopyOutlined />}
              </button>
            </div>
            {endpoint.response && (
              <div className="endpoint-response">
                <strong>Response:</strong>
                <pre>{JSON.stringify(endpoint.response, null, 2)}</pre>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="api-usage">
        <h2>
          <CodeOutlined /> Usage Examples
        </h2>
        
        <div className="api-tabs">
          <button
            className={`api-tab ${activeTab === 'javascript' ? 'active' : ''}`}
            onClick={() => setActiveTab('javascript')}
          >
            JavaScript
          </button>
          <button
            className={`api-tab ${activeTab === 'curl' ? 'active' : ''}`}
            onClick={() => setActiveTab('curl')}
          >
            cURL
          </button>
          <button
            className={`api-tab ${activeTab === 'python' ? 'active' : ''}`}
            onClick={() => setActiveTab('python')}
          >
            Python
          </button>
        </div>

        <div className="api-code-block">
          <div className="code-header">
            <span>{activeTab === 'javascript' ? 'JavaScript' : activeTab === 'curl' ? 'cURL' : 'Python'}</span>
            <button
              className="api-copy-btn"
              onClick={() => handleCopy(apiInfo.usage[activeTab], `code-${activeTab}`)}
              title="Copy code"
            >
              {copyStatus[`code-${activeTab}`] ? <CheckOutlined /> : <CopyOutlined />}
            </button>
          </div>
          <pre><code>{apiInfo.usage[activeTab]}</code></pre>
        </div>
      </div>

      <div className="api-notes">
        <h2>Important Notes</h2>
        <ul>
          {apiInfo.notes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

