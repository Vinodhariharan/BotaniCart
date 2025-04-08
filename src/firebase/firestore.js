import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import {app} from "../firebaseConfig";

const db = getFirestore(app);

export const createUser = async (userId, email, role = "customer") => {
  await setDoc(doc(db, "users", userId), {
    email,
    role
  });
};

export const getUserRole = async (userId) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  return userDoc.exists() ? userDoc.data().role : null;
};

export const getProductDetails = async (productId) => {
  try {
    const productDoc = await getDoc(doc(db, "products", productId));
    return productDoc.exists() ? { id: productId, ...productDoc.data() } : null;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
};