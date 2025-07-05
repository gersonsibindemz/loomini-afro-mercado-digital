
import React from 'react';
import { CourseProvider } from './CourseContext';
import { ProgressProvider } from './ProgressContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <CourseProvider>
      <ProgressProvider>
        {children}
      </ProgressProvider>
    </CourseProvider>
  );
};
