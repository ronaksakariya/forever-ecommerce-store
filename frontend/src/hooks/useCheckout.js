import { useState } from "react";
import { toast } from "react-toastify";

import { SHIPPING_FEE } from "@/lib/cart";
import { useCart } from "@/hooks/useCart";

const initialForm = {
  name: "",
  email: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  phone: "",
};

export const useCheckout = () => {
  const { cartItems, subtotal, totalItems } = useCart();
  const [formData, setFormData] = useState(initialForm);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const total = subtotal + SHIPPING_FEE;

  const updateField = (field, value) => {
    setFormData((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const submitOrder = (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const missingField = Object.entries(formData).find(([, value]) => !value.trim());

    if (missingField) {
      toast.error("Please fill all delivery details.");
      return;
    }

    toast.success("Order details are ready.");
  };

  return {
    cartItems,
    formData,
    paymentMethod,
    setPaymentMethod,
    shippingFee: SHIPPING_FEE,
    submitOrder,
    subtotal,
    total,
    totalItems,
    updateField,
  };
};
