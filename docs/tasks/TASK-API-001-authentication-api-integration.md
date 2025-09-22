# TASK-API-001: Implement Authentication API Integration

## Overview
Implement comprehensive API integration for authentication services including login, session management, password operations, and security features for the Carmen Supply Chain Mobile Application.

## Priority
**High** - Critical foundation for all API communications

## Estimated Effort
**6-10 hours**

## Dependencies
- TASK-AUTH-001: Core Authentication Service (parallel development)

## Requirements

### Functional Requirements
Based on [Authentication API Documentation](../api/authentication-api.md):

1. **Authentication Endpoints**
   - User login with email/password
   - Two-factor authentication verification
   - Session validation and refresh
   - Password reset functionality
   - Account lockout management

2. **Session Management**
   - Session extension capabilities
   - Session validation
   - Logout functionality
   - Multi-device session handling

3. **Security Features**
   - JWT token management
   - Secure token storage and transmission
   - Request signing and validation
   - Rate limiting and retry logic

4. **Error Handling**
   - Comprehensive error response handling
   - Network error recovery
   - Authentication failure management
   - User-friendly error messages

5. **Business Unit Management**
   - Business unit retrieval
   - Business unit selection
   - Permission validation

### Technical Requirements

1. **API Client Structure**
   ```typescript
   interface AuthAPIClient {
     login(credentials: LoginRequest): Promise<LoginResponse>;
     logout(): Promise<void>;
     validateSession(): Promise<SessionValidationResponse>;
     extendSession(): Promise<SessionExtensionResponse>;
     resetPassword(email: string): Promise<void>;
     verifyTwoFactor(code: string): Promise<TwoFactorResponse>;
     getBusinessUnits(): Promise<BusinessUnit[]>;
   }
   ```

2. **Request/Response Types**
   ```typescript
   interface LoginRequest {
     email: string;
     password: string;
     businessUnitId?: string;
     rememberMe?: boolean;
     deviceInfo?: DeviceInfo;
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

3. **Error Handling**
   - Standardized error response format
   - Network error detection and retry
   - Authentication error classification
   - User-friendly error messaging

## Implementation Details

### Core API Client

#### 1. Base API Client
```typescript
// src/lib/api/baseClient.ts
export class BaseAPIClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  protected async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      method: options.method || 'GET',
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    };

    // Add authentication token if available
    const token = this.getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      throw new APIError('Network error', 'NETWORK_ERROR', error);
    }
  }

  private async handleResponse<T>(response: Response): Promise<APIResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJSON = contentType?.includes('application/json');

    if (!response.ok) {
      const errorData = isJSON ? await response.json() : { message: response.statusText };
      throw new APIError(
        errorData.message || 'Request failed',
        errorData.code || 'REQUEST_FAILED',
        errorData,
        response.status
      );
    }

    if (isJSON) {
      return await response.json();
    }

    return { success: true, data: null as T };
  }

  private getAuthToken(): string | null {
    // Get token from AuthService
    return authService.getToken();
  }
}
```

#### 2. Authentication API Client
```typescript
// src/lib/api/authClient.ts
export class AuthAPIClient extends BaseAPIClient {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1');
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse['data']>('/auth/login', {
      method: 'POST',
      body: credentials,
    });

    return {
      success: response.success,
      data: response.data,
      message: response.message,
      timestamp: response.timestamp,
    };
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async validateSession(): Promise<SessionValidationResponse> {
    return await this.request<SessionValidationResponse>('/auth/validate-session');
  }

  async extendSession(additionalTime?: number): Promise<SessionExtensionResponse> {
    return await this.request<SessionExtensionResponse>('/auth/extend-session', {
      method: 'POST',
      body: { additionalTime },
    });
  }

  async resetPassword(email: string): Promise<void> {
    await this.request('/auth/reset-password', {
      method: 'POST',
      body: { email },
    });
  }

  async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    await this.request('/auth/confirm-reset-password', {
      method: 'POST',
      body: { token, newPassword },
    });
  }

  async verifyTwoFactor(code: string): Promise<TwoFactorResponse> {
    return await this.request<TwoFactorResponse>('/auth/verify-2fa', {
      method: 'POST',
      body: { code },
    });
  }

  async setupTwoFactor(): Promise<TwoFactorSetupResponse> {
    return await this.request<TwoFactorSetupResponse>('/auth/setup-2fa', {
      method: 'POST',
    });
  }

  async getBusinessUnits(): Promise<BusinessUnit[]> {
    const response = await this.request<{ businessUnits: BusinessUnit[] }>('/auth/business-units');
    return response.data.businessUnits;
  }

  async selectBusinessUnit(businessUnitId: string): Promise<void> {
    await this.request('/auth/select-business-unit', {
      method: 'POST',
      body: { businessUnitId },
    });
  }
}
```

### Error Handling

#### 1. API Error Class
```typescript
// src/lib/api/errors.ts
export class APIError extends Error {
  public code: string;
  public statusCode?: number;
  public details?: any;

  constructor(message: string, code: string, details?: any, statusCode?: number) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.details = details;
    this.statusCode = statusCode;
  }

  static isNetworkError(error: any): boolean {
    return error instanceof TypeError && error.message.includes('fetch');
  }

  static isAuthenticationError(error: APIError): boolean {
    return error.statusCode === 401 || error.code === 'AUTHENTICATION_FAILED';
  }

  static isValidationError(error: APIError): boolean {
    return error.statusCode === 400 || error.code === 'VALIDATION_ERROR';
  }

  static isServerError(error: APIError): boolean {
    return (error.statusCode || 0) >= 500;
  }
}
```

#### 2. Error Handler Utility
```typescript
// src/lib/api/errorHandler.ts
export class APIErrorHandler {
  static handleAuthenticationError(error: APIError): void {
    // Clear authentication state
    authService.clearAuth();
    
    // Redirect to appropriate page based on error
    if (error.code === 'ACCOUNT_LOCKED') {
      redirectToAccountLocked();
    } else if (error.code === 'SESSION_EXPIRED') {
      redirectToSessionExpired();
    } else {
      redirectToLogin();
    }
  }

  static handleValidationError(error: APIError): string {
    // Extract user-friendly validation messages
    if (error.details?.validationErrors) {
      return error.details.validationErrors
        .map((err: any) => err.message)
        .join(', ');
    }
    return error.message;
  }

  static handleNetworkError(error: Error): string {
    return 'Network connection error. Please check your internet connection and try again.';
  }

  static handleServerError(error: APIError): string {
    return 'Server error occurred. Please try again later.';
  }

  static getErrorMessage(error: any): string {
    if (APIError.isNetworkError(error)) {
      return this.handleNetworkError(error);
    }

    if (error instanceof APIError) {
      if (APIError.isValidationError(error)) {
        return this.handleValidationError(error);
      }
      if (APIError.isServerError(error)) {
        return this.handleServerError(error);
      }
      return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
  }
}
```

### Retry Logic and Network Resilience

#### 1. Retry Utility
```typescript
// src/lib/api/retry.ts
interface RetryOptions {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryCondition?: (error: any) => boolean;
}

export class RetryHandler {
  private static defaultOptions: RetryOptions = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2,
    retryCondition: (error) => {
      // Retry on network errors and 5xx server errors
      return APIError.isNetworkError(error) || 
             (error instanceof APIError && APIError.isServerError(error));
    },
  };

  static async withRetry<T>(
    operation: () => Promise<T>,
    options: Partial<RetryOptions> = {}
  ): Promise<T> {
    const config = { ...this.defaultOptions, ...options };
    let lastError: any;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Don't retry if condition is not met
        if (!config.retryCondition!(error)) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === config.maxAttempts) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          config.baseDelay * Math.pow(config.backoffFactor, attempt - 1),
          config.maxDelay
        );

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}
```

#### 2. Enhanced API Client with Retry
```typescript
// Enhanced BaseAPIClient with retry logic
export class BaseAPIClient {
  protected async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<APIResponse<T>> {
    return RetryHandler.withRetry(
      () => this.makeRequest<T>(endpoint, options),
      {
        maxAttempts: options.retryAttempts || 3,
        retryCondition: (error) => {
          // Don't retry authentication errors
          if (error instanceof APIError && APIError.isAuthenticationError(error)) {
            return false;
          }
          return RetryHandler.defaultOptions.retryCondition!(error);
        },
      }
    );
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestOptions
  ): Promise<APIResponse<T>> {
    // Original request implementation
  }
}
```

### Integration with Authentication Service

#### 1. API Service Integration
```typescript
// src/lib/api/index.ts
export const authAPI = new AuthAPIClient();

// Integration with AuthService
export class AuthServiceAPIIntegration {
  static async login(credentials: LoginCredentials): Promise<LoginResult> {
    try {
      const response = await authAPI.login({
        email: credentials.email,
        password: credentials.password,
        businessUnitId: credentials.businessUnitId,
        rememberMe: credentials.rememberMe,
        deviceInfo: this.getDeviceInfo(),
      });

      // Update AuthService with response data
      authService.setAuth(
        response.data.token,
        response.data.user,
        response.data.expiresIn
      );

      if (response.data.requiresTwoFactor) {
        return { success: true, requiresTwoFactor: true };
      }

      return { success: true, user: response.data.user };
    } catch (error) {
      if (error instanceof APIError) {
        // Handle specific authentication errors
        if (error.code === 'INVALID_CREDENTIALS') {
          authService.handleFailedLogin();
        }
        APIErrorHandler.handleAuthenticationError(error);
      }
      throw error;
    }
  }

  static async validateSession(): Promise<boolean> {
    try {
      const response = await authAPI.validateSession();
      return response.data.valid;
    } catch (error) {
      if (error instanceof APIError && APIError.isAuthenticationError(error)) {
        authService.clearAuth();
        return false;
      }
      throw error;
    }
  }

  static async extendSession(): Promise<void> {
    try {
      const response = await authAPI.extendSession();
      authService.setAuth(
        response.data.token,
        authService.getCurrentUser()!,
        response.data.expiresIn
      );
    } catch (error) {
      if (error instanceof APIError && APIError.isAuthenticationError(error)) {
        authService.clearAuth();
      }
      throw error;
    }
  }

  private static getDeviceInfo(): DeviceInfo {
    return {
      deviceId: this.getDeviceId(),
      deviceName: this.getDeviceName(),
      platform: this.getPlatform(),
      version: this.getVersion(),
    };
  }
}
```

### Request Interceptors and Middleware

#### 1. Request Interceptor
```typescript
// src/lib/api/interceptors.ts
export class RequestInterceptor {
  static addAuthToken(config: RequestInit): RequestInit {
    const token = authService.getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
    return config;
  }

  static addRequestId(config: RequestInit): RequestInit {
    config.headers = {
      ...config.headers,
      'X-Request-ID': generateRequestId(),
    };
    return config;
  }

  static addDeviceInfo(config: RequestInit): RequestInit {
    config.headers = {
      ...config.headers,
      'X-Device-ID': getDeviceId(),
      'X-Platform': getPlatform(),
    };
    return config;
  }
}
```

#### 2. Response Interceptor
```typescript
export class ResponseInterceptor {
  static handleAuthenticationResponse(response: Response): Response {
    // Handle token refresh
    const newToken = response.headers.get('X-New-Token');
    if (newToken) {
      authService.updateToken(newToken);
    }

    // Handle session warnings
    const sessionWarning = response.headers.get('X-Session-Warning');
    if (sessionWarning) {
      // Show session expiry warning
      notificationService.showSessionWarning();
    }

    return response;
  }

  static logResponse(response: Response): Response {
    // Log response for debugging
    console.log(`API Response: ${response.status} ${response.url}`);
    return response;
  }
}
```

## Testing Requirements

### Unit Tests
```typescript
describe('Authentication API Integration', () => {
  describe('AuthAPIClient', () => {
    test('should login with valid credentials')
    test('should handle login failure')
    test('should validate session')
    test('should extend session')
    test('should handle logout')
    test('should reset password')
    test('should verify two-factor authentication')
  })

  describe('Error Handling', () => {
    test('should handle network errors')
    test('should handle authentication errors')
    test('should handle validation errors')
    test('should handle server errors')
  })

  describe('Retry Logic', () => {
    test('should retry on network errors')
    test('should not retry on authentication errors')
    test('should respect max retry attempts')
    test('should use exponential backoff')
  })
})
```

### Integration Tests
```typescript
describe('API Integration Tests', () => {
  test('should authenticate and maintain session')
  test('should handle session expiry gracefully')
  test('should retry failed requests')
  test('should handle offline scenarios')
})
```

## Acceptance Criteria

### Core Functionality
- [ ] Successfully authenticate users with email/password
- [ ] Handle two-factor authentication flow
- [ ] Validate and extend user sessions
- [ ] Manage business unit selection
- [ ] Handle password reset functionality

### Error Handling
- [ ] Gracefully handle network errors with retry logic
- [ ] Properly handle authentication failures
- [ ] Show user-friendly error messages
- [ ] Automatically redirect on authentication errors

### Security
- [ ] Securely transmit authentication credentials
- [ ] Properly handle JWT tokens
- [ ] Implement request signing and validation
- [ ] Handle session security properly

### Performance
- [ ] Implement efficient retry logic with exponential backoff
- [ ] Cache appropriate responses
- [ ] Handle offline scenarios gracefully
- [ ] Optimize network requests

## Implementation Steps

1. **Setup Base API Infrastructure**
   - Create base API client with common functionality
   - Implement error handling classes
   - Set up request/response interceptors

2. **Implement Authentication API Client**
   - Create AuthAPIClient with all endpoints
   - Implement request/response type definitions
   - Add comprehensive error handling

3. **Add Retry Logic and Network Resilience**
   - Implement retry handler with exponential backoff
   - Add network error detection
   - Configure retry policies for different error types

4. **Integrate with Authentication Service**
   - Connect API client with AuthService
   - Implement token management
   - Add session validation and extension

5. **Add Security Features**
   - Implement request signing
   - Add device information tracking
   - Secure token storage and transmission

6. **Testing Implementation**
   - Unit tests for all API methods
   - Integration tests with mock server
   - Error handling and retry logic tests

7. **Documentation and Examples**
   - API integration documentation
   - Usage examples and best practices
   - Error handling guidelines

## Related Tasks
- TASK-AUTH-001: Core Authentication Service (parallel development)
- TASK-API-002: Receiving API Integration (follows similar patterns)
- TASK-API-004: Error Handling and Retry Logic (extends this task)

## Notes
- This task provides the foundation for all API communications
- Focus on security, reliability, and user experience
- Implement comprehensive error handling and retry logic
- Consider offline scenarios and network resilience
- Plan for future API endpoint additions