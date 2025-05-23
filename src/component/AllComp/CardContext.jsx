import React, { createContext, useState, useEffect, useContext } from "react";
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig"; // Import your Firebase config
import { useAuthState } from 'react-firebase-hooks/auth'; // For user authentication

const CartContext = createContext();

// CartProvider manages the shared state with Firestore integration
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCartQuantity, setTotalCartQuantity] = useState(0);
  const [user] = useAuthState(auth);

  // Fetch cart items from Firestore when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        setLoading(true);
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists() && userDoc.data().cart) {
            setCartItems(userDoc.data().cart.items || []);
          } else {
            // Initialize empty cart if it doesn't exist
            await updateDoc(userDocRef, {
              cart: {
                items: [],
                lastUpdated: new Date().toISOString(),
                subtotal: 0
              }
            });
            setCartItems([]);
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // Handle not logged in state - load from localStorage as fallback
        const localCart = localStorage.getItem("cartItems");
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        }
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  // Fetch product details for cart items
  useEffect(() => {
    const calculateTotalQuantity = () => {
      const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      setTotalCartQuantity(total);
    };

    calculateTotalQuantity();
  }, [cartItems]);

  // Store cart items in local storage as backup
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  // Calculate subtotal
  const calculateSubtotal = (items) => {
    return cartProducts.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const addToCart = async (product, quantity = 1) => {
  if (quantity < 1) return;

  const cartItem = {
    productId: product.id,
    quantity
  };

  let updatedCart = [];

  setCartItems((prevItems) => {
    const existingItemIndex = prevItems.findIndex((item) => item.productId === product.id);

    if (existingItemIndex !== -1) {
      // If product exists, increase its quantity
      updatedCart = prevItems.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // If product doesn't exist, add new item
      updatedCart = [...prevItems, cartItem];
    }

    return updatedCart;
  });

  if (user) {
    try {
      const userDocRef = doc(db, "users", user.uid);

      // Need to wait for state update, so get updatedCart from cartItems
      const newCartItems = updatedCart.length > 0 ? updatedCart : cartItems;

      await updateDoc(userDocRef, {
        "cart.items": newCartItems,
        "cart.lastUpdated": new Date().toISOString(),
        "cart.subtotal": calculateSubtotal(newCartItems),
        "cart.totalQuantity": newCartItems.reduce((sum, item) => sum + item.quantity, 0)
      });
    } catch (error) {
      console.error("Error updating cart in Firestore:", error);
    }
  }
};

  const removeFromCart = async (product) => {
    const updatedCart = cartItems.filter((item) => item.productId !== product.productId);
    setCartItems(updatedCart);

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          "cart.items": updatedCart,
          "cart.lastUpdated": new Date().toISOString(),
          "cart.subtotal": calculateSubtotal(updatedCart),
          "cart.totalQuantity": updatedCart.reduce((sum, item) => sum + item.quantity, 0)
        });
      } catch (error) {
        console.error("Error removing item from cart in Firestore:", error);
      }
    }
  };

  const updateQuantity = async (product, quantity) => {
    if (quantity < 1) {
      return removeFromCart(product);
    }

    const updatedCart = cartItems.map(item => 
      item.productId === product.productId ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          "cart.items": updatedCart,
          "cart.lastUpdated": new Date().toISOString(),
          "cart.subtotal": calculateSubtotal(updatedCart),
          "cart.totalQuantity": updatedCart.reduce((sum, item) => sum + item.quantity, 0)
        });
      } catch (error) {
        console.error("Error updating quantity in Firestore:", error);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    setCartProducts([]);
    setTotalCartQuantity(0);
    
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          "cart.items": [],
          "cart.lastUpdated": new Date().toISOString(),
          "cart.subtotal": 0,
          "cart.totalQuantity": 0
        });
      } catch (error) {
        console.error("Error clearing cart in Firestore:", error);
      }
    }
    
    localStorage.removeItem("cartItems");
  };

  // Sync local cart with Firestore when user logs in
  const syncCartWithFirestore = async () => {
    if (user && cartItems.length > 0) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          "cart.items": cartItems,
          "cart.lastUpdated": new Date().toISOString(),
          "cart.subtotal": calculateSubtotal(cartItems)
        });
      } catch (error) {
        console.error("Error syncing cart with Firestore:", error);
      }
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems: cartProducts,
      rawCartItems: cartItems, 
      totalCartQuantity,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      syncCartWithFirestore,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use CartContext
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default CartContext;