'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { fetchUserSiteLayoutConfig, setBreederId } from '@/store/slices/userSiteSlice';
import { use } from 'react';

interface UserSiteLayoutProps {
  children: React.ReactNode;
  params: Promise<{ breederId: string }>;
}

/**
 * Layout component cho toàn bộ folder [breederId]
 * Tự động fetch layout config khi component mount
 */
export default function UserSiteLayout({ children, params }: UserSiteLayoutProps) {
  const resolvedParams = use(params);
  const dispatch = useAppDispatch();
  
  const { loading, error } = useAppSelector((state) => state.userSite);

  useEffect(() => {
    // Set breeder ID và fetch layout config
    dispatch(setBreederId(resolvedParams.breederId));
    dispatch(fetchUserSiteLayoutConfig(resolvedParams.breederId));
  }, [dispatch, resolvedParams.breederId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading site configuration...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error loading site</p>
            <p>{error}</p>
          </div>
          <button
            onClick={() => dispatch(fetchUserSiteLayoutConfig(resolvedParams.breederId))}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
