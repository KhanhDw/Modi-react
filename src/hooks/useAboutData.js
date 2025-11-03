import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

// Custom hook to batch all API requests for the about page
export const useAboutData = (lang) => {
  const [data, setData] = useState({
    banner: null,
    companyOverview: null,
    missionVision: null,
    ctaBanner: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Batch all API requests together for better performance
        const [bannerRes, companyRes, visionRes, ctaRes] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/api/section-items/type/about_intro?slug=about`),
          fetch(`${API_BASE_URL}/api/section-items/type/company_intro?slug=about`),
          fetch(`${API_BASE_URL}/api/section-items/type/vision_mission?slug=about`),
          fetch(`${API_BASE_URL}/api/section-items/type/banner_video?slug=about`)
        ]);

        const newData = {};
        
        // Handle banner data
        if (bannerRes.status === 'fulfilled' && bannerRes.value.ok) {
          const bannerData = await bannerRes.value.json();
          newData.banner = bannerData.length > 0 ? bannerData[0] : null;
        }
        
        // Handle company overview data
        if (companyRes.status === 'fulfilled' && companyRes.value.ok) {
          const companyData = await companyRes.value.json();
          newData.companyOverview = Array.isArray(companyData) && companyData.length > 0 ? companyData[0] : null;
        }
        
        // Handle mission/vision data
        if (visionRes.status === 'fulfilled' && visionRes.value.ok) {
          const visionData = await visionRes.value.json();
          newData.missionVision = visionData;
        }
        
        // Handle CTA banner data
        if (ctaRes.status === 'fulfilled' && ctaRes.value.ok) {
          const ctaData = await ctaRes.value.json();
          newData.ctaBanner = ctaData.length > 0 ? ctaData[0] : null;
        }
        
        setData(prev => ({ ...prev, ...newData }));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [lang]);

  return { data, loading, error };
};