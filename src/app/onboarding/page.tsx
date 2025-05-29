export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 text-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1E40AF]">Welcome!</h1>
          <p className="text-gray-600 mt-2">Let&apos;s get you set up</p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            This is a placeholder onboarding page. The Welcome Screen routed here for first-time users.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-gray-900">Step 1: Terms & Conditions</h3>
            <p className="text-sm text-gray-600 mt-1">Review and accept our terms of service</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-gray-900">Step 2: Account Setup</h3>
            <p className="text-sm text-gray-600 mt-1">Configure your profile and preferences</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-gray-900">Step 3: Business Unit Assignment</h3>
            <p className="text-sm text-gray-600 mt-1">Connect to your hotel properties</p>
          </div>
          
          <button className="w-full bg-[#1E40AF] text-white py-2 px-4 rounded-md hover:bg-[#1E40AF]/90 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
} 