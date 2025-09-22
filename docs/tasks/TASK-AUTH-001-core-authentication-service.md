# TASK-AUTH-001: Implement Core Authentication Service

## Overview
Implement the core authentication service that provides comprehensive user authentication, session management, and security features for the Carmen Supply Chain Mobile Application.

## Priority
**High** - Critical foundation component required for all other modules

## Estimated Effort
**5-8 hours**

## Dependencies
- None (foundation task)

## Requirements

### Functional Requirements
Based on [Authentication Module Documentation](../modules/authentication.md) and [Authentication API](../api/authentication-api.md):

1. **User Authentication**
   - Email/password login validation
   - Token-based authentication
   - Session management with configurable timeout (default: 30 minutes)
   - Account lockout protection (5 failed attempts, 15-minute lockout)

2. **Session Management**
   - Session expiry validation
   - Session extension capabilities
   - Automatic cleanup of expired sessions
   - Session expiration warnings (5 minutes before expiry)

3. **Security Features**
   - Secure token storage in localStorage
   - Failed login attempt tracking
   - Automatic session cleanup
   - Business unit context management

4. **Two-Factor Authentication Support**
   - 2FA verification state management
   - Integration points for 2FA workflow

### Technical Requirements

1. **AuthService Singleton Class**
   - Implement singleton pattern for consistent state
   - Type-safe interfaces using TypeScript
   - Integration with Next.js routing

2. **Core Interfaces**
   ```typescript
   interface User {
     id: string;
     email: string;
     name: string;
     role: string;
     businessUnits: string[];
   }

   interface AuthState {
     isAuthenticated: boolean;
     user: User | null;
     token: string | null;
     selectedBusinessUnit: string | null;
     twoFactorVerified: boolean;
   }
   ```

3. **Key Methods Implementation**
   - Authentication validation methods
   - Session management methods
   - Security and lockout methods
   - Business unit management methods
   - Utility and navigation methods

## Implementation Details

### File Structure
```
src/lib/auth.ts                 # Main AuthService implementation
src/app/(auth)/layout.tsx       # Authentication layout
src/app/(auth)/login/page.tsx   # Login page
```

### Core AuthService Methods

#### Authentication Methods
```typescript
class AuthService {
  // Core authentication
  isAuthenticated(): boolean
  getCurrentUser(): User | null
  setAuth(token: string, user: User, expiresIn: number): void
  clearAuth(): void

  // Session management
  extendSession(additionalTime?: number): void
  getSessionTimeRemaining(): number
  isSessionAboutToExpire(): boolean

  // Security methods
  handleFailedLogin(): void
  isAccountLocked(): boolean
  clearFailedAttempts(): void

  // Business unit management
  setBusinessUnit(businessUnit: string): void
  getSelectedBusinessUnit(): string | null

  // Two-factor authentication
  isTwoFactorVerified(): boolean
  setTwoFactorVerified(verified: boolean): void
}
```

#### Utility Functions
```typescript
// Navigation utilities
function redirectToLogin(): void
function redirectToBusinessUnitSelection(): void
function redirectToDashboard(): void
function redirectToSessionExpired(): void
function redirectToAccountLocked(): void
```

### Authentication Flow Implementation

1. **Login Process**
   ```typescript
   // Validate credentials against API
   // Handle success: set token, user data, session expiry
   // Handle failure: increment attempts, check lockout
   // Redirect based on authentication state
   ```

2. **Session Validation**
   ```typescript
   // Check token validity and expiration
   // Clear auth data if invalid
   // Redirect to login if authentication fails
   ```

3. **Business Unit Selection**
   ```typescript
   // Store selected business unit
   // Persist in localStorage
   // Redirect to dashboard
   ```

### Security Implementation

1. **Data Storage**
   ```typescript
   // Store in localStorage with expiry timestamps
   const AUTH_STORAGE_KEY = 'carmen_auth';
   const BU_STORAGE_KEY = 'carmen_business_unit';
   const FAILED_ATTEMPTS_KEY = 'carmen_failed_attempts';
   const LOCKOUT_KEY = 'carmen_lockout';
   ```

2. **Session Security**
   ```typescript
   // Default session timeout: 30 minutes
   const DEFAULT_SESSION_TIMEOUT = 30 * 60 * 1000;
   const SESSION_WARNING_TIME = 5 * 60 * 1000; // 5 minutes
   ```

3. **Account Protection**
   ```typescript
   const MAX_FAILED_ATTEMPTS = 5;
   const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
   ```

## API Integration

### Authentication Endpoint
```typescript
// POST /api/v1/auth/login
interface LoginRequest {
  email: string;
  password: string;
  businessUnitId?: string;
  rememberMe?: boolean;
  deviceInfo?: {
    deviceId: string;
    deviceName: string;
    platform: string;
    version: string;
  };
}

interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    expiresIn: number;
    requiresTwoFactor: boolean;
    businessUnits: BusinessUnit[];
  };
}
```

### Session Management
```typescript
// POST /api/v1/auth/extend-session
// POST /api/v1/auth/logout
// GET /api/v1/auth/validate-session
```

## Testing Requirements

### Unit Tests
1. **Authentication State Management**
   ```typescript
   describe('AuthService', () => {
     test('should authenticate user with valid credentials')
     test('should handle failed login attempts')
     test('should lock account after max attempts')
     test('should manage session expiry')
     test('should extend session when requested')
   })
   ```

2. **Session Management**
   ```typescript
   describe('Session Management', () => {
     test('should detect session expiry')
     test('should warn before session expires')
     test('should clear expired sessions')
     test('should persist business unit selection')
   })
   ```

3. **Security Features**
   ```typescript
   describe('Security Features', () => {
     test('should track failed login attempts')
     test('should implement account lockout')
     test('should clear lockout after timeout')
     test('should secure token storage')
   })
   ```

### Integration Tests
1. Test authentication flow with mock API
2. Test session management with localStorage
3. Test navigation redirects
4. Test business unit selection workflow

## Acceptance Criteria

### Core Functionality
- [ ] User can log in with email/password
- [ ] Authentication state persists across page refreshes
- [ ] Session expires after configured timeout
- [ ] Failed login attempts are tracked and locked after 5 attempts
- [ ] Account lockout expires after 15 minutes
- [ ] Session can be extended for active users
- [ ] User receives warning 5 minutes before session expiry

### Security Requirements
- [ ] Authentication tokens are securely stored
- [ ] Expired sessions are automatically cleaned up
- [ ] Account lockout prevents brute force attacks
- [ ] Business unit context is properly managed
- [ ] Navigation redirects work correctly for all auth states

### Integration Requirements
- [ ] Integrates with authentication API endpoints
- [ ] Works with Next.js routing and navigation
- [ ] Supports mobile layout and responsive design
- [ ] Provides foundation for other modules

## Implementation Steps

1. **Setup Core Structure**
   - Create `src/lib/auth.ts` with AuthService class
   - Define TypeScript interfaces
   - Implement singleton pattern

2. **Implement Authentication Methods**
   - Core authentication validation
   - Token and user management
   - Session state management

3. **Implement Session Management**
   - Session expiry tracking
   - Session extension logic
   - Automatic cleanup

4. **Implement Security Features**
   - Failed attempt tracking
   - Account lockout logic
   - Secure storage management

5. **Implement Business Unit Management**
   - Business unit selection
   - Context persistence
   - Integration with user permissions

6. **Implement Navigation Utilities**
   - Redirect functions
   - Route protection logic
   - Integration with Next.js router

7. **Add API Integration**
   - Login endpoint integration
   - Session management endpoints
   - Error handling and retry logic

8. **Implement Testing**
   - Unit tests for all methods
   - Integration tests for workflows
   - Mock API responses

9. **Documentation and Examples**
   - Update module documentation
   - Add usage examples
   - Document integration points

## Related Tasks
- TASK-AUTH-002: Two-Factor Authentication (depends on this task)
- TASK-AUTH-003: Session Management (extends this task)
- TASK-AUTH-004: Business Unit Selection (depends on this task)
- TASK-API-001: Authentication API Integration (parallel task)

## Notes
- This is a foundation task that all other modules depend on
- Focus on security and reliability
- Ensure mobile-optimized user experience
- Plan for future enhancements (OAuth, biometric auth)
- Consider offline authentication scenarios