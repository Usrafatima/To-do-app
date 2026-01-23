"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';

const withAuth = (WrappedComponent: ComponentType) => {
  const AuthenticatedComponent = (props: any) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);

    if (loading || !user) {
      // You can render a loading spinner or a placeholder here
      return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
