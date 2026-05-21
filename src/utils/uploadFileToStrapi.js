export const uploadFileToStrapi = async (file) => {
  const formData = new FormData();
  formData.append("files", file);

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (res.ok && result.file) {
      return result.file; // Uploaded file object
    } else {
      console.error("Error uploading file:", result.error);
      return null;
    }
  } catch (error) {
    console.error("Error uploading file to Strapi:", error);
    return null;
  }
};
