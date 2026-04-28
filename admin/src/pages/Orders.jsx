import { useState } from "react";
import { Package } from "lucide-react";
import StatusSelect from "../components/StatusSelect";

const MOCK_ORDERS = [
  {
    id: 1,
    items: [],
    itemCount: 0,
    customer: "John Doe",
    address: "123 Main St,\nNew York, NY, USA, 10001",
    phone: "1234567890",
    method: "COD",
    payment: "Pending",
    date: "4/27/2026",
    total: 10,
    status: "Delivered",
  },
  {
    id: 2,
    items: ["Men Round Neck Pure Cotton T-shirt x 1 S"],
    itemCount: 1,
    customer: "John Doe",
    address: "123 Main St,\nNew York, NY, USA, 10001",
    phone: "1234567890",
    method: "COD",
    payment: "Pending",
    date: "4/27/2026",
    total: 74,
    status: "Shipped",
  },
  {
    id: 3,
    items: [
      "Kid Tapered Slim Fit Trouser x 7 XL ,",
      "Kid Tapered Slim Fit Trouser x 3 XXL",
    ],
    itemCount: 2,
    customer: "John Doe",
    address: "123 Main St,\nNew York, NY, USA, 10001",
    phone: "1234567890",
    method: "COD",
    payment: "Pending",
    date: "4/26/2026",
    total: 390,
    status: "Delivered",
  },
  {
    id: 4,
    items: ["Men Round Neck Pure Cotton T-shirt x 1 M"],
    itemCount: 1,
    customer: "John Doe",
    address: "123 Main St,\nNew York, NY, USA, 10001",
    phone: "1234567890",
    method: "COD",
    payment: "Pending",
    date: "4/26/2026",
    total: 36,
    status: "Order Placed",
  },
  {
    id: 5,
    items: ["Women Zip-Front Relaxed Fit Jacket x 2 L"],
    itemCount: 2,
    customer: "Jane Smith",
    address: "456 Oak Ave,\nLos Angeles, CA, USA, 90001",
    phone: "9876543210",
    method: "Stripe",
    payment: "Done",
    date: "4/25/2026",
    total: 148,
    status: "Out for delivery",
  },
];

export default function Orders() {
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const updateStatus = (id, val) =>
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: val } : o)),
    );

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-800 mb-5">Order Page</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            {/* ── MOBILE < 640px ── */}
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
                    {order.customer}
                  </p>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {order.address}
                  </p>
                  <p className="text-sm text-gray-600">{order.phone}</p>
                </div>
              </div>
              {order.items.length > 0 && (
                <div>
                  {order.items.map((item, i) => (
                    <p key={i} className="text-sm text-gray-700">
                      {item}
                    </p>
                  ))}
                </div>
              )}
              <div className="space-y-0.5">
                <p className="text-sm text-gray-700">
                  Items : {order.itemCount}
                </p>
                <p className="text-sm text-gray-700">Method : {order.method}</p>
                <p className="text-sm text-gray-700">
                  Payment : {order.payment}
                </p>
                <p className="text-sm text-gray-700">Date : {order.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-semibold text-gray-900">
                  ${order.total}
                </p>
                <StatusSelect
                  value={order.status}
                  onChange={(val) => updateStatus(order.id, val)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* ── TABLET 640px–1023px ── */}
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
                  {order.items.length > 0 && (
                    <div className="mb-1">
                      {order.items.map((item, i) => (
                        <p key={i} className="text-sm text-gray-700">
                          {item}
                        </p>
                      ))}
                    </div>
                  )}
                  <p className="text-sm font-semibold text-gray-900">
                    {order.customer}
                  </p>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {order.address}
                  </p>
                  <p className="text-sm text-gray-600">{order.phone}</p>
                </div>
              </div>
              <div className="flex flex-col justify-between flex-shrink-0 w-44">
                <div className="space-y-0.5">
                  <p className="text-sm text-gray-700">
                    Items : {order.itemCount}
                  </p>
                  <p className="text-sm text-gray-700">
                    Method : {order.method}
                  </p>
                  <p className="text-sm text-gray-700">
                    Payment : {order.payment}
                  </p>
                  <p className="text-sm text-gray-700">Date : {order.date}</p>
                </div>
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-semibold text-gray-900">
                    ${order.total}
                  </p>
                  <StatusSelect
                    value={order.status}
                    onChange={(val) => updateStatus(order.id, val)}
                  />
                </div>
              </div>
            </div>

            {/* ── DESKTOP 1024px+ ── */}
            <div className="hidden lg:flex items-start gap-4">
              <div className="w-14 h-14 border border-gray-200 rounded flex items-center justify-center flex-shrink-0">
                <Package
                  size={28}
                  className="text-gray-500"
                  strokeWidth={1.5}
                />
              </div>
              <div className="flex-1 min-w-0">
                {order.items.length > 0 && (
                  <div className="mb-1">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-sm text-gray-700">
                        {item}
                      </p>
                    ))}
                  </div>
                )}
                <p className="text-sm font-semibold text-gray-900">
                  {order.customer}
                </p>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {order.address}
                </p>
                <p className="text-sm text-gray-600">{order.phone}</p>
              </div>
              <div className="flex-shrink-0 w-44 space-y-0.5">
                <p className="text-sm text-gray-700">
                  Items : {order.itemCount}
                </p>
                <p className="text-sm text-gray-700">Method : {order.method}</p>
                <p className="text-sm text-gray-700">
                  Payment : {order.payment}
                </p>
                <p className="text-sm text-gray-700">Date : {order.date}</p>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-3">
                <p className="text-sm font-semibold text-gray-900">
                  ${order.total}
                </p>
                <StatusSelect
                  value={order.status}
                  onChange={(val) => updateStatus(order.id, val)}
                  className="w-40"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
