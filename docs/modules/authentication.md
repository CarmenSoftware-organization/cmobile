# Authentication Module

## Overview
The Authentication module provides comprehensive user authentication, session management, and security features for the Carmen Supply Chain Mobile Application.

## Location
- **Primary Module**: `src/lib/auth.ts`
- **Related Components**: `src/app/(auth)/`

## Key Features

### 1. User Authentication
- Email/password login
- Two-factor authentication (2FA)
- Session management with automatic expiration
- Account lockout protection after failed attempts

### 2. Session Management
- Token-based authentication
- Configurable session timeout (default: 30 minutes)
- Session extension capabilities
- Session expiration warnings

### 3. Security Features
- Account lockout after 5 failed login attempts (15-minute lockout)
- Secure token storage in localStorage
- Session expiry validation
- Automatic cleanup of expired sessions

### 4. Business Unit Selection
- Multi-business unit support
- Business unit context persistence
- Role-based access control

## Core Interfaces

### User Interface
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  businessUnits: string[];
}
```

### AuthState Interface
```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  selectedBusinessUnit: string | null;
  twoFactorVerified: boolean;
}
```

## AuthService Class

### Singleton Pattern
The `AuthService` implements a singleton pattern to ensure consistent authentication state across the application.

### Key Methods

#### Authentication Methods
- `isAuthenticated()`: Validates current authentication status
- `getCurrentUser()`: Retrieves current user information
- `setAuth(token, user, expiresIn)`: Sets authentication data
- `clearAuth()`: Clears all authentication data

#### Session Management
- `extendSession(additionalTime)`: Extends current session
- `getSessionTimeRemaining()`: Returns remaining session time in seconds
- `isSessionAboutToExpire()`: Checks if session expires within 5 minutes

#### Security Methods
- `handleFailedLogin()`: Manages failed login attempts and account lockout
- `isAccountLocked()`: Checks if account is currently locked
- `clearFailedAttempts()`: Resets failed login counter

#### Business Unit Management
- `setBusinessUnit(businessUnit)`: Sets selected business unit
- `getSelectedBusinessUnit()`: Retrieves current business unit

#### Two-Factor Authentication
- `isTwoFactorVerified()`: Checks 2FA verification status
- `setTwoFactorVerified(verified)`: Sets 2FA verification state

## Authentication Flow

### 1. Login Process
1. User enters credentials
2. System validates credentials
3. On success: Set auth token, user data, and session expiry
4. On failure: Increment failed attempts, lock account if necessary
5. Redirect to business unit selection or dashboard

### 2. Session Validation
1. Check for valid token and session expiry
2. Validate session hasn't expired
3. Clear auth data if session is invalid
4. Redirect to login if authentication fails

### 3. Business Unit Selection
1. Display available business units for user
2. Store selected business unit in localStorage
3. Redirect to main application dashboard

## Route Protection

### Authentication Routes
- `/login` - User login
- `/password-reset` - Password reset
- `/two-factor` - Two-factor authentication
- `/business-unit-selection` - Business unit selection
- `/account-locked` - Account lockout notification
- `/session-expired` - Session expiration notification

### Utility Functions
- `redirectToLogin()`: Redirects to login page
- `redirectToBusinessUnitSelection()`: Redirects to business unit selection
- `redirectToDashboard()`: Redirects to main dashboard
- `redirectToSessionExpired()`: Redirects to session expired page
- `redirectToAccountLocked()`: Redirects to account locked page

## Security Considerations

### Data Storage
- Authentication tokens stored in localStorage
- Session expiry timestamps for automatic cleanup
- Business unit context persistence

### Session Security
- Configurable session timeouts
- Automatic session cleanup on expiry
- Session extension for active users

### Account Protection
- Failed login attempt tracking
- Automatic account lockout (5 attempts)
- Time-based lockout release (15 minutes)

## Integration Points

### With Mobile Layout
The authentication module integrates with the mobile layout to:
- Protect authenticated routes
- Manage user session state
- Handle session expiration

### With Business Logic
- Provides user context for business operations
- Manages business unit selection for multi-tenant operations
- Ensures secure access to application features

## Usage Examples

### Basic Authentication Check
```typescript
import { authService } from '@/lib/auth';

if (!authService.isAuthenticated()) {
  redirectToLogin();
}
```

### Getting Current User
```typescript
const user = authService.getCurrentUser();
if (user) {
  console.log(`Welcome, ${user.name}`);
}
```

### Session Management
```typescript
// Check if session is about to expire
if (authService.isSessionAboutToExpire()) {
  // Show warning or extend session
  authService.extendSession();
}
```

## Dependencies
- Next.js for routing and navigation
- TypeScript for type safety
- Browser localStorage for data persistence

## Future Enhancements
- JWT token validation
- Refresh token implementation
- OAuth integration
- Biometric authentication support
- Enhanced security logging