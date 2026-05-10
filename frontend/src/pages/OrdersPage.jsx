import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

const formatPaymentMethod = (method) =>
  method === "cod" ? "Cash on Delivery" : method;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/api/order/my-orders");
        setOrders(response.data.data || []);
      } catch (fetchError) {
        setError(
          fetchError.response?.data?.message || "Failed to load your orders.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <section className="bg-[#FAF9F6] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 border-b border-[#E5E5E5] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#000000]">
              Orders
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-[#000000] sm:text-5xl">
              My orders
            </h1>
            <p className="mt-4 text-sm leading-6 text-[#000000]/70">
              Track your order status and payment details.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-[#000000] bg-[#FAF9F6] text-[#000000] hover:bg-[#E5E5E5]"
          >
            <Link to="/collection">Continue Shopping</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] px-6 py-16 text-center text-sm text-[#000000]/70">
            Loading orders...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] px-6 py-16 text-center text-sm text-red-600">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] px-6 py-16 text-center">
            <h2 className="text-3xl font-semibold text-[#000000]">
              No orders yet.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#000000]/70">
              Your placed orders will appear here.
            </p>
            <Button
              asChild
              className="mt-8 bg-[#000000] px-6 text-[#FAF9F6] hover:bg-[#000000]/80"
            >
              <Link to="/collection">Shop Collection</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article
                key={order._id}
                className="rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] p-4 sm:p-5"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5]">
                        <Package className="size-5 text-[#000000]/70" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#000000]">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="mt-1 text-xs text-[#000000]/60">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div
                          key={`${order._id}-${item.product}-${item.size}-${index}`}
                          className="flex gap-3"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="size-16 rounded-lg bg-[#E5E5E5] object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[#000000]">
                              {item.name}
                            </p>
                            <p className="mt-1 text-xs text-[#000000]/60">
                              Size {item.size} / Qty {item.quantity}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[#000000]">
                              ${item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 text-sm text-[#000000]/70 sm:grid-cols-2 lg:w-72 lg:grid-cols-1">
                    <p>
                      <span className="font-medium text-[#000000]">
                        Status:
                      </span>{" "}
                      {order.status}
                    </p>
                    <p>
                      <span className="font-medium text-[#000000]">
                        Method:
                      </span>{" "}
                      {formatPaymentMethod(order.paymentMethod)}
                    </p>
                    <p>
                      <span className="font-medium text-[#000000]">
                        Payment:
                      </span>{" "}
                      {order.paymentStatus}
                    </p>
                    <p>
                      <span className="font-medium text-[#000000]">
                        Total:
                      </span>{" "}
                      ${order.total}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrdersPage;
