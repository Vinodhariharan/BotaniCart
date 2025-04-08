import { ref as dbRef, set } from "firebase/database";
import { database } from "../../firebaseConfig";

export const handleImageUpload = (e, setProduct, productId) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Image = reader.result;

    try {
      // Update local state
      setProduct((prev) => ({
        ...prev,
        imageSrc: base64Image,
      }));

      // Save base64 image string to Realtime DB
      await set(dbRef(database, `products/${productId}/image`), {
        imageUrl: base64Image,
        uploadedAt: Date.now(),
      });

      console.log("Image saved as base64 in Realtime DB");
    } catch (err) {
      console.error("Failed to save image to Realtime DB:", err);
    }
  };

  reader.readAsDataURL(file);
};
