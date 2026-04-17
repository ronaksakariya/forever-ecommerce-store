import { useState } from "react";
import { toast } from "react-toastify";

export const useNewsletter = () => {
  const [email, setEmail] = useState("");

  const submitNewsletter = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.info("Enter your email to join the list.");
      return;
    }

    toast.success("You are on the list.");
    setEmail("");
  };

  return {
    email,
    setEmail,
    submitNewsletter,
  };
};
