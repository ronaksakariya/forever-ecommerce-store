import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { toast } from "react-toastify";

import StatusSelect from "../components/StatusSelect";
import axiosInstance from "../utils/axiosInstance";

const formatDate = (date) => new Date(date).toLocaleDateString("en-US");

const formatPaymentMethod = (method) =>
  method === "cod" ? "COD" : String(method || "").toUpperCase();

const getCustomerName = (order) =>
  order.shippingAddress?.name || order.user?.name || "Customer";

const getAddress = (order) => {
  const address = order.shippingAddress || {};

  return [
    address.street,
    [address.city, address.state, address.country, address.zip]
      .filter(Boolean)
      .join(", "),
  ]
    .filter(Boolean)
    .join("\n");
};

const getItemCount = (order) =>
  order.items.reduce((total, item) => total + item.quantity, 0);

const OrderItems = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <div className="mb-1">
      {items.map((item, index) => (
        <p
          key={`${item.product}-${item.size}-${index}`}
          className="text-sm text-gray-700"
        >
          {item.name} x {item.quantity} {item.size}
        </p>
      ))}
    </div>
  );
};

const OrderDetails = ({ order }) => (
  <div className="space-y-0.5">
    <p className="text-sm text-gray-700">Items : {getItemCount(order)}</p>
    <p className="text-sm text-gray-700">
      Method : {formatPaymentMethod(order.paymentMethod)}
    </p>
    <p className="text-sm text-gray-700">
      Payment : {order.paymentStatus}
    </p>
    <p className="text-sm text-gray-700">Date : {formatDate(order.createdAt)}</p>
  </div>
);

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/api/order/admin/orders");
        setOrders(response.data.data || []);
      } catch (fetchError) {
        setError(
          fetchError.response?.data?.message || "Failed to load orders.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async (id, val) => {
    const previousOrders = orders;

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order._id === id ? { ...order, status: val } : order,
      ),
    );

    try {
      const response = await axiosInstance.patch(
        `/api/order/admin/orders/${id}/status`,
        { status: val },
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === id ? response.data.data : order,
        ),
      );
      toast.success("Order status updated.");
    } catch (updateError) {
      setOrders(previousOrders);
      toast.error(
        updateError.response?.data?.message || "Failed to update order status.",
      );
    }
  };

  if (isLoading) {
    return (
      <div>
        <h2 className="text-lg font-medium text-gray-800 mb-5">Order Page</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-sm text-gray-600">
          Loading orders...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-lg font-medium text-gray-800 mb-5">Order Page</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-800 mb-5">Order Page</h2>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-sm text-gray-600">
          No orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              {/* MOBILE < 640px */}
              <div className="flex flex-col gap-3 sm:hidden">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 border border-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <Package
                      size={26}
                      className="text-gray-500"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {getCustomerName(order)}
                    </p>
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                      {getAddress(order)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress?.phone}
                    </p>
                  </div>
                </div>
                <OrderItems items={order.items} />
                <OrderDetails order={order} />
                <div className="flex items-center gap-4">
                  <p className="text-sm font-semibold text-gray-900">
                    ${order.total}
                  </p>
                  <StatusSelect
                    value={order.status}
                    onChange={(val) => updateStatus(order._id, val)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* TABLET 640px-1023px */}
              <div className="hidden sm:flex lg:hidden gap-4">
                <div className="flex gap-3 flex-1 min-w-0">
                  <div className="w-14 h-14 border border-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <Package
                      size={28}
                      className="text-gray-500"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="min-w-0">
                    <OrderItems items={order.items} />
                    <p className="text-sm font-semibold text-gray-900">
                      {getCustomerName(order)}
                    </p>
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                      {getAddress(order)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress?.phone}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-between flex-shrink-0 w-44">
                  <OrderDetails order={order} />
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-semibold text-gray-900">
                      ${order.total}
                    </p>
                    <StatusSelect
                      value={order.status}
                      onChange={(val) => updateStatus(order._id, val)}
                    />
                  </div>
                </div>
              </div>

              {/* DESKTOP 1024px+ */}
              <div className="hidden lg:flex items-start gap-4">
                <div className="w-14 h-14 border border-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  <Package
                    size={28}
                    className="text-gray-500"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <OrderItems items={order.items} />
                  <p className="text-sm font-semibold text-gray-900">
                    {getCustomerName(order)}
                  </p>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {getAddress(order)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress?.phone}
                  </p>
                </div>
                <div className="flex-shrink-0 w-44">
                  <OrderDetails order={order} />
                </div>
                <div className="flex-shrink-0 flex flex-col items-end gap-3">
                  <p className="text-sm font-semibold text-gray-900">
                    ${order.total}
                  </p>
                  <StatusSelect
                    value={order.status}
                    onChange={(val) => updateStatus(order._id, val)}
                    className="w-40"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
