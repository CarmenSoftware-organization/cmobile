"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SpotCheckPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new multi-page setup
    router.push("/spot-check/location");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to setup...</p>
      </div>
    </div>
  );
}

// ...rest of file
