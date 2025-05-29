'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CarmenLogo } from '@/components/ui/carmen-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function SessionExpiredPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear all authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('selectedBusinessUnit');
    localStorage.removeItem('businessUnitId');
    localStorage.removeItem('twoFactorVerified');
    localStorage.removeItem('sessionStartTime');
  }, []);

  const handleSignInAgain = () => {
    router.push('/login');
  };

  const handleContactSupport = () => {
    window.open('mailto:support@carmen.com?subject=Session Management - Assistance Required', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <CarmenLogo size="lg" className="mb-4" />
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Session Expired
          </h1>
          <p className="text-gray-600">
            Your session has expired for security reasons
          </p>
        </div>

        {/* Session Information */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="text-center space-y-6">
              {/* Session Details */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-yellow-800">Session Timeout</span>
                </div>
                <p className="text-sm text-yellow-700">
                  You have been automatically signed out due to inactivity
                </p>
              </div>

              {/* Why did this happen */}
              <div className="text-left space-y-4">
                <h3 className="font-semibold text-gray-900">Why did my session expire?</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    Sessions automatically expire after 30 minutes of inactivity
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    This protects your account from unauthorized access
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    Your work has been saved automatically where possible
                  </li>
                </ul>
              </div>

              {/* What happens next */}
              <div className="text-left space-y-4">
                <h3 className="font-semibold text-gray-900">What happens next?</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Sign in again</p>
                      <p className="text-xs text-gray-600">Use your credentials to access your account</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Resume your work</p>
                      <p className="text-xs text-gray-600">Continue where you left off</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-purple-100 rounded-full p-1 mr-3 mt-0.5">
                      <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Stay active</p>
                      <p className="text-xs text-gray-600">Regular activity keeps your session alive</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button onClick={handleSignInAgain} className="w-full">
                  Sign In Again
                </Button>
                
                <Button
                  onClick={handleContactSupport}
                  variant="outline"
                  className="w-full"
                >
                  Contact Support
                </Button>
              </div>

              {/* Additional Information */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Having trouble? Our support team is here to help.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Management Tips */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Session Management Tips</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Save your work frequently to avoid data loss</li>
            <li>• Use &quot;Remember me&quot; for trusted devices</li>
            <li>• Sign out manually when using shared computers</li>
            <li>• Keep your browser updated for better security</li>
          </ul>
        </div>

        {/* Security Notice */}
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-gray-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Security Notice</h4>
              <p className="text-xs text-gray-600">
                Automatic session expiration helps protect your account and sensitive business data. 
                This is a standard security practice in enterprise applications.
              </p>
            </div>
          </div>
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