import { useMemo, useState } from "react";

import { products } from "@/assets/frontend_assets/assets";
import { CartContext } from "@/context/cart-context";

const getCartItemKey = (productId, size) => `${productId}-${size}`;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, size) => {
    setCartItems((currentItems) => {
      const cartItemKey = getCartItemKey(product._id, size);
      const existingItem = currentItems.find((item) => item.cartItemKey === cartItemKey);

      if (existingItem) {
        return currentItems.map((item) =>
          item.cartItemKey === cartItemKey ? { ...item, quantity: item.quantity + 1 } : item,
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
        item.cartItemKey === cartItemKey ? { ...item, quantity: safeQuantity } : item,
      ),
    );
  };

  const increaseQuantity = (cartItemKey) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.cartItemKey === cartItemKey ? { ...item, quantity: item.quantity + 1 } : item,
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
        const product = products.find((currentProduct) => currentProduct._id === item.productId);

        if (!product) {
          return null;
        }

        return {
          ...item,
          product,
          total: product.price * item.quantity,
        };
      })
      .filter(Boolean);

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const subtotal = detailedItems.reduce((total, item) => total + item.total, 0);

    return {
      addToCart,
      cartItems: detailedItems,
      clearCart,
      decreaseQuantity,
      increaseQuantity,
      removeFromCart,
      subtotal,
      totalItems,
      updateQuantity,
    };
  }, [cartItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
