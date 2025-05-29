"use client";

import { useRouter } from "next/navigation";
import { ClipboardList, SearchCheck } from "lucide-react";

export default function StockTakeOptionsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center gap-8">
        <div
          className="w-72 p-6 bg-white rounded-xl shadow cursor-pointer flex flex-col items-center hover:bg-blue-50 transition"
          onClick={() => router.push("/physical-count")}
        >
          <ClipboardList className="w-10 h-10 text-blue-700 mb-2" />
          <div className="font-semibold text-lg mb-1">Physical Count</div>
          <div className="text-gray-500 text-center text-sm">
            Count all items in a location for a full inventory check.
          </div>
        </div>
        <div
          className="w-72 p-6 bg-white rounded-xl shadow cursor-pointer flex flex-col items-center hover:bg-blue-50 transition"
          onClick={() => router.push("/spot-check")}
        >
          <SearchCheck className="w-10 h-10 text-green-600 mb-2" />
          <div className="font-semibold text-lg mb-1">Spot Check</div>
          <div className="text-gray-500 text-center text-sm">
            Quickly verify a subset of items for compliance and accuracy.
          </div>
        </div>
      </main>
    </div>
  );
}
