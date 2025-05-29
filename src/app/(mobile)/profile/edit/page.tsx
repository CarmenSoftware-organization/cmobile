'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Building2,
  Save,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  department?: string;
  joinDate?: string;
  status: 'active' | 'inactive';
  workflowStages?: string[];
  approvalLimits?: {
    currency: string;
    limit: number;
  }[];
}

export default function EditProfilePage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user-001',
    name: 'John Manager',
    email: 'admin@carmen.com',
    role: 'Operations Manager',
    phone: '+65 9123 4567',
    department: 'Supply Chain Operations',
    joinDate: '2023-01-15',
    status: 'active',
    workflowStages: ['HOD', 'Finance'],
    approvalLimits: [
      { currency: 'SGD', limit: 10000 },
      { currency: 'USD', limit: 7500 }
    ]
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadUserProfile = useCallback(() => {
    try {
      // Get user data from localStorage
      const userEmail = localStorage.getItem('userEmail');
      
      // In real app, this would be an API call
      const profile = {
        ...userProfile,
        email: userEmail || userProfile.email
      };

      setUserProfile(profile);
      setFormData({
        name: profile.name,
        email: profile.email,
        phone: profile.phone || '',
        department: profile.department || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, [userProfile]);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update localStorage
      localStorage.setItem('userEmail', formData.email);
      
      // In real app, this would be an API call to update the profile
      console.log('Profile updated:', formData);
      
      // Navigate back to profile
      router.push('/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ general: 'Failed to save profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  return (
    <div className="p-6 pt-16 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
      </div>

      {/* Profile Photo Section */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Profile Photo</h3>
              <p className="text-sm text-gray-600">Click the camera icon to update your photo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                disabled={isSaving}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                disabled={isSaving}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                disabled={isSaving}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="department"
                type="text"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="Enter your department"
                className="pl-10"
                disabled={isSaving}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Read-only Information */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <Input
              value={userProfile.role}
              disabled
              className="bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Contact your administrator to change your role</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Join Date
            </label>
            <Input
              value={userProfile.joinDate ? new Date(userProfile.joinDate).toLocaleDateString('en-SG') : ''}
              disabled
              className="bg-gray-50 text-gray-600"
            />
          </div>

          {userProfile.workflowStages && userProfile.workflowStages.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workflow Stages
              </label>
              <Input
                value={userProfile.workflowStages.join(', ')}
                disabled
                className="bg-gray-50 text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">Your assigned approval workflow stages</p>
            </div>
          )}

          {userProfile.approvalLimits && userProfile.approvalLimits.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Approval Limits
              </label>
              <div className="space-y-2">
                {userProfile.approvalLimits.map((limit, index) => (
                  <Input
                    key={index}
                    value={`${limit.currency} ${limit.limit.toLocaleString()}`}
                    disabled
                    className="bg-gray-50 text-gray-600"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Maximum amounts you can approve per currency</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Message */}
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          className="flex-1"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </div>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 