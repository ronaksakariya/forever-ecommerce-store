/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const response = await axiosInstance.get("/api/user/verify-user");

    if (response.data.success) {
      setCurrentUser(response.data.data);
    }

    return response.data.data;
  }, []);

  const logout = async () => {
    try {
      await axiosInstance.post("/api/user/logout");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Something went wrong during logout.");
    } finally {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await refreshUser();
      } catch (error) {
        console.log(error.message);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, isLoading, logout, refreshUser }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
