import { useEffect, useState } from "react";

const FetchData = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  if (!url) return;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/data/fetch?url=${encodeURIComponent(url)}`);
      const result = await res.json();
      
      if (res.ok) {
        setData(result.data);
      } else {
        setError(result.error || "Error fetching data");
      }
    } catch (err) {
      setError(err.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [url]);

  return { data, error, loading };
};

export default FetchData;

