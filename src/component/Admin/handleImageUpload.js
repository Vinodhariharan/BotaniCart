import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export const handleImageUpload = async (e, setProduct, productId) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    // Step 1: Get a presigned URL from your backend
    const presignRes = await fetch("https://botani-cart-s3-bucket-uploader.vercel.app/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      }),
      // Add credentials if needed (if you're using cookies or auth)
      // credentials: 'include',
    });

    if (!presignRes.ok) {
      const errorText = await presignRes.text();
      throw new Error(`Failed to get presigned URL: ${presignRes.status} ${errorText}`);
    }

    const { uploadUrl, fileUrl } = await presignRes.json();

    // Step 2: Upload the file directly to S3
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`S3 upload failed: ${uploadRes.status}`);
    }

    console.log("Upload successful");

    // Step 3: Update local state with the new image URL
    setProduct((prev) => ({
      ...prev,
      imageSrc: fileUrl,  // Update the image URL here
    }));

    // Step 4: Save the file URL to Firestore
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      imageSrc: fileUrl
    });

    console.log("Image uploaded to S3 and URL saved to Firestore");
  } catch (err) {
    console.error("Failed to upload image:", err);
    // Optionally add user notification here
  }
};