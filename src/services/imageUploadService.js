/**
 * Uploads an image file to the server and returns the URL
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The URL of the uploaded image
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `${import.meta.env.VITE_MAIN_BE_URL}/api/upload`,
    {
      method: "POST",
      body: formData,
      // Do NOT set Content-Type header - browser will set it automatically with boundary
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Upload failed: ${response.status} ${response.statusText} - ${
        errorData.message || "Unknown error"
      }`
    );
  }

  const data = await response.json();
  return data.data.url; // Return the URL of the uploaded image
};
