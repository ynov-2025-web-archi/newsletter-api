# Newsletter API

A RESTful API for managing newsletter subscriptions using Express.js and MongoDB.

## Features

- ✅ Email subscription management
- ✅ Email validation and deduplication
- ✅ Subscription preferences
- ✅ Pagination for subscriber lists
- ✅ Reactivation of inactive subscriptions
- ✅ Comprehensive error handling
- ✅ MongoDB integration with Mongoose

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone and navigate to the project:**
   ```bash
   cd ecommerce_apis/newsletter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ecommerce_newsletter
   PORT=3031
   ```

4. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Base URL
```
http://localhost:3031/api/newsletter
```

### 1. Subscribe to Newsletter
**POST** `/subscribe`

**Request Body:**
```json
{
  "email": "user@example.com",
  "preferences": {
    "productUpdates": true,
    "promotions": true,
    "newsletter": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter",
  "data": {
    "email": "user@example.com",
    "subscribedAt": "2024-01-01T00:00:00.000Z",
    "preferences": {
      "productUpdates": true,
      "promotions": true,
      "newsletter": true
    }
  }
}
```

### 2. Unsubscribe from Newsletter
**POST** `/unsubscribe`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully unsubscribed from newsletter"
}
```

### 3. Update Preferences
**PUT** `/preferences`

**Request Body:**
```json
{
  "email": "user@example.com",
  "preferences": {
    "productUpdates": false,
    "promotions": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "data": {
    "email": "user@example.com",
    "preferences": {
      "productUpdates": false,
      "promotions": true,
      "newsletter": true
    }
  }
}
```

### 4. Get All Subscribers (Admin)
**GET** `/subscribers?page=1&limit=10&active=true`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `active` (optional): Filter by active status (true/false)

**Response:**
```json
{
  "success": true,
  "data": {
    "subscribers": [
      {
        "_id": "...",
        "email": "user@example.com",
        "isActive": true,
        "subscribedAt": "2024-01-01T00:00:00.000Z",
        "preferences": {
          "productUpdates": true,
          "promotions": true,
          "newsletter": true
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 50,
      "limit": 10
    }
  }
}
```

### 5. Get Subscriber Count (Admin)
**GET** `/count`

**Response:**
```json
{
  "success": true,
  "data": {
    "active": 45,
    "inactive": 5,
    "total": 50
  }
}
```

### 6. Health Check
**GET** `/health`

**Response:**
```json
{
  "status": "OK",
  "message": "Newsletter API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "Connected"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Email is required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Email not found in subscriptions"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Email is already subscribed to the newsletter"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details (development only)"
}
```

## Database Schema

### NewsletterSubscription
```javascript
{
  email: String (required, unique, lowercase),
  isActive: Boolean (default: true),
  subscribedAt: Date (default: now),
  lastEmailSent: Date (optional),
  preferences: {
    productUpdates: Boolean (default: true),
    promotions: Boolean (default: true),
    newsletter: Boolean (default: true)
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Testing the API

### Using curl

1. **Subscribe:**
   ```bash
   curl -X POST http://localhost:3031/api/newsletter/subscribe \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com"}'
   ```

2. **Get subscribers:**
   ```bash
   curl http://localhost:3031/api/newsletter/subscribers
   ```

3. **Unsubscribe:**
   ```bash
   curl -X POST http://localhost:3031/api/newsletter/unsubscribe \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com"}'
   ```

### Using Postman

Import the following collection:
```json
{
  "info": {
    "name": "Newsletter API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Subscribe",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "url": "http://localhost:3031/api/newsletter/subscribe",
        "body": {"mode": "raw", "raw": "{\"email\": \"test@example.com\"}"}
      }
    }
  ]
}
```

## Integration with Frontend

To integrate with your Next.js frontend, update the NewsletterForm component to use this API:

```javascript
const subscribeToNewsletter = async (email) => {
  try {
    const response = await fetch('http://localhost:3031/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Handle success
      console.log('Subscribed successfully!');
    } else {
      // Handle error
      console.error(data.message);
    }
  } catch (error) {
    console.error('Error subscribing:', error);
  }
};
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/ecommerce_newsletter` |
| `PORT` | Server port | `3031` |
| `NODE_ENV` | Environment mode | `development` |

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented yet)

## License

MIT 