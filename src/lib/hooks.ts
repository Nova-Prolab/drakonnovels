
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

  const updateCurrentChapter = useCallback((novelId: string, chapterId: number) => {
    setProgress(prevProgress => ({
      ...prevProgress,
      [novelId]: { 
        chapterId, 
        // Preserve isRead status if we're just updating the chapter
        isRead: prevProgress[novelId]?.chapterId === chapterId ? prevProgress[novelId].isRead : false 
      },
    }));
  }, [setProgress]);


  const markChapterAsRead = useCallback((novelId: string, chapterId: number) => {
    setProgress(prev => ({
      ...prev,
      [novelId]: { chapterId, isRead: true }
    }));
  }, [setProgress]);

  const markChapterAsUnread = useCallback((novelId: string, chapterId: number) => {
    setProgress(prev => ({
      ...prev,
      [novelId]: { chapterId, isRead: false }
    }));
  }, [setProgress]);

  const getChapterProgress = useCallback((novelId: string, chapterId: number) => {
      const novelProgress = progress[novelId];
      if (!novelProgress) return { isRead: false };
      
      // If the user is on a chapter further than saved, this chapter is read
      if (novelProgress.chapterId > chapterId) {
        return { isRead: true };
      }
      // If this is the chapter the user is on
      if (novelProgress.chapterId === chapterId) {
          return { isRead: novelProgress.isRead };
      }
      // If the user is on a chapter before this one
      return { isRead: false };
  }, [progress]);


  return { progress, updateCurrentChapter, markChapterAsRead, markChapterAsUnread, getChapterProgress, isReady };
}
