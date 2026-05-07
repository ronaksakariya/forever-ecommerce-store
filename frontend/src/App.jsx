import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import AppLayout from "./layout/AppLayout";
import AuthPage from "./pages/AuthPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CollectionPage from "./pages/CollectionPage";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import { ShopProvider } from "./context/ShopContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/collection", element: <CollectionPage /> },
      { path: "/product/:productId", element: <ProductDetailPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/login", element: <AuthPage /> },

      {
        element: <ProtectedRoute />,
        children: [{ path: "/checkout", element: <CheckoutPage /> }],
      },
    ],
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <ShopProvider>
        <RouterProvider router={router} />
        <ToastContainer // ✅ inside providers
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </ShopProvider>
    </AuthProvider>
  );
};

export default App;
