import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

// 1. CREATE AND EXPORT THE CONTEXT
// (The comment below fixes the Vite Fast Refresh warning)
// eslint-disable-next-line react-refresh/only-export-components
export const ShopContext = createContext(null);

const getCartItemKey = (productId, size) => `${productId}-${size}`;

// 2. CREATE AND EXPORT THE PROVIDER
export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  console.log(products);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/api/product/list");
        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load store inventory.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product, size) => {
    setCartItems((currentItems) => {
      const cartItemKey = getCartItemKey(product._id, size);
      const existingItem = currentItems.find(
        (item) => item.cartItemKey === cartItemKey,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.cartItemKey === cartItemKey
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          cartItemKey,
          productId: product._id,
          quantity: 1,
          size,
        },
      ];
    });
  };

  const updateQuantity = (cartItemKey, quantity) => {
    const safeQuantity = Math.max(1, Number(quantity) || 1);
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.cartItemKey === cartItemKey
          ? { ...item, quantity: safeQuantity }
          : item,
      ),
    );
  };

  const increaseQuantity = (cartItemKey) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.cartItemKey === cartItemKey
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const decreaseQuantity = (cartItemKey) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.cartItemKey === cartItemKey
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item,
      ),
    );
  };

  const removeFromCart = (cartItemKey) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.cartItemKey !== cartItemKey),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = useMemo(() => {
    const detailedItems = cartItems
      .map((item) => {
        const product = products.find(
          (currentProduct) => currentProduct._id === item.productId,
        );

        if (!product) return null;

        return {
          ...item,
          product,
          total: product.price * item.quantity,
        };
      })
      .filter(Boolean);

    const totalItems = cartItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );
    const subtotal = detailedItems.reduce(
      (total, item) => total + item.total,
      0,
    );

    return {
      products,
      isLoading,
      cartItems: detailedItems,
      addToCart,
      updateQuantity,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
      subtotal,
      totalItems,
    };
  }, [cartItems, products, isLoading]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

// 3. CREATE AND EXPORT THE CUSTOM HOOK
// eslint-disable-next-line react-refresh/only-export-components
export const useShop = () => {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error("useShop must be used within a ShopProvider.");
  }

  return context;
};
