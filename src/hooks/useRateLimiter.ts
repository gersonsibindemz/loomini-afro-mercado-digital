
import { useState, useCallback } from 'react';

interface RateLimiterOptions {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

export const useRateLimiter = (options: RateLimiterOptions) => {
  const [attempts, setAttempts] = useState<number[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockEndTime, setBlockEndTime] = useState<number | null>(null);

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    
    // Check if still blocked
    if (isBlocked && blockEndTime && now < blockEndTime) {
      return false;
    }
    
    // Clear block if expired
    if (isBlocked && blockEndTime && now >= blockEndTime) {
      setIsBlocked(false);
      setBlockEndTime(null);
      setAttempts([]);
    }

    // Clean old attempts outside the window
    const windowStart = now - options.windowMs;
    const recentAttempts = attempts.filter(time => time > windowStart);
    
    // Check if max attempts exceeded
    if (recentAttempts.length >= options.maxAttempts) {
      setIsBlocked(true);
      setBlockEndTime(now + options.blockDurationMs);
      return false;
    }

    // Record this attempt
    const newAttempts = [...recentAttempts, now];
    setAttempts(newAttempts);
    
    return true;
  }, [attempts, isBlocked, blockEndTime, options]);

  const getRemainingTime = useCallback((): number => {
    if (!isBlocked || !blockEndTime) return 0;
    return Math.max(0, blockEndTime - Date.now());
  }, [isBlocked, blockEndTime]);

  return {
    checkRateLimit,
    isBlocked,
    getRemainingTime
  };
};
