import { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { getAllPost, loadMorePosts } from '@/store/slices/newfeedSlice';

export const useInfiniteScroll = () => {
  const dispatch = useAppDispatch();
  const { 
    posts, 
    status, 
    error, 
    currentPage, 
    hasMore, 
    loadingMore 
  } = useAppSelector(state => state.newfeed);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement | null>(null);

  // Load initial posts
  const loadInitialPosts = useCallback(() => {
    dispatch(getAllPost({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Load more posts
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && status === 'succeeded') {
      dispatch(loadMorePosts({ page: currentPage + 1, limit: 10 }));
    }
  }, [dispatch, loadingMore, hasMore, status, currentPage]);

  // Setup intersection observer
  const setLastPostRef = useCallback((node: HTMLDivElement | null) => {
    if (loadingMore) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, {
      threshold: 1.0,
      rootMargin: '20px'
    });
    
    if (node) {
      observerRef.current.observe(node);
    }
    
    lastPostElementRef.current = node;
  }, [loadingMore, hasMore, loadMore]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    posts,
    status,
    error,
    hasMore,
    loadingMore,
    loadInitialPosts,
    loadMore,
    setLastPostRef
  };
};