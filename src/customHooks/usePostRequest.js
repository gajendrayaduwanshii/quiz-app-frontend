import { useState } from "react";

const usePostRequest = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const postData = async (endpoint, data, config = {}) => {
    try {
      const res = await fetch("/api/data/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ endpoint, data, config }),
      });

      const result = await res.json();

      if (res.ok) {
        setResponse(result.data);
        return result.data;
      } else {
        throw new Error(result.error || "POST request failed");
      }
    } catch (err) {
      setError(err);
      console.error("POST error:", err);
      throw err;
    }
  };

  return { response, error, postData };
};

export default usePostRequest;
