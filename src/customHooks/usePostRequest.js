import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:1337";

const usePostRequest = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const postData = async (endpoint, data, config = {}) => {
    try {
      const res = await axios.post(`${API_URL}${endpoint}`, data, config);
      setResponse(res.data);
      return res.data;
    } catch (err) {
      setError(err);
      console.error("Axios POST error:", err);
      throw err;
    }
  };

  return { response, error, postData };
};

export default usePostRequest;
