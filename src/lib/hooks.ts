
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ReadingProgress } from './types';
import { throttle } from 'lodash';

// A generic hook for managing state in localStorage
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, boolean] {
  const [isReady, setIsReady] = useState(false);

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    setIsReady(true);
  }, []);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      });
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  return [storedValue, setValue, isReady];
}

// Hook for managing the user's library
export function useLibrary() {
  const [library, setLibrary, isReady] = useLocalStorage<string[]>('story_weaver_library', []);

  const addToLibrary = useCallback((novelId: string) => {
    setLibrary(prevLibrary => {
      if (!prevLibrary.includes(novelId)) {
        return [...prevLibrary, novelId];
      }
      return prevLibrary;
    });
  }, [setLibrary]);

  const removeFromLibrary = useCallback((novelId: string) => {
    setLibrary(prevLibrary => prevLibrary.filter(id => id !== novelId));
  }, [setLibrary]);

  const isInLibrary = useCallback((novelId: string) => {
    return library.includes(novelId);
  }, [library]);

  return { library, addToLibrary, removeFromLibrary, isInLibrary, isReady };
}


// Hook for managing reading progress
export function useReadingProgress() {
  const [progress, setProgress, isReady] = useLocalStorage<ReadingProgress>('story_weaver_progress', {});

  const throttledUpdate = useMemo(() => throttle((novelId: string, chapterId: number, scrollPosition: number, scrollHeight: number) => {
    setProgress(prevProgress => ({
      ...prevProgress,
      [novelId]: { chapterId, scrollPosition, scrollHeight },
    }));
  }, 1000), [setProgress]);

  const updateProgress = useCallback((novelId: string, chapterId: number, scrollPosition: number, scrollHeight: number) => {
    throttledUpdate(novelId, chapterId, scrollPosition, scrollHeight);
  }, [throttledUpdate]);

  const markChapterAsRead = useCallback((novelId: string, chapterId: number, scrollHeight: number) => {
    setProgress(prev => ({
      ...prev,
      [novelId]: { chapterId, scrollPosition: scrollHeight, scrollHeight: scrollHeight }
    }));
  }, [setProgress]);

  const markChapterAsUnread = useCallback((novelId: string, chapterId: number, scrollHeight: number) => {
    setProgress(prev => ({
      ...prev,
      [novelId]: { chapterId, scrollPosition: 0, scrollHeight: scrollHeight }
    }));
  }, [setProgress]);

  const getChapterProgress = useCallback((novelId: string, chapterId: number) => {
      const novelProgress = progress[novelId];
      if (!novelProgress) return { percentage: 0, isRead: false };
      
      // If the user is on a chapter further than saved, this chapter is read
      if (novelProgress.chapterId > chapterId) {
        return { percentage: 100, isRead: true };
      }
      // If this is the chapter the user is on
      if (novelProgress.chapterId === chapterId) {
          const { scrollPosition, scrollHeight } = novelProgress;
          if (scrollHeight <= 0) return { percentage: 0, isRead: false };
          const percentage = Math.round((scrollPosition / scrollHeight) * 100);
          return { percentage, isRead: percentage >= 99 };
      }
      // If the user is on a chapter before this one
      return { percentage: 0, isRead: false };
  }, [progress]);


  return { progress, updateProgress, markChapterAsRead, markChapterAsUnread, getChapterProgress, isReady };
}
