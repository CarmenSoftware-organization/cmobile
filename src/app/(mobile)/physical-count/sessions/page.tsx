"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockPhysicalCountSessions } from "@/mock/physicalCountData";
import { Search, Filter, Calendar, MapPin, Clock, Users, Play, Eye } from "lucide-react";

// Enhanced mock data with more session details
const enhancedSessions = mockPhysicalCountSessions.map(session => ({
  ...session,
  period: session.name.includes("June") ? "June 2024" : "May 2024",
  lastActivity: session.status === "In Progress" ? "2024-06-15T14:30:00Z" : session.completedAt || session.startedAt,
  assignedUsers: ["John Doe", "Jane Smith"],
  canResume: session.status === "In Progress" || session.status === "Review",
  canView: true,
  progress: Math.round((session.counted / session.total) * 100),
}));

type SessionStatus = "All" | "In Progress" | "Review" | "Completed" | "Draft";

interface EnhancedSession {
  id: number;
  name: string;
  location: string;
  locationType: string;
  businessUnit: string;
  status: string;
  counted: number;
  total: number;
  startedAt: string;
  completedAt: string | null;
  period: string;
  lastActivity: string;
  assignedUsers: string[];
  canResume: boolean;
  canView: boolean;
  progress: number;
}

export default function PhysicalCountSessionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<SessionStatus>("All");
  const [showFilters, setShowFilters] = useState(false);
  
  const sessions = enhancedSessions;

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.businessUnit.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || session.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStartNew = () => {
    router.push('/physical-count');
  };

  const handleSessionClick = (session: EnhancedSession) => {
    if (session.status === "Review") {
      router.push(`/physical-count/session/${session.id}/review`);
    } else if (session.canResume) {
      router.push(`/physical-count/session/${session.id}/count`);
    } else {
      // View-only mode for completed sessions
      router.push(`/physical-count/session/${session.id}/view`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "Review":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "In Progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "Draft":
        return "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300";
    }
  };

  const getActionIcon = (session: EnhancedSession) => {
    if (session.status === "Completed") {
      return <Eye className="w-4 h-4" />;
    } else if (session.canResume) {
      return <Play className="w-4 h-4" />;
    } else {
      return <Eye className="w-4 h-4" />;
    }
  };

  const getActionText = (session: EnhancedSession) => {
    if (session.status === "Completed") {
      return "View";
    } else if (session.status === "Review") {
      return "Review";
    } else if (session.canResume) {
      return "Resume";
    } else {
      return "View";
    }
  };

  const statusCounts = {
    All: sessions.length,
    "In Progress": sessions.filter(s => s.status === "In Progress").length,
    Review: sessions.filter(s => s.status === "Review").length,
    Completed: sessions.filter(s => s.status === "Completed").length,
    Draft: sessions.filter(s => s.status === "Draft").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="p-4 border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400">Physical Count Sessions</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage and resume your inventory counting sessions
        </p>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-4">
        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <div className="flex gap-3 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search sessions, locations, or business units..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {/* Status Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(Object.keys(statusCounts) as SessionStatus[]).map(status => (
              <button
                key={status}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {status} ({statusCounts[status]})
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
            onClick={handleStartNew}
          >
            Start New Count
          </button>
          <button
            className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => router.push('/physical-count/reports')}
          >
            View Reports
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex flex-col gap-3">
          {filteredSessions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center">
              <div className="text-gray-400 mb-2">
                <Calendar className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">No sessions found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || statusFilter !== "All" 
                  ? "Try adjusting your search or filter criteria"
                  : "Start your first physical count session"
                }
              </p>
              {!searchTerm && statusFilter === "All" && (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
                  onClick={handleStartNew}
                >
                  Start New Count
                </button>
              )}
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => handleSessionClick(session)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{session.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {session.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {session.period}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {session.assignedUsers.join(", ")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(session.lastActivity).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 text-right">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                      {getActionIcon(session)}
                      <span className="text-sm">{getActionText(session)}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {session.counted} / {session.total} items ({session.progress}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        session.status === "Completed" 
                          ? "bg-green-500" 
                          : session.status === "Review"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${session.progress}%` }}
                    />
                  </div>
                </div>

                {/* Business Unit */}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {session.businessUnit}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
