"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function PhysicalCountSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <CheckCircle2 className="w-20 h-20 text-green-600 mb-4" />
      <h1 className="text-2xl font-bold text-green-700 mb-2">Physical Count Submitted!</h1>
      <div className="text-gray-600 mb-6">Your physical count session has been successfully submitted for review.</div>
      <button
        className="w-60 py-3 bg-blue-700 text-white rounded-lg font-semibold mb-3"
        onClick={() => router.push("/physical-count/sessions")}
      >
        Back to Sessions
      </button>
      <button
        className="w-60 py-3 bg-gray-200 text-blue-700 rounded-lg font-semibold"
        onClick={() => router.push("/dashboard")}
      >
        Go to Dashboard
      </button>
    </div>
  );
}
