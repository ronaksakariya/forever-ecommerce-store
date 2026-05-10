import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

// eslint-disable-next-line react-refresh/only-export-components
export const ShopContext = createContext(null);

const CART_STORAGE_KEY = "forever_cart";

const getCartItemKey = (productId, size) => `${productId}-${size}`;

const getProductId = (product) => {
  if (!product) return "";
  return typeof product === "object" ? product._id : product;
};

const normalizeQuantity = (quantity) => {
  const parsedQuantity = Number(quantity);
  return Number.isFinite(parsedQuantity) && parsedQuantity > 0
    ? Math.floor(parsedQuantity)
    : 1;
};

const normalizeCartItems = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.reduce((normalizedItems, item) => {
    const productId = getProductId(item.productId || item.product);
    const size = item.size;

    if (!productId || !size) {
      return normalizedItems;
    }

    const cartItemKey = getCartItemKey(productId, size);
    const quantity = normalizeQuantity(item.quantity);
    const existingItem = normalizedItems.find(
      (currentItem) => currentItem.cartItemKey === cartItemKey,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      return normalizedItems;
    }

    normalizedItems.push({
      cartItemKey,
      productId,
      quantity,
      size,
    });

    return normalizedItems;
  }, []);
};

const loadCartFromStorage = () => {
  try {
    const savedItems = localStorage.getItem(CART_STORAGE_KEY);
    return normalizeCartItems(savedItems ? JSON.parse(savedItems) : []);
  } catch (error) {
    console.error("Failed to load cart from local storage:", error);
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
};

const mergeCartItems = (...cartGroups) => {
  return cartGroups.flat().reduce((mergedItems, item) => {
    const normalizedItem = normalizeCartItems([item])[0];

    if (!normalizedItem) {
      return mergedItems;
    }

    const existingItem = mergedItems.find(
      (currentItem) => currentItem.cartItemKey === normalizedItem.cartItemKey,
    );

    if (existingItem) {
      existingItem.quantity = Math.max(
        existingItem.quantity,
        normalizedItem.quantity,
      );
      return mergedItems;
    }

    mergedItems.push(normalizedItem);
    return mergedItems;
  }, []);
};

const serializeCartItems = (items) => {
  return JSON.stringify(normalizeCartItems(items));
};

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(loadCartFromStorage);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const [isCartSynced, setIsCartSynced] = useState(false);
  const lastSyncedCartRef = useRef(null);

  const activeUser = currentUser?.user || currentUser;
  const userId = activeUser?._id;
  const userCartData = activeUser?.cartData;

  // fetch products
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

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(normalizeCartItems(cartItems)),
      );
    } catch (error) {
      console.error("Failed to save cart to local storage:", error);
    }
  }, [cartItems]);

  // onLogin
  useEffect(() => {
    if (!userId) {
      setIsCartSynced(false);
      lastSyncedCartRef.current = null;
      setCartItems((currentItems) => normalizeCartItems(currentItems));
      return;
    }

    const savedCart = normalizeCartItems(userCartData);

    lastSyncedCartRef.current = serializeCartItems(savedCart);
    setCartItems((currentItems) => mergeCartItems(currentItems, savedCart));
    setIsCartSynced(true);
  }, [userCartData, userId]);

  useEffect(() => {
    const updateCartToDB = async () => {
      const normalizedCart = normalizeCartItems(cartItems);
      const serializedCart = serializeCartItems(normalizedCart);

      if (serializedCart === lastSyncedCartRef.current) {
        return;
      }

      try {
        await axiosInstance.post("/api/cart/update", {
          cartItems: normalizedCart,
        });
        lastSyncedCartRef.current = serializedCart;
      } catch (error) {
        console.error("Failed to sync cart with database:", error);
      }
    };

    if (userId && isCartSynced) {
      updateCartToDB();
    }
  }, [cartItems, userId, isCartSynced]);

  const addToCart = useCallback((product, size) => {
    const productId = getProductId(product);

    if (!productId || !size) {
      return;
    }

    setCartItems((currentItems) => {
      const cartItemKey = getCartItemKey(productId, size);
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
          productId,
          quantity: 1,
          size,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((cartItemKey, quantity) => {
    const safeQuantity = normalizeQuantity(quantity);
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.cartItemKey === cartItemKey
          ? { ...item, quantity: safeQuantity }
          : item,
      ),
    );
  }, []);

  const increaseQuantity = useCallback((cartItemKey) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.cartItemKey === cartItemKey
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }, []);

  const decreaseQuantity = useCallback((cartItemKey) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.cartItemKey === cartItemKey
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item,
      ),
    );
  }, []);

  const removeFromCart = useCallback((cartItemKey) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.cartItemKey !== cartItemKey),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

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

    const totalItems = detailedItems.reduce(
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
  }, [
    addToCart,
    cartItems,
    clearCart,
    decreaseQuantity,
    increaseQuantity,
    isLoading,
    products,
    removeFromCart,
    updateQuantity,
  ]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useShop = () => {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error("useShop must be used within a ShopProvider.");
  }

  return context;
};
