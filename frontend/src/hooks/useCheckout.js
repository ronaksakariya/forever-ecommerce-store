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

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const useCheckout = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const { cartItems, clearCart, refreshProducts, subtotal, totalItems } =
    useShop();
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

  const saveDeliveryAddress = async () => {
    if (!saveAddress) return;

    try {
      const addressResponse = await axiosInstance.post("/api/user/addresses", {
        ...formData,
        label: "Home",
      });

      if (addressResponse.data.success) {
        setCurrentUser(addressResponse.data.data);
      }
    } catch (addressError) {
      toast.error(
        addressError.response?.data?.message ||
          "Order placed, but address was not saved.",
      );
    }
  };

  const finishSuccessfulOrder = async (message) => {
    await saveDeliveryAddress();
    clearCart();

    try {
      await refreshProducts({ showError: false });
    } catch {
      toast.info("Order placed, but latest stock could not be refreshed.");
    }

    toast.success(message);
    navigate("/orders");
  };

  const submitOrder = async (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const unavailableItem = cartItems.find(
      (item) => item.availableStock < item.quantity,
    );

    if (unavailableItem) {
      toast.error(
        `${unavailableItem.product.name} has only ${unavailableItem.availableStock} left in size ${unavailableItem.size}.`,
      );
      return;
    }

    const missingField = Object.entries(formData).find(
      ([, value]) => !value.trim(),
    );

    if (missingField) {
      toast.error("Please fill all delivery details.");
      return;
    }

    try {
      setIsSubmitting(true);

      const orderItems = cartItems.map((item) => ({
        productId: item.product._id,
        size: item.size,
        quantity: item.quantity,
      }));

      if (paymentMethod === "razorpay") {
        const scriptLoaded = await loadRazorpayScript();

        if (!scriptLoaded) {
          toast.error("Unable to load Razorpay. Please try again.");
          return;
        }

        const response = await axiosInstance.post("/api/order/razorpay/create", {
          items: orderItems,
          paymentMethod,
          shippingAddress: formData,
        });

        if (!response.data.success) return;

        const { order, razorpayOrder, keyId } = response.data.data;
        const activeUser = getActiveUser(currentUser);

        await new Promise((resolve, reject) => {
          const razorpay = new window.Razorpay({
            key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: "Forever",
            description: "Order payment",
            order_id: razorpayOrder.id,
            prefill: {
              name: formData.name || activeUser?.name || "",
              email: formData.email || activeUser?.email || "",
              contact: formData.phone || "",
            },
            notes: {
              orderId: order._id,
            },
            handler: async (paymentResponse) => {
              try {
                const verifyResponse = await axiosInstance.post(
                  "/api/order/razorpay/verify",
                  {
                    orderId: order._id,
                    ...paymentResponse,
                  },
                );

                if (verifyResponse.data.success) {
                  await finishSuccessfulOrder("Payment successful. Order placed.");
                  resolve();
                  return;
                }

                reject(new Error("Payment verification failed."));
              } catch (verifyError) {
                reject(verifyError);
              }
            },
            modal: {
              ondismiss: () => {
                reject(new Error("Payment was cancelled."));
              },
            },
          });

          razorpay.open();
        });

        return;
      }

      if (paymentMethod === "cod") {
        const response = await axiosInstance.post("/api/order/place", {
          items: orderItems,
          paymentMethod,
          shippingAddress: formData,
        });

        if (response.data.success) {
          await finishSuccessfulOrder("Order placed successfully.");
        }

        return;
      }

      toast.error("Invalid payment method.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to place order.",
      );
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
