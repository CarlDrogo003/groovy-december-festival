'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'vendor' | 'contestant' | 'user';
  fallbackPath?: string;
  loadingComponent?: React.ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole = 'user',
  fallbackPath = '/admin/login',
  loadingComponent 
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push(`${fallbackPath}?redirect=${window.location.pathname}`);
      return;
    }

    // Check role-based authorization
    if (requiredRole !== 'user') {
      if (!profile || profile.role !== requiredRole) {
        router.push(`${fallbackPath}?error=unauthorized`);
        return;
      }
    }

    setIsAuthorized(true);
  }, [user, profile, loading, requiredRole, fallbackPath, router]);

  if (loading) {
    return loadingComponent || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-600 mt-4 text-lg">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Router will handle redirect
  }

  return <>{children}</>;
}