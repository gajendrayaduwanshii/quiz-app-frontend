import axios from "axios";

const STRAPI_URL = "http://localhost:1337";

export const uploadFileToStrapi = async (file) => {
  const formData = new FormData();
  formData.append("files", file);

  try {
    const res = await axios.post(`${STRAPI_URL}/api/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data[0]; // Uploaded file object
  } catch (error) {
    console.error("Error uploading file to Strapi:", error);
    return null;
  }
};
