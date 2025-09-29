import { useState, useEffect } from "react";

export default function usePricingSlider() {
    const url = `${import.meta.env.VITE_MAIN_BE_URL}/api/`
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true; // tránh update state sau khi unmount

        async function fetchData() {
            try {
                setLoading(true);
                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
                }
                const json = await res.json();
                if (isMounted) setData(json);
            } catch (err) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchData();

        return () => {
            isMounted = false; // cleanup
        };
    }, [url]);

    return { data, loading, error };
}
