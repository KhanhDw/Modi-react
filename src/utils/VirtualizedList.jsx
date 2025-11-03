import React, { useState, useEffect, useCallback, useRef } from 'react';

const VirtualizedList = ({ items, renderItem, itemHeight = 800, containerHeight = window.innerHeight }) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  const containerRef = useRef(null);
  
  // Calculate visible range based on scroll position
  const updateVisibleRange = useCallback(() => {
    if (!containerRef.current) return;
    
    const scrollTop = containerRef.current.scrollTop;
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 2; // Add buffer
    const end = Math.min(start + visibleCount, items.length);
    
    setVisibleRange({ start, end });
  }, [items.length, itemHeight, containerHeight]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', updateVisibleRange, { passive: true });
      updateVisibleRange(); // Initial calculation
      
      return () => {
        container.removeEventListener('scroll', updateVisibleRange);
      };
    }
  }, [updateVisibleRange]);

  // Calculate total height for proper scrolling
  const totalHeight = items.length * itemHeight;
  const visibleItems = items.slice(visibleRange.start, visibleRange.end);
  
  return (
    <div 
      ref={containerRef}
      className="relative overflow-y-auto"
      style={{ height: `${containerHeight}px` }}
    >
      <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
        <div 
          style={{ 
            position: 'absolute', 
            top: `${visibleRange.start * itemHeight}px`,
            width: '100%'
          }}
        >
          {visibleItems.map((item, index) => (
            <div key={item.key || index} style={{ height: `${itemHeight}px` }}>
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualizedList;