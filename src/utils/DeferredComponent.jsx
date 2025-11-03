import React, { useState, useEffect } from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

const DeferredComponent = ({ component, data, activeLang, sectionType, fallback = null }) => {
  const [elementRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible && !shouldRender) {
      setShouldRender(true);
    }
  }, [isVisible, shouldRender]);

  return (
    <div ref={elementRef}>
      {shouldRender ? component(data, activeLang, sectionType) : fallback}
    </div>
  );
};

export default DeferredComponent;