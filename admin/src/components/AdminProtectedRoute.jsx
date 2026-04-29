import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import Loading from "./Loading";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const [isVerified, setIsVerified] = useState(null);
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        await axiosInstance.get("/api/user/verify-admin");
        setIsVerified(true);
      } catch {
        setIsVerified(false);
      }
    };
    verifyAdmin();
  }, []);
  if (isVerified === null) return <Loading />;

  if (!isVerified) return <Navigate to="/login" replace />;

  return children;
};

export default AdminProtectedRoute;
