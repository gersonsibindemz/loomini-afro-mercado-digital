
import { useState } from 'react';

interface SimpleProgress {
  lessonId: string;
  completed: boolean;
  watchPercentage: number;
}

export const useSimpleProgress = (courseId: string) => {
  const [progress, setProgress] = useState<SimpleProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateProgress = (lessonId: string, watchPercentage: number, completed = false) => {
    setProgress(prev => {
      const existing = prev.find(p => p.lessonId === lessonId);
      if (existing) {
        return prev.map(p => 
          p.lessonId === lessonId 
            ? { ...p, watchPercentage, completed }
            : p
        );
      }
      return [...prev, { lessonId, watchPercentage, completed }];
    });
  };

  const requestCertificate = (fullName: string) => {
    console.log('Certificate requested for:', fullName);
    return Promise.resolve({ success: true });
  };

  return {
    progress,
    isLoading,
    updateProgress,
    requestCertificate,
    certificateRequests: [],
    isUpdatingProgress: false,
    isRequestingCertificate: false
  };
};
