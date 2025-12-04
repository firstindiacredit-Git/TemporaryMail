# Temp Mail API Documentation

## Base URL

- **Development**: `http://localhost:5173/api` (proxied to `http://localhost:3000/api`)
- **Production**: `https://your-domain.com/api`

## Authentication

No authentication required. Mailboxes are identified by their `mailboxId`.

## Endpoints

### Health Check

**GET** `/api/health`

Check API health status.

**Response:**
```json
{
  "status": "ok",
  "mailboxes": 5
}
```

### Get API Documentation

**GET** `/api`

Get complete API documentation with examples.

**Response:**
```json
{
  "name": "Temp Mail API",
  "version": "1.0.0",
  "description": "RESTful API for temporary email addresses",
  "baseUrl": "http://localhost:5173/api",
  "endpoints": { ... },
  "usage": { ... }
}
```

### Create Mailbox

**POST** `/api/mailboxes`

Create a new temporary email address.

**Request Body (Optional):**
```json
{
  "domain": "preferred-domain.com"
}
```

**Response:**
```json
{
  "mailboxId": "uuid-string",
  "address": "random123@domain.com",
  "domain": "domain.com",
  "createdAt": "2025-11-29T07:00:00.000Z",
  "expiresAt": "2025-11-29T07:15:00.000Z",
  "messageCount": 0
}
```

**Example:**
```bash
curl -X POST http://localhost:5173/api/mailboxes
```

### Get Mailbox

**GET** `/api/mailboxes/:mailboxId`

Get mailbox information.

**Response:**
```json
{
  "mailboxId": "uuid-string",
  "address": "random123@domain.com",
  "domain": "domain.com",
  "createdAt": "2025-11-29T07:00:00.000Z",
  "expiresAt": "2025-11-29T07:15:00.000Z",
  "messageCount": 2
}
```

### Get Messages

**GET** `/api/mailboxes/:mailboxId/messages`

Get all messages for a mailbox.

**Response:**
```json
{
  "mailbox": {
    "mailboxId": "uuid-string",
    "address": "random123@domain.com",
    "domain": "domain.com",
    "createdAt": "2025-11-29T07:00:00.000Z",
    "expiresAt": "2025-11-29T07:15:00.000Z",
    "messageCount": 2
  },
  "messages": [
    {
      "id": "message-id",
      "from": "sender@example.com",
      "subject": "Email Subject",
      "body": "Plain text body",
      "html": "<html>...</html>",
      "receivedAt": "2025-11-29T07:05:00.000Z"
    }
  ]
}
```

### Extend Mailbox

**POST** `/api/mailboxes/:mailboxId/extend`

Extend mailbox expiration time by 15 minutes.

**Response:**
```json
{
  "mailboxId": "uuid-string",
  "address": "random123@domain.com",
  "domain": "domain.com",
  "createdAt": "2025-11-29T07:00:00.000Z",
  "expiresAt": "2025-11-29T07:30:00.000Z",
  "messageCount": 2
}
```

## Usage Examples

### JavaScript

```javascript
// Create mailbox
const response = await fetch('http://localhost:5173/api/mailboxes', {
  method: 'POST'
});
const mailbox = await response.json();
console.log('Email:', mailbox.address);

// Get messages
const messagesRes = await fetch(
  `http://localhost:5173/api/mailboxes/${mailbox.mailboxId}/messages`
);
const data = await messagesRes.json();
console.log('Messages:', data.messages);

// Poll for new messages
setInterval(async () => {
  const res = await fetch(
    `http://localhost:5173/api/mailboxes/${mailbox.mailboxId}/messages`
  );
  const { messages } = await res.json();
  console.log('New messages:', messages);
}, 6000); // Poll every 6 seconds
```

### Python

```python
import requests
import time

# Create mailbox
response = requests.post('http://localhost:5173/api/mailboxes')
mailbox = response.json()
print(f"Email: {mailbox['address']}")

# Get messages
messages = requests.get(
    f"http://localhost:5173/api/mailboxes/{mailbox['mailboxId']}/messages"
)
print(messages.json())

# Poll for new messages
while True:
    res = requests.get(
        f"http://localhost:5173/api/mailboxes/{mailbox['mailboxId']}/messages"
    )
    data = res.json()
    print(f"Messages: {len(data['messages'])}")
    time.sleep(6)
```

### cURL

```bash
# Create mailbox
curl -X POST http://localhost:5173/api/mailboxes

# Get messages
curl http://localhost:5173/api/mailboxes/{mailboxId}/messages

# Extend mailbox
curl -X POST http://localhost:5173/api/mailboxes/{mailboxId}/extend
```

## Important Notes

- Mailboxes expire after 15 minutes of inactivity
- You can extend mailbox lifetime using the extend endpoint
- All endpoints support CORS and can be used from any domain
- No authentication required - mailboxes are identified by mailboxId
- Messages are automatically fetched from the mail.tm service

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "status": 404
}
```

Common status codes:
- `404` - Mailbox not found or expired
- `410` - Mailbox expired
- `500` - Server error
- `422` - Invalid request (e.g., domain not available)






