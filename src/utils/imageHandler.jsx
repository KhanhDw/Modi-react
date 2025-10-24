// utils/imageHandler.js
export const extractBase64ImagesFromHTML = (html) => {
  const base64Regex = /src="(data:image\/[^;]+;base64,[^"]+)"/g;
  const matches = [];
  let match;

  while ((match = base64Regex.exec(html)) !== null) {
    matches.push(match[1]);
  }

  return matches;
};

// Upload với giới hạn concurrent và retry
export const uploadBase64Image = async (base64String, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(base64String);
      const blob = await response.blob();

      // Validate kích thước blob
      if (blob.size > 5 * 1024 * 1024) {
        // 5MB
        throw new Error("Image too large");
      }

      const formData = new FormData();
      const fileName = `editor-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}.jpg`;
      formData.append("image", blob, fileName);

      const uploadResponse = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }

      const data = await uploadResponse.json();
      return { success: true, base64: base64String, url: data.url };
    } catch (error) {
      console.warn(`Upload attempt ${attempt} failed:`, error);
      if (attempt === retries) {
        return { success: false, base64: base64String, error: error.message };
      }
      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
};

// Upload nhiều ảnh với giới hạn concurrent
export const uploadMultipleImages = async (base64Images, maxConcurrent = 3) => {
  const results = [];

  // Chia nhỏ thành các batch
  for (let i = 0; i < base64Images.length; i += maxConcurrent) {
    const batch = base64Images.slice(i, i + maxConcurrent);
    const batchPromises = batch.map((base64) => uploadBase64Image(base64));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Delay giữa các batch để tránh overload server
    if (i + maxConcurrent < base64Images.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return results;
};

// API xóa ảnh
export const deleteUploadedImages = async (imageUrls) => {
  try {
    const deletePromises = imageUrls.map((url) =>
      fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/upload`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url }),
      })
    );

    await Promise.allSettled(deletePromises);
  } catch (error) {
    console.error("Error deleting images:", error);
  }
};

export const replaceBase64WithUrls = (html, replacements) => {
  let newHtml = html;
  replacements.forEach(({ base64, url }) => {
    if (url) {
      newHtml = newHtml.replace(base64, url);
    }
  });
  return newHtml;
};
