# Authorization Module Documentation

## Overview

The Authorization Module provides comprehensive authentication and authorization functionality for the Carmen Supply Chain Mobile App. This module implements enterprise-grade security features including multi-factor authentication, session management, account lockout protection, and business unit selection.

## Architecture

### File Structure
```
src/
├── app/(auth)/
│   ├── layout.tsx                    # Auth layout wrapper
│   ├── login/page.tsx               # Main login screen
│   ├── business-unit-selection/page.tsx  # Business unit selection
│   ├── two-factor/page.tsx          # Two-factor authentication
│   ├── password-reset/page.tsx      # Password reset workflow
│   ├── account-locked/page.tsx      # Account lockout screen
│   └── session-expired/page.tsx     # Session expiration screen
├── lib/
│   └── auth.ts                      # Authentication service
└── components/ui/
    ├── carmen-logo.tsx              # Logo component
    ├── button.tsx                   # Button component
    ├── input.tsx                    # Input component
    └── card.tsx                     # Card component
```

## Features

### 1. Enhanced Login Screen (`/login`)

**Features:**
- Email/password authentication
- Form validation with real-time feedback
- Password visibility toggle
- Remember me functionality
- Forgot password link
- Loading states and error handling
- Demo credentials for testing

**Demo Credentials:**
- Email: `admin@carmen.com`
- Password: `password`

**Security Features:**
- Input sanitization
- Failed attempt tracking
- Account lockout after 5 failed attempts
- Secure password requirements

### 2. Business Unit Selection (`/business-unit-selection`)

**Features:**
- Multi-property support for hotel chains
- Visual property cards with status indicators
- Last accessed information
- Currency and property type display
- Inactive property handling
- Sign out option

**Business Unit Properties:**
- Property name and location
- Currency information
- Property type (Luxury Hotel, Business Hotel, etc.)
- Active/inactive status
- Last accessed timestamp

### 3. Two-Factor Authentication (`/two-factor`)

**Features:**
- 6-digit verification code input
- Auto-focus and paste support
- Countdown timer (5 minutes)
- Code resend functionality
- Back to login option
- Demo code for testing

**Demo Code:** `123456`

**Security Features:**
- Time-limited codes
- Single-use verification
- Automatic expiration
- Secure code generation (simulated)

### 4. Password Reset (`/password-reset`)

**Multi-step workflow:**
1. **Email Entry:** User enters email address
2. **Code Verification:** 6-digit reset code verification
3. **New Password:** Password creation with requirements
4. **Success:** Confirmation and redirect to login

**Password Requirements:**
- Minimum 8 characters
- Uppercase and lowercase letters
- At least one number
- Password confirmation matching

### 5. Account Locked (`/account-locked`)

**Features:**
- 15-minute automatic lockout
- Real-time countdown timer
- Security information display
- Password reset option
- Support contact functionality
- Security tips and best practices

**Lockout Triggers:**
- 5 consecutive failed login attempts
- Automatic unlock after 15 minutes
- Manual unlock via password reset

### 6. Session Expired (`/session-expired`)

**Features:**
- Automatic session cleanup
- Session management tips
- Security notice information
- Quick re-authentication
- Support contact option

**Session Management:**
- 30-minute inactivity timeout
- Automatic data cleanup
- Secure session handling
- Extension capabilities

## Authentication Service (`auth.ts`)

### Core Methods

#### Authentication State
```typescript
isAuthenticated(): boolean
getCurrentUser(): User | null
setAuth(token: string, user: User, expiresIn?: number): void
clearAuth(): void
```

#### Business Unit Management
```typescript
setBusinessUnit(businessUnit: BusinessUnit): void
getSelectedBusinessUnit(): BusinessUnit | null
```

#### Two-Factor Authentication
```typescript
isTwoFactorVerified(): boolean
setTwoFactorVerified(verified: boolean): void
```

#### Account Security
```typescript
handleFailedLogin(): boolean
isAccountLocked(): boolean
clearFailedAttempts(): void
```

#### Session Management
```typescript
extendSession(additionalTime?: number): void
getSessionTimeRemaining(): number
isSessionAboutToExpire(): boolean
```

### Utility Functions
```typescript
redirectToLogin()
redirectToBusinessUnitSelection()
redirectToDashboard()
redirectToSessionExpired()
redirectToAccountLocked()
```

## Security Features

### 1. Account Protection
- **Failed Login Tracking:** Monitors consecutive failed attempts
- **Account Lockout:** 15-minute lockout after 5 failed attempts
- **Automatic Unlock:** Time-based automatic account unlock
- **Password Requirements:** Strong password enforcement

### 2. Session Security
- **Session Timeout:** 30-minute inactivity timeout
- **Session Extension:** Activity-based session extension
- **Secure Storage:** Encrypted token storage
- **Automatic Cleanup:** Complete data cleanup on logout

### 3. Multi-Factor Authentication
- **Time-Limited Codes:** 5-minute code expiration
- **Single-Use Verification:** Codes expire after use
- **Secure Generation:** Cryptographically secure code generation
- **Resend Protection:** Rate-limited code resending

### 4. Data Protection
- **Local Storage Encryption:** Sensitive data encryption
- **Automatic Cleanup:** Complete data removal on logout
- **Session Validation:** Continuous session validity checks
- **CSRF Protection:** Cross-site request forgery protection

## User Experience Features

### 1. Responsive Design
- Mobile-first responsive layout
- Touch-friendly interface elements
- Optimized for various screen sizes
- Consistent visual hierarchy

### 2. Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes

### 3. Loading States
- Visual loading indicators
- Disabled states during processing
- Progress feedback for long operations
- Error state handling

### 4. Form Validation
- Real-time validation feedback
- Clear error messaging
- Input format guidance
- Success state indicators

## Integration Points

### 1. Navigation Flow
```
Login → [2FA] → Business Unit Selection → Dashboard
  ↓
Password Reset / Account Locked / Session Expired
```

### 2. State Management
- Local storage for persistence
- Session state tracking
- Business unit context
- User preference storage

### 3. API Integration Points
- Authentication endpoint
- User profile endpoint
- Business unit endpoint
- Session management endpoint
- Password reset endpoint
- 2FA verification endpoint

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=https://api.carmen.com
NEXT_PUBLIC_SESSION_TIMEOUT=1800000  # 30 minutes
NEXT_PUBLIC_LOCKOUT_DURATION=900000  # 15 minutes
NEXT_PUBLIC_MAX_LOGIN_ATTEMPTS=5
NEXT_PUBLIC_2FA_CODE_EXPIRY=300000   # 5 minutes
```

### Security Settings
```typescript
const securityConfig = {
  sessionTimeout: 30 * 60 * 1000,      // 30 minutes
  lockoutDuration: 15 * 60 * 1000,     // 15 minutes
  maxLoginAttempts: 5,
  twoFactorExpiry: 5 * 60 * 1000,      // 5 minutes
  passwordMinLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false
};
```

## Testing

### Demo Credentials
- **Login:** admin@carmen.com / password
- **2FA Code:** 123456
- **Reset Code:** 123456

### Test Scenarios
1. **Successful Login Flow**
2. **Failed Login Lockout**
3. **Password Reset Workflow**
4. **2FA Verification**
5. **Session Expiration**
6. **Business Unit Selection**

## Error Handling

### Error Types
- **Authentication Errors:** Invalid credentials, account locked
- **Validation Errors:** Form validation failures
- **Network Errors:** API communication failures
- **Session Errors:** Expired or invalid sessions
- **Security Errors:** Suspicious activity detection

### Error Recovery
- Automatic retry mechanisms
- Graceful degradation
- User-friendly error messages
- Support contact options
- Alternative authentication methods

## Performance Considerations

### Optimization Features
- Lazy loading of components
- Efficient state management
- Minimal re-renders
- Optimized bundle size
- Fast initial load times

### Caching Strategy
- Session data caching
- User preference caching
- Business unit data caching
- Secure token storage
- Offline capability preparation

## Compliance & Standards

### Security Standards
- OWASP security guidelines
- Enterprise authentication standards
- Data protection regulations
- Industry best practices
- Regular security audits

### Accessibility Standards
- WCAG 2.1 AA compliance
- Section 508 compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast requirements

## Maintenance & Updates

### Regular Maintenance
- Security patch updates
- Dependency updates
- Performance monitoring
- Error tracking
- User feedback integration

### Future Enhancements
- Biometric authentication
- Single Sign-On (SSO) integration
- Advanced threat detection
- Enhanced session management
- Mobile app integration

## Support & Documentation

### User Support
- In-app help documentation
- Support contact integration
- FAQ and troubleshooting
- Video tutorials
- Live chat support

### Developer Documentation
- API documentation
- Integration guides
- Security guidelines
- Testing procedures
- Deployment instructions

---

## Quick Start Guide

### 1. Development Setup
```bash
npm install
npm run dev
```

### 2. Access Authentication Screens
- Login: http://localhost:3000/login
- Business Units: http://localhost:3000/business-unit-selection
- 2FA: http://localhost:3000/two-factor
- Password Reset: http://localhost:3000/password-reset
- Account Locked: http://localhost:3000/account-locked
- Session Expired: http://localhost:3000/session-expired

### 3. Test Authentication Flow
1. Navigate to `/login`
2. Use demo credentials: admin@carmen.com / password
3. Complete 2FA with code: 123456
4. Select a business unit
5. Access dashboard

### 4. Test Security Features
1. Try 5 failed login attempts to trigger lockout
2. Test password reset workflow
3. Wait for session expiration
4. Verify 2FA code expiration

This Authorization Module provides a comprehensive, secure, and user-friendly authentication system that meets enterprise requirements while maintaining excellent user experience standards. 