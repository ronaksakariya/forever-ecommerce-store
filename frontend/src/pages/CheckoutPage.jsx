import { Link } from "react-router-dom";

import { assets } from "@/assets/frontend_assets/assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCheckout } from "@/hooks/useCheckout";

const paymentMethods = [
  {
    id: "stripe",
    label: "Stripe",
    logo: assets.stripe_logo,
  },
  {
    id: "razorpay",
    label: "Razorpay",
    logo: assets.razorpay_logo,
  },
  {
    id: "cod",
    label: "Cash on Delivery",
  },
];

const formFields = [
  { id: "name", label: "Name", type: "text", autoComplete: "name" },
  { id: "email", label: "Email", type: "email", autoComplete: "email" },
  {
    id: "street",
    label: "Street",
    type: "text",
    autoComplete: "street-address",
  },
  { id: "city", label: "City", type: "text", autoComplete: "address-level2" },
  { id: "state", label: "State", type: "text", autoComplete: "address-level1" },
  { id: "zip", label: "Zip", type: "text", autoComplete: "postal-code" },
  {
    id: "country",
    label: "Country",
    type: "text",
    autoComplete: "country-name",
  },
  { id: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
];

const CheckoutPage = () => {
  const {
    cartItems,
    formData,
    paymentMethod,
    setPaymentMethod,
    shippingFee,
    submitOrder,
    subtotal,
    total,
    totalItems,
    updateField,
  } = useCheckout();

  return (
    <section className="bg-[#FAF9F6] px-4 py-10 sm:px-6 lg:px-8">
      <form onSubmit={submitOrder} className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 border-b border-[#E5E5E5] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#000000]">
              Checkout
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-[#000000] sm:text-5xl">
              Delivery details
            </h1>
            <p className="mt-4 text-sm leading-6 text-[#000000]/70">
              Confirm your address, order total, and payment method.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-[#000000] bg-[#FAF9F6] text-[#000000] hover:bg-[#E5E5E5]"
          >
            <Link to="/cart">Back to Cart</Link>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            <section className="rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-[#000000]">
                Shipping Address
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {formFields.map((field) => (
                  <label
                    key={field.id}
                    htmlFor={field.id}
                    className={
                      field.id === "street" ? "sm:col-span-2" : undefined
                    }
                  >
                    <span className="text-sm font-medium text-[#000000]">
                      {field.label}
                    </span>
                    <Input
                      id={field.id}
                      type={field.type}
                      autoComplete={field.autoComplete}
                      value={formData[field.id]}
                      onChange={(event) =>
                        updateField(field.id, event.target.value)
                      }
                      className="mt-2 h-11"
                    />
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-[#000000]">
                Payment Method
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex h-20 items-center justify-center rounded-lg border px-4 text-sm font-semibold text-[#000000] transition hover:border-[#000000] ${
                      paymentMethod === method.id
                        ? "border-[#000000] bg-[#E5E5E5]"
                        : "border-[#E5E5E5] bg-[#FAF9F6]"
                    }`}
                  >
                    {method.logo ? (
                      <img
                        src={method.logo}
                        alt={method.label}
                        className="max-h-8 object-contain"
                      />
                    ) : (
                      method.label
                    )}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-[#000000]">
              Cart Totals
            </h2>
            <div className="mt-6 space-y-4 border-b border-[#E5E5E5] pb-6 text-sm text-[#000000]/70">
              <div className="flex items-center justify-between gap-4">
                <span>Items</span>
                <span className="font-semibold text-[#000000]">
                  {totalItems}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Subtotal</span>
                <span className="font-semibold text-[#000000]">
                  ${subtotal}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Shipping</span>
                <span className="font-semibold text-[#000000]">
                  ${shippingFee}
                </span>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between gap-4 text-lg font-semibold text-[#000000]">
              <span>Total</span>
              <span>${total}</span>
            </div>

            {cartItems.length > 0 ? (
              <div className="mt-6 space-y-4 border-t border-[#E5E5E5] pt-6">
                {cartItems.map((item) => (
                  <div key={item.cartItemKey} className="flex gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="size-14 rounded-lg bg-[#E5E5E5] object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#000000]">
                        {item.product.name}
                      </p>
                      <p className="mt-1 text-xs text-[#000000]/60">
                        Size {item.size} / Qty {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 rounded-lg border border-[#E5E5E5] p-4 text-sm text-[#000000]/70">
                Your cart is empty.
              </p>
            )}

            <Button
              type="submit"
              className="mt-6 h-12 w-full bg-[#000000] text-base text-[#FAF9F6] hover:bg-[#000000]/80"
            >
              Place Order
            </Button>
          </aside>
        </div>
      </form>
    </section>
  );
};

export default CheckoutPage;
