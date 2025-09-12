import { useEffect, useState } from "react";
import axios from "axios";

const FetchData = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  if (!url) return;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(url);
      setData(res.data.data);
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

