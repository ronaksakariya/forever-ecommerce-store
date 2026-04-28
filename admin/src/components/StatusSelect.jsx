import { useState, useRef, useEffect } from "react";

const STATUS_OPTIONS = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for delivery",
  "Delivered",
];

export default function StatusSelect({ value, onChange, className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Trigger — looks exactly like a native select */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between border border-gray-300 rounded bg-white text-sm text-gray-700 px-3 py-2 cursor-pointer focus:outline-none focus:border-gray-500"
      >
        <span>{value}</span>
        <svg
          className="w-4 h-4 text-gray-500 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown — opens downward, full width of button, z-index keeps it above siblings */}
      {open && (
        <ul className="absolute left-0 right-0 top-full mt-0.5 z-50 bg-white border border-gray-300 rounded shadow-md overflow-hidden">
          {STATUS_OPTIONS.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-600 hover:text-white ${opt === value ? "bg-blue-600 text-white" : "text-gray-700"}`}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
