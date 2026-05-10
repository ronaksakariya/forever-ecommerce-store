import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { SHIPPING_FEE } from "@/lib/cart";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import axiosInstance from "@/utils/axiosInstance";

const getActiveUser = (currentUser) => currentUser?.user || currentUser;

const getInitialForm = (currentUser) => {
  const activeUser = getActiveUser(currentUser);
  const defaultAddress = activeUser?.address?.find(
    (address) => address.isDefault,
  );

  return {
    name: defaultAddress?.name || activeUser?.name || "",
    email: defaultAddress?.email || activeUser?.email || "",
    street: defaultAddress?.street || "",
    city: defaultAddress?.city || "",
    state: defaultAddress?.state || "",
    zip: defaultAddress?.zip || defaultAddress?.pincode || "",
    country: defaultAddress?.country || "",
    phone: defaultAddress?.phone || "",
  };
};

export const useCheckout = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const { cartItems, clearCart, subtotal, totalItems } = useShop();
  const [formData, setFormData] = useState(() => getInitialForm(currentUser));
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [saveAddress, setSaveAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const total = subtotal + SHIPPING_FEE;

  useEffect(() => {
    setFormData(getInitialForm(currentUser));
  }, [currentUser]);

  const updateField = (field, value) => {
    setFormData((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const submitOrder = async (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const missingField = Object.entries(formData).find(
      ([, value]) => !value.trim(),
    );

    if (missingField) {
      toast.error("Please fill all delivery details.");
      return;
    }

    if (paymentMethod !== "cod") {
      toast.info("Only Cash on Delivery is available right now.");
      return;
    }

    try {
      setIsSubmitting(true);

      const orderItems = cartItems.map((item) => ({
        productId: item.product._id,
        size: item.size,
        quantity: item.quantity,
      }));

      const response = await axiosInstance.post("/api/order/place", {
        items: orderItems,
        paymentMethod,
        shippingAddress: formData,
      });

      if (response.data.success) {
        if (saveAddress) {
          try {
            const addressResponse = await axiosInstance.post(
              "/api/user/addresses",
              {
                ...formData,
                label: "Home",
              },
            );

            if (addressResponse.data.success) {
              setCurrentUser(addressResponse.data.data);
            }
          } catch (addressError) {
            toast.error(
              addressError.response?.data?.message ||
                "Order placed, but address was not saved.",
            );
          }
        }

        clearCart();
        toast.success("Order placed successfully.");
        navigate("/orders");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    cartItems,
    formData,
    isSubmitting,
    paymentMethod,
    saveAddress,
    setSaveAddress,
    setPaymentMethod,
    shippingFee: SHIPPING_FEE,
    submitOrder,
    subtotal,
    total,
    totalItems,
    updateField,
  };
};
