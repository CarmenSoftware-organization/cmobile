"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Settings as SettingsIcon, 
  LogOut,
  Edit,
  Shield,
  Clock,
  ChevronRight,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { authService } from '@/lib/auth';
import { notificationService } from '@/lib/notifications';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  department?: string;
  joinDate?: string;
  lastLogin?: string;
  status: 'active' | 'inactive';
  workflowStages?: string[];
  approvalLimits?: {
    currency: string;
    limit: number;
  }[];
}

interface BusinessUnit {
  id: string;
  name: string;
  location: string;
  status: string;
  type?: string;
  currency?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [businessUnit, setBusinessUnit] = useState<BusinessUnit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    loadUserProfile();
    
    // Subscribe to notifications
    const unsubscribe = notificationService.subscribe((notifications) => {
      const unreadCount = notifications.filter(n => !n.isRead).length;
      setUnreadNotifications(unreadCount);
    });

    return unsubscribe;
  }, []);

  const loadUserProfile = () => {
    try {
      // Get user data from localStorage (from auth)
      const userEmail = localStorage.getItem('userEmail');
      const selectedBU = localStorage.getItem('selectedBusinessUnit');
      
      // Mock user profile data (in real app, this would come from API)
      const mockProfile: UserProfile = {
        id: 'user-001',
        name: 'John Manager',
        email: userEmail || 'admin@carmen.com',
        role: 'Operations Manager',
        phone: '+65 9123 4567',
        department: 'Supply Chain Operations',
        joinDate: '2023-01-15',
        lastLogin: new Date().toISOString(),
        status: 'active',
        workflowStages: ['HOD', 'Finance'],
        approvalLimits: [
          { currency: 'SGD', limit: 10000 },
          { currency: 'USD', limit: 7500 }
        ]
      };

      // Get business unit data
      let buData: BusinessUnit | null = null;
      if (selectedBU) {
        try {
          buData = JSON.parse(selectedBU);
        } catch {
          // Fallback to default BU
          buData = {
            id: 'default-bu',
            name: 'Carmen Hotel',
            location: 'Singapore',
            status: 'active',
            type: 'Hotel',
            currency: 'SGD'
          };
        }
      }

      setUserProfile(mockProfile);
      setBusinessUnit(buData);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.clearAuth();
    router.push('/login');
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleSettings = () => {
    router.push('/profile/settings');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return date.toLocaleDateString('en-SG');
  };

  if (isLoading) {
    return (
      <div className="p-6 pt-16 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-16 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/notifications')}
            className="relative p-2"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <Badge variant="default" className="absolute -top-1 -right-1 text-xs bg-red-600 text-white min-w-[1.25rem] h-5 flex items-center justify-center">
                {unreadNotifications > 99 ? '99+' : unreadNotifications}
              </Badge>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEditProfile}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* User Profile Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">{userProfile?.name}</CardTitle>
              <p className="text-gray-600">{userProfile?.role}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={userProfile?.status === 'active' ? 'default' : 'secondary'}>
                  {userProfile?.status}
                </Badge>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{userProfile?.department}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Contact Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-gray-900">{userProfile?.email}</span>
            </div>
            {userProfile?.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{userProfile.phone}</span>
              </div>
            )}
            {userProfile?.joinDate && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">
                  Joined {formatDate(userProfile.joinDate)}
                </span>
              </div>
            )}
            {userProfile?.lastLogin && (
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">
                  Last login: {formatLastLogin(userProfile.lastLogin)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Assignment Card */}
      {userProfile?.workflowStages && userProfile.workflowStages.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Workflow Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="mb-3">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  Approval Stages
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  You are authorized to approve documents at the following workflow stages:
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {userProfile.workflowStages.map((stage, index) => (
                    <Badge 
                      key={index} 
                      variant="default" 
                      className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700"
                    >
                      {stage}
                    </Badge>
                  ))}
                </div>

                {userProfile.approvalLimits && userProfile.approvalLimits.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Approval Limits:</h4>
                    <div className="space-y-1">
                      {userProfile.approvalLimits.map((limit, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{limit.currency}:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {limit.currency} {limit.limit.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="font-medium mb-1">Workflow Responsibilities:</p>
              <ul className="space-y-1 text-xs">
                <li>• Review and approve purchase requisitions at your assigned stages</li>
                <li>• Ensure compliance with approval limits and company policies</li>
                <li>• Provide timely responses to pending approval requests</li>
                <li>• Escalate items beyond your approval authority when necessary</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assigned Business Unit Card */}
      {businessUnit && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Assigned Business Unit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg text-gray-900">
                  {businessUnit.name}
                </h3>
                <Badge variant={businessUnit.status === 'active' ? 'default' : 'secondary'}>
                  {businessUnit.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{businessUnit.location}</span>
                </div>
                
                {businessUnit.type && (
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Type: {businessUnit.type}</span>
                  </div>
                )}
                
                {businessUnit.currency && (
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 text-center text-gray-500 font-bold">$</span>
                    <span className="text-gray-700">Currency: {businessUnit.currency}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-1">Access Level:</p>
              <p>You have full operational access to this business unit including inventory management, purchasing, and reporting.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-between h-12"
            onClick={() => router.push('/notifications')}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <span>Notifications</span>
              {unreadNotifications > 0 && (
                <Badge variant="default" className="text-xs bg-red-600 text-white">
                  {unreadNotifications}
                </Badge>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-between h-12"
            onClick={handleEditProfile}
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-600" />
              <span>Edit Profile</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-between h-12"
            onClick={handleSettings}
          >
            <div className="flex items-center gap-3">
              <SettingsIcon className="w-5 h-5 text-gray-600" />
              <span>Settings & Preferences</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-between h-12"
            onClick={() => router.push('/profile/security')}
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <span>Security & Privacy</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Button>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Card className="shadow-sm border-red-200">
        <CardContent className="p-4">
          <Button
            variant="destructive"
            className="w-full h-12"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 