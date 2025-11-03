import React, { useState } from 'react';

const LazyImage = ({ src, alt, className = '', ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsError(true);
  };

  if (isError) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
          Image failed to load
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
        style={{ transition: 'opacity 0.3s ease-in-out' }}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

export default LazyImage;