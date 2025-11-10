import React, { useState, useEffect, useRef } from "react";

const OptimizedImage = React.memo(({ src, alt, className = "", onError }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      className={`relative w-full h-full ${className}`}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse" />
      )}

      {isVisible && (
        <img
          src={hasError ? "/no-image.png" : src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-all duration-700 ${
            isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
          }`}
        />
      )}
    </div>
  );
});

export default OptimizedImage;
