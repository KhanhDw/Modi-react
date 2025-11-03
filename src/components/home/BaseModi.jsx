import React, { useRef, useMemo } from "react";

function BaseModi({ data, activeLang, sectionType }) {
  const ref = useRef(null);

  // Simplified animation using CSS transitions instead of Framer Motion for better performance
  const [isVisible, setIsVisible] = React.useState(false);
  const observer = React.useRef(null);

  React.useEffect(() => {
    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.current.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.current.observe(ref.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  const memoizedData = useMemo(() => data, [data]);

  if (!memoizedData) return null;

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center sm:my-2 md:my-6 pb-10 transition-opacity duration-1000"
      style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)' }}
    >
      <div className="w-3/4 text-center">
        <p
          className={`mb-4 text-3xl sm:text-4xl xs:text-xl md:text-5xl 3xl:text-6xl font-bold dark:text-white text-black transition-all duration-600`}
          style={{ transform: isVisible ? 'scale(1)' : 'scale(0.8)', opacity: isVisible ? 1 : 0 }}
        >
          {memoizedData.title?.[activeLang]}
        </p>
        <p
          className="text-center text-gray-600 sm:text-xl md:text-2xl 3xl:text-xl dark:text-gray-300 transition-all duration-800 delay-200"
          style={{ transform: isVisible ? 'translateY(0)' : 'translateY(40px)', opacity: isVisible ? 1 : 0 }}
        >
          {memoizedData.description?.[activeLang]}
        </p>
      </div>
    </div>
  );
}

export default BaseModi;
