import { useEffect, useState } from 'react';
import { auth, db } from '../auth'; // Adjust the path to your Firebase config
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const useUser = () => {
  const [isUser, setIsUser] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch the user document from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          // Check if user is a customer (not an admin)
          setIsUser(data.role === "customer" || data.role === "admin");
          setUserData({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || data.name || "User",
            ...data
          });
        } else {
          setIsUser(false);
          setUserData(null);
        }
      } else {
        setIsUser(false);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { isUser, userData, loading };
};

export default useUser;