'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CarmenLogo } from '@/components/ui/carmen-logo';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { cn } from '@/lib/utils';

interface WelcomeScreenProps {
  onComplete?: () => void;
  splashDuration?: number;
  enableAnimations?: boolean;
}

type LoadingPhase = 'initializing' | 'authentication' | 'synchronization' | 'finalizing' | 'complete';

interface SystemStatus {
  networkConnectivity: boolean;
  authenticationStatus: 'checking' | 'valid' | 'expired' | 'invalid';
  appVersion: 'checking' | 'current' | 'update_required';
  businessUnitData: 'loading' | 'loaded' | 'error';
  permissions: 'checking' | 'granted' | 'denied';
  security: 'checking' | 'verified' | 'failed';
}

export function WelcomeScreen({ 
  onComplete,
  splashDuration = 4000,
  enableAnimations = true 
}: WelcomeScreenProps) {
  const router = useRouter();
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>('initializing');
  const [progress, setProgress] = useState(0);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    networkConnectivity: false,
    authenticationStatus: 'checking',
    appVersion: 'checking',
    businessUnitData: 'loading',
    permissions: 'checking',
    security: 'checking'
  });
  const [showLogo, setShowLogo] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Animation timeline based on specification
  useEffect(() => {
    if (!enableAnimations) {
      // Show all elements immediately if animations disabled
      setShowLogo(true);
      setShowTitle(true);
      setShowTagline(true);
      setShowLoading(true);
      setShowFooter(true);
      return;
    }

    const timeline = [
      { delay: 500, action: () => setShowLogo(true) },
      { delay: 1000, action: () => setShowTitle(true) },
      { delay: 1300, action: () => setShowTagline(true) },
      { delay: 1600, action: () => setShowLoading(true) },
      { delay: 2000, action: () => setShowFooter(true) }
    ];

    const timeouts: NodeJS.Timeout[] = [];
    timeline.forEach(({ delay, action }) => {
      const timeout = setTimeout(action, delay);
      timeouts.push(timeout);
    });

    // Cleanup function
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [enableAnimations]);

  // Route decision logic - redirect to login
  const routeToNextScreen = useCallback(() => {
    router.push('/login');

    if (onComplete) {
      onComplete();
    }
  }, [router, onComplete]);

  // System initialization and checks
  useEffect(() => {
    const initializeSystem = async () => {
      try {
        // Simulate system checks in parallel
        const checks = [
          checkNetworkConnectivity(),
          checkAuthenticationStatus(),
          checkAppVersion(),
          loadBusinessUnitData(),
          checkPermissions(),
          verifySecurityIntegrity()
        ];

        // Run checks with progress tracking
        for (let i = 0; i < checks.length; i++) {
          await checks[i];
          setProgress(((i + 1) / checks.length) * 100);
          
          // Update loading phase based on progress
          if (i === 1) setLoadingPhase('authentication');
          else if (i === 3) setLoadingPhase('synchronization');
          else if (i === 5) setLoadingPhase('finalizing');
        }

        setLoadingPhase('complete');
        
        // Determine route based on system status
        setTimeout(() => {
          routeToNextScreen();
        }, 500);

      } catch (err) {
        console.error('System initialization failed:', err);
        setError('System initialization failed. Please try again.');
        
        // Fallback to login after timeout
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    initializeSystem();
  }, [router, routeToNextScreen]);

  // Timeout handling
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (loadingPhase !== 'complete') {
        console.warn('Splash screen timeout - routing to fallback');
        router.push('/login');
      }
    }, splashDuration + 1000); // Extra second for safety

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [splashDuration, loadingPhase, router]);

  // System check functions
  const checkNetworkConnectivity = async (): Promise<void> => {
    return new Promise((resolve) => {
      // Simulate network check
      setTimeout(() => {
        const isOnline = navigator.onLine;
        setSystemStatus(prev => ({ ...prev, networkConnectivity: isOnline }));
        resolve();
      }, 300);
    });
  };

  const checkAuthenticationStatus = async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check for existing valid tokens
        const token = localStorage.getItem('auth_token');
        const status = token ? 'valid' : 'expired';
        setSystemStatus(prev => ({ ...prev, authenticationStatus: status }));
        resolve();
      }, 400);
    });
  };

  const checkAppVersion = async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Version check simulation
        setSystemStatus(prev => ({ ...prev, appVersion: 'current' }));
        resolve();
      }, 200);
    });
  };

  const loadBusinessUnitData = async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // BU data loading simulation
        setSystemStatus(prev => ({ ...prev, businessUnitData: 'loaded' }));
        resolve();
      }, 500);
    });
  };

  const checkPermissions = async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Permissions check simulation
        setSystemStatus(prev => ({ ...prev, permissions: 'granted' }));
        resolve();
      }, 300);
    });
  };

  const verifySecurityIntegrity = async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Security verification simulation
        setSystemStatus(prev => ({ ...prev, security: 'verified' }));
        resolve();
      }, 400);
    });
  };

  const getProgressMessage = () => {
    switch (loadingPhase) {
      case 'initializing': return 'Initializing...';
      case 'authentication': return 'Checking authentication...';
      case 'synchronization': return 'Synchronizing data...';
      case 'finalizing': return 'Finalizing setup...';
      case 'complete': return 'Ready!';
      default: return 'Loading...';
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-between p-6 safe-area-inset overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 z-10 bg-white/85 backdrop-blur-sm" />
      
      {/* Content Container */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center pt-20 w-full">
        {/* Carmen Logo */}
        <div 
          className={cn(
            "transition-all duration-800 ease-out",
            showLogo 
              ? "opacity-100 transform translate-y-0" 
              : "opacity-0 transform translate-y-4"
          )}
        >
          <CarmenLogo size="lg" className="mb-6" />
        </div>

        {/* App Title */}
        <div 
          className={cn(
            "transition-all duration-600 ease-out delay-500",
            showTitle 
              ? "opacity-100 transform translate-y-0" 
              : "opacity-0 transform translate-y-4"
          )}
        >
          <h1 className="text-3xl font-bold text-[#1E40AF] text-center mb-4">
            Supply Chain Mobile
          </h1>
        </div>

        {/* Tagline */}
        <div 
          className={cn(
            "transition-all duration-600 ease-out delay-800",
            showTagline 
              ? "opacity-100 transform translate-y-0" 
              : "opacity-0 transform translate-y-4"
          )}
        >
          <p className="text-lg text-[#6B7280] text-center mb-10">
            Hospitality Operations Excellence
          </p>
        </div>

        {/* Loading Section */}
        <div 
          className={cn(
            "flex flex-col items-center gap-4 transition-all duration-600 ease-out delay-1100",
            showLoading 
              ? "opacity-100 transform translate-y-0" 
              : "opacity-0 transform translate-y-4"
          )}
        >
          <LoadingIndicator size="lg" color="secondary" />
          
          {/* Progress Message */}
          <div className="text-center">
            <p className="text-sm text-[#6B7280] mb-1">
              {error || getProgressMessage()}
            </p>
            
            {/* Progress Bar */}
            <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#3B82F6] transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Network Status */}
          {!systemStatus.networkConnectivity && showLoading && (
            <p className="text-xs text-amber-600 text-center">
              Checking connection...
            </p>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div 
        className={cn(
          "relative z-20 transition-all duration-400 ease-out delay-1500",
          showFooter 
            ? "opacity-100 transform translate-y-0" 
            : "opacity-0 transform translate-y-4"
        )}
      >
        <div className="text-center pb-10">
          <p className="text-sm text-[#6B7280] mb-1">
            Powered by Carmen
          </p>
          <p className="text-xs text-[#6B7280]">
            Version 2.0
          </p>
        </div>
      </div>

      {/* Screen Reader Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {loadingPhase === 'initializing' && "Carmen Supply Chain Mobile App loading"}
        {loadingPhase === 'complete' && "App loaded successfully"}
        {error && `Error: ${error}`}
      </div>
    </div>
  );
} 