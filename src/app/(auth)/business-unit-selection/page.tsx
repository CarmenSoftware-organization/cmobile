'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CarmenLogo } from '@/components/ui/carmen-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BusinessUnit {
  id: string;
  name: string;
  location: string;
  currency: string;
  type: string;
  status: 'active' | 'inactive';
  lastAccessed?: string;
}

export default function BusinessUnitSelectionPage() {
  const router = useRouter();
  const [selectedBU, setSelectedBU] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Mock business units data
  const businessUnits: BusinessUnit[] = [
    {
      id: 'bu-001',
      name: 'Grand Hotel Singapore',
      location: 'Singapore',
      currency: 'SGD',
      type: 'Luxury Hotel',
      status: 'active',
      lastAccessed: '2025-05-25'
    },
    {
      id: 'bu-002',
      name: 'Business Hotel Jakarta',
      location: 'Jakarta, Indonesia',
      currency: 'IDR',
      type: 'Business Hotel',
      status: 'active',
      lastAccessed: '2025-05-20'
    },
    {
      id: 'bu-003',
      name: 'Boutique Hotel Bangkok',
      location: 'Bangkok, Thailand',
      currency: 'THB',
      type: 'Boutique Hotel',
      status: 'active'
    },
    {
      id: 'bu-004',
      name: 'Resort Bali',
      location: 'Bali, Indonesia',
      currency: 'IDR',
      type: 'Resort',
      status: 'inactive'
    }
  ];

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    const email = localStorage.getItem('userEmail');
    
    if (!authToken) {
      router.push('/login');
      return;
    }
    
    if (email) {
      setUserEmail(email);
    }
  }, [router]);

  const handleBUSelection = async () => {
    if (!selectedBU) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call to set business unit context
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const selectedBusinessUnit = businessUnits.find(bu => bu.id === selectedBU);
      
      // Store selected business unit
      localStorage.setItem('selectedBusinessUnit', JSON.stringify(selectedBusinessUnit));
      localStorage.setItem('businessUnitId', selectedBU);
      
      // Navigate to dashboard
      router.push('/dashboard');
    } catch {
      // Handle error
      console.error('Failed to set business unit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('selectedBusinessUnit');
    localStorage.removeItem('businessUnitId');
    router.push('/login');
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Inactive
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <CarmenLogo size="lg" className="mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Select Business Unit
          </h1>
          <p className="text-gray-600">
            Welcome {userEmail}. Please select the property you want to access.
          </p>
        </div>

        {/* Business Unit Selection */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Available Properties
                </h2>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Sign out
                </button>
              </div>

              {/* Business Units List */}
              <div className="space-y-3">
                {businessUnits.map((bu) => (
                  <div
                    key={bu.id}
                    className={cn(
                      "border rounded-lg p-4 cursor-pointer transition-all duration-200",
                      selectedBU === bu.id
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                      bu.status === 'inactive' && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => bu.status === 'active' && setSelectedBU(bu.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                          selectedBU === bu.id
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        )}>
                          {selectedBU === bu.id && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{bu.name}</h3>
                          <p className="text-sm text-gray-500">{bu.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(bu.status)}
                        <p className="text-xs text-gray-500 mt-1">
                          {bu.type} • {bu.currency}
                        </p>
                        {bu.lastAccessed && (
                          <p className="text-xs text-gray-400 mt-1">
                            Last accessed: {new Date(bu.lastAccessed).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Button */}
              <div className="pt-4">
                <Button
                  onClick={handleBUSelection}
                  disabled={!selectedBU || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Accessing...
                    </div>
                  ) : (
                    'Continue to Dashboard'
                  )}
                </Button>
              </div>

              {/* Help Text */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-500">
                  Don&apos;t see your property? Contact your administrator for access.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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