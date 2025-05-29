'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CarmenLogo } from '@/components/ui/carmen-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AccountLockedPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // Check if there's a lockout time in localStorage
    const lockoutTime = localStorage.getItem('accountLockoutTime');
    if (lockoutTime) {
      const lockTime = parseInt(lockoutTime);
      const currentTime = Date.now();
      const timeDiff = Math.floor((lockTime + 900000 - currentTime) / 1000); // 15 minutes lockout
      
      if (timeDiff > 0) {
        setTimeLeft(timeDiff);
      } else {
        setIsUnlocked(true);
        localStorage.removeItem('accountLockoutTime');
      }
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsUnlocked(true);
          localStorage.removeItem('accountLockoutTime');
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  const handleContactSupport = () => {
    // In a real app, this would open a support ticket or contact form
    window.open('mailto:support@carmen.com?subject=Account Locked - Assistance Required', '_blank');
  };

  const handleUnlockAccount = () => {
    // Clear lockout and redirect to login
    localStorage.removeItem('accountLockoutTime');
    localStorage.removeItem('failedLoginAttempts');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <CarmenLogo size="lg" className="mb-4" />
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Account Temporarily Locked
          </h1>
          <p className="text-gray-600">
            Your account has been locked due to multiple failed login attempts
          </p>
        </div>

        {/* Lock Status */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            {!isUnlocked ? (
              <div className="text-center space-y-6">
                {/* Countdown Timer */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <p className="text-sm text-red-700">
                    Time remaining until automatic unlock
                  </p>
                </div>

                {/* Security Information */}
                <div className="text-left space-y-4">
                  <h3 className="font-semibold text-gray-900">Why was my account locked?</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Multiple incorrect password attempts were detected
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      This is a security measure to protect your account
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Your account will automatically unlock after 15 minutes
                    </li>
                  </ul>
                </div>

                {/* What to do next */}
                <div className="text-left space-y-4">
                  <h3 className="font-semibold text-gray-900">What can I do?</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Wait for automatic unlock</p>
                        <p className="text-xs text-gray-600">Your account will be available again in {formatTime(timeLeft)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Reset your password</p>
                        <p className="text-xs text-gray-600">If you&apos;ve forgotten your password, you can reset it</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-purple-100 rounded-full p-1 mr-3 mt-0.5">
                        <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Contact support</p>
                        <p className="text-xs text-gray-600">Get immediate assistance from our support team</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push('/password-reset')}
                    variant="outline"
                    className="w-full"
                  >
                    Reset Password
                  </Button>
                  
                  <Button
                    onClick={handleContactSupport}
                    variant="outline"
                    className="w-full"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            ) : (
              /* Account Unlocked */
              <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Unlocked</h3>
                  <p className="text-gray-600">
                    Your account is now available. You can proceed to login.
                  </p>
                </div>

                <Button onClick={handleUnlockAccount} className="w-full">
                  Continue to Login
                </Button>
              </div>
            )}

            {/* Back to Login */}
            <div className="text-center pt-6 border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to login
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Security Tips */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Security Tips</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Use a strong, unique password for your account</li>
            <li>• Enable two-factor authentication when available</li>
            <li>• Never share your login credentials with others</li>
            <li>• Contact support if you suspect unauthorized access</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            © 2025 Carmen Software. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
} 