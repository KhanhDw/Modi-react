import { useEffect } from 'react';

// Performance monitoring hook
export const usePerformanceMonitor = (componentName = 'Component') => {
  useEffect(() => {
    const startMark = `${componentName}-start`;
    const endMark = `${componentName}-end`;
    
    performance.mark(startMark);
    
    return () => {
      performance.mark(endMark);
      performance.measure(`${componentName}-render`, startMark, endMark);
      
      // Log performance data
      const measures = performance.getEntriesByName(`${componentName}-render`);
      const renderTime = measures[measures.length - 1]?.duration;
      
      if (renderTime) {
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
      
      // Clean up performance entries to prevent memory leaks
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(`${componentName}-render`);
    };
  }, [componentName]);
};

// Hook for measuring API call performance
export const useApiPerformance = () => {
  const measureApiCall = async (apiCall, apiName) => {
    const start = performance.now();
    try {
      const result = await apiCall();
      const end = performance.now();
      const duration = end - start;
      
      console.log(`${apiName} API call took ${duration.toFixed(2)}ms`);
      
      // Report slow API calls
      if (duration > 1000) {
        console.warn(`${apiName} is slow (${duration.toFixed(2)}ms)`);
      }
      
      return result;
    } catch (error) {
      const end = performance.now();
      const duration = end - start;
      console.error(`${apiName} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  };
  
  return { measureApiCall };
};