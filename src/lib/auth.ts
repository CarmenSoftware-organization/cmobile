export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  businessUnits: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  selectedBusinessUnit: string | null;
  twoFactorVerified: boolean;
}

export class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('authToken');
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    
    if (!token || !sessionExpiry) return false;
    
    // Check if session has expired
    if (Date.now() > parseInt(sessionExpiry)) {
      this.clearAuth();
      return false;
    }
    
    return true;
  }

  // Get current user
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // Set authentication data
  setAuth(token: string, user: User, expiresIn: number = 1800000): void { // 30 minutes default
    if (typeof window === 'undefined') return;
    
    const sessionExpiry = Date.now() + expiresIn;
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('sessionExpiry', sessionExpiry.toString());
    localStorage.setItem('userEmail', user.email);
  }

  // Clear authentication data
  clearAuth(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionExpiry');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('selectedBusinessUnit');
    localStorage.removeItem('businessUnitId');
    localStorage.removeItem('twoFactorVerified');
    localStorage.removeItem('accountLockoutTime');
    localStorage.removeItem('failedLoginAttempts');
  }

  // Set business unit
  setBusinessUnit(businessUnit: { id: string; name: string; [key: string]: unknown }): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('selectedBusinessUnit', JSON.stringify(businessUnit));
    localStorage.setItem('businessUnitId', businessUnit.id);
  }

  // Get selected business unit
  getSelectedBusinessUnit(): { id: string; name: string; [key: string]: unknown } | null {
    if (typeof window === 'undefined') return null;
    
    const buStr = localStorage.getItem('selectedBusinessUnit');
    if (!buStr) return null;
    
    try {
      return JSON.parse(buStr);
    } catch {
      return null;
    }
  }

  // Check if 2FA is verified
  isTwoFactorVerified(): boolean {
    if (typeof window === 'undefined') return false;
    
    return localStorage.getItem('twoFactorVerified') === 'true';
  }

  // Set 2FA verification
  setTwoFactorVerified(verified: boolean): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('twoFactorVerified', verified.toString());
  }

  // Handle failed login attempts
  handleFailedLogin(): boolean {
    if (typeof window === 'undefined') return false;
    
    const attempts = parseInt(localStorage.getItem('failedLoginAttempts') || '0');
    const newAttempts = attempts + 1;
    
    localStorage.setItem('failedLoginAttempts', newAttempts.toString());
    
    // Lock account after 5 failed attempts
    if (newAttempts >= 5) {
      localStorage.setItem('accountLockoutTime', Date.now().toString());
      return true; // Account is locked
    }
    
    return false; // Account is not locked
  }

  // Check if account is locked
  isAccountLocked(): boolean {
    if (typeof window === 'undefined') return false;
    
    const lockoutTime = localStorage.getItem('accountLockoutTime');
    if (!lockoutTime) return false;
    
    const lockTime = parseInt(lockoutTime);
    const currentTime = Date.now();
    const timeDiff = currentTime - lockTime;
    
    // 15 minutes lockout period
    if (timeDiff < 900000) {
      return true;
    } else {
      // Clear lockout if time has passed
      localStorage.removeItem('accountLockoutTime');
      localStorage.removeItem('failedLoginAttempts');
      return false;
    }
  }

  // Clear failed login attempts (on successful login)
  clearFailedAttempts(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('failedLoginAttempts');
    localStorage.removeItem('accountLockoutTime');
  }

  // Extend session
  extendSession(additionalTime: number = 1800000): void { // 30 minutes default
    if (typeof window === 'undefined') return;
    
    const currentExpiry = localStorage.getItem('sessionExpiry');
    if (currentExpiry) {
      const newExpiry = Date.now() + additionalTime;
      localStorage.setItem('sessionExpiry', newExpiry.toString());
    }
  }

  // Get session time remaining (in seconds)
  getSessionTimeRemaining(): number {
    if (typeof window === 'undefined') return 0;
    
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    if (!sessionExpiry) return 0;
    
    const timeRemaining = parseInt(sessionExpiry) - Date.now();
    return Math.max(0, Math.floor(timeRemaining / 1000));
  }

  // Check if session is about to expire (within 5 minutes)
  isSessionAboutToExpire(): boolean {
    const timeRemaining = this.getSessionTimeRemaining();
    return timeRemaining > 0 && timeRemaining <= 300; // 5 minutes
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Utility functions
export const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

export const redirectToBusinessUnitSelection = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/business-unit-selection';
  }
};

export const redirectToDashboard = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/dashboard';
  }
};

export const redirectToSessionExpired = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/session-expired';
  }
};

export const redirectToAccountLocked = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/account-locked';
  }
}; 