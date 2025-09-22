# Authentication API

## Overview
The Authentication API handles user authentication, session management, password operations, and security features for the Carmen Supply Chain application.

## Base URL
```
/api/auth
```

## API Request Headers

All API requests must include the following headers:

```http
Authorization: Bearer <access_token>
Content-Type: application/json
x-app-id: <application_uuid>
```

All endpoints require the query parameter `version=latest`.

## Example Request

```http
POST /api/auth/login?version=latest
Content-Type: application/json
x-app-id: mobile_12345

{
  "email": "user@example.com",
  "password": "password123"
}
```

## Endpoints

### POST /auth/login
Authenticate user with email and password.

#### Request
```http
POST /api/auth/login?version=latest
Content-Type: application/json
x-app-id: mobile_12345

{
  "email": "user@example.com",
  "password": "securePassword123",
  "rememberMe": false,
  "deviceInfo": {
    "deviceId": "device_123",
    "deviceName": "iPhone 14",
    "platform": "iOS",
    "version": "16.0"
  }
}
```

#### Response
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFiZmRiODkxLTU4ZWUtNDk5Yy04MTE1LTM0YTk2NGRlODEyMiIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTc1MTI2NzY4NCwiZXhwIjoxNzUxMzU0MDg0fQ.S2gn1p8oP26cW3fprDg6xmJ-lrK23vthJd4WBAV7Q7o",
  "refresh_token": "7mb7ddphq5it"
}
```

#### Error Responses
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "status": 401,
  "message": "Invalid login credentials"
}

<!-- HTTP/1.1 423 Locked
{
  "success": false,
  "error": {
    "code": "AUTH_002",
    "message": "Account locked due to multiple failed attempts",
    "details": {
      "lockoutTime": "2024-01-15T10:00:00Z",
      "attemptsRemaining": 0
    }
  }
} -->
```

### POST /auth/logout
Logout user and invalidate session.

#### Request
```http
POST /api/auth/logout?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json


```

#### Response
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "response": {
    "status": 200,
    "message": "Logout successful"
  }
}
```

### POST /auth/refresh
Refresh access token using refresh token.

#### Request
```http
POST /api/auth/refresh?version=latest
Content-Type: application/json

{
  "refreshToken": "fgj47nw2e2ao"
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  }
}
```

### POST /auth/forgot-password
Initiate password reset process.

#### Request
```http
POST /api/auth/forgot-password?version=latest
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "resetTokenSent": true,
    "email": "user@example.com"
  },
  "message": "Password reset instructions sent to email"
}
```

### POST /auth/reset-password
Reset password using reset token.

#### Request
```http
POST /api/auth/reset-password?version=latest
Content-Type: application/json

{
  "resetToken": "reset_token_123",
  "newPassword": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "passwordReset": true
  },
  "message": "Password reset successful"
}
```

### POST /auth/change-password
Change password for authenticated user.

#### Request
```http
POST /api/auth/change-password?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPassword": "currentPassword123",
  "newPassword": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "passwordChanged": true
  },
  "message": "Password changed successfully"
}
```

### GET /auth/me
Get current authenticated user information.

#### Request
```http
GET /api/auth/me?version=latest
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "HOD",
      "department": "F&B",
      "businessUnits": [
        {
          "id": "bu_12345",
          "name": "Grand Hotel Singapore",
          "role": "Manager",
          "permissions": [
            "inventory.read",
            "purchase-requests.approve"
          ]
        }
      ],
      "currentBusinessUnit": {
        "id": "bu_12345",
        "name": "Grand Hotel Singapore"
      },
      "profile": {
        "phone": "+65 9123 4567",
        "joinDate": "2023-01-15T00:00:00Z",
        "lastLogin": "2024-01-15T09:30:00Z",
        "status": "active"
      },
      "preferences": {
        "theme": "dark",
        "language": "en",
        "notifications": {
          "email": true,
          "push": true,
          "sms": false
        }
      }
    },
    "session": {
      "sessionId": "session_123",
      "expiresAt": "2024-01-15T10:00:00Z",
      "lastActivity": "2024-01-15T09:45:00Z"
    }
  }
}
```

### POST /auth/verify-token
Verify token validity.

#### Request
```http
POST /api/auth/verify-token?version=latest
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "valid": true,
    "expiresAt": "2024-01-15T10:00:00Z",
    "userId": "user_123"
  }
}
```

### POST /auth/two-factor/setup
Setup two-factor authentication.

#### Request
```http
POST /api/auth/two-factor/setup?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "method": "totp",
  "phoneNumber": "+65 9123 4567"
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "secret": "JBSWY3DPEHPK3PXP",
    "backupCodes": [
      "12345678",
      "87654321",
      "11223344"
    ]
  }
}
```

### POST /auth/two-factor/verify
Verify two-factor authentication code.

#### Request
```http
POST /api/auth/two-factor/verify?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "code": "123456",
  "method": "totp"
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "verified": true,
    "twoFactorEnabled": true
  }
}
```

### GET /auth/sessions
Get active sessions for user.

#### Request
```http
GET /api/auth/sessions?version=latest
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "sessions": [
      {
        "sessionId": "session_123",
        "deviceInfo": {
          "deviceName": "iPhone 14",
          "platform": "iOS",
          "location": "Singapore"
        },
        "createdAt": "2024-01-15T09:30:00Z",
        "lastActivity": "2024-01-15T09:45:00Z",
        "isCurrent": true
      }
    ]
  }
}
```

### DELETE /auth/sessions/{sessionId}
Terminate specific session.

#### Request
```http
DELETE /api/auth/sessions/session_123?version=latest
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "sessionTerminated": true,
    "sessionId": "session_123"
  }
}
```

## Data Models

### User Object
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  department: string;
  businessUnits: BusinessUnit[];
  currentBusinessUnit?: BusinessUnit;
  profile: UserProfile;
  preferences: UserPreferences;
}
```

### Business Unit Object
```typescript
interface BusinessUnit {
  id: string;
  name: string;
  role: string;
  permissions: string[];
}
```

### Session Object
```typescript
interface Session {
  sessionId: string;
  expiresAt: string;
  lastActivity: string;
  deviceInfo?: DeviceInfo;
  twoFactorRequired: boolean;
}
```

### Device Info Object
```