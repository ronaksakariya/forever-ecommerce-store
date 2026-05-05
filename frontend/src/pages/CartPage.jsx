import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SHIPPING_FEE } from "@/lib/cart";
import { useShop } from "@/context/ShopContext";

const CartPage = () => {
  const {
    cartItems,
    clearCart,
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
    subtotal,
    totalItems,
    updateQuantity,
  } = useShop();

  const total = subtotal + SHIPPING_FEE;

  return (
    <section className="bg-[#FAF9F6] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 border-b border-[#E5E5E5] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#000000]">
              Cart
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-[#000000] sm:text-5xl">
              Shopping cart
            </h1>
            <p className="mt-4 text-sm leading-6 text-[#000000]/70">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart.
            </p>
          </div>

          {cartItems.length > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={clearCart}
              className="border-[#000000] bg-[#FAF9F6] text-[#000000] hover:bg-[#E5E5E5]"
            >
              Clear Cart
            </Button>
          ) : null}
        </div>

        {cartItems.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <article
                  key={item.cartItemKey}
                  className="grid gap-4 rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] p-4 sm:grid-cols-[120px_1fr] sm:p-5"
                >
                  <Link
                    to={`/product/${item.product._id}`}
                    className="aspect-square overflow-hidden rounded-lg bg-[#E5E5E5]"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </Link>

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#000000]/60">
                        {item.product.category} / {item.product.subCategory}
                      </p>
                      <Link
                        to={`/product/${item.product._id}`}
                        className="mt-2 block text-lg font-semibold text-[#000000] hover:text-[#000000]/70"
                      >
                        {item.product.name}
                      </Link>
                      <p className="mt-2 text-sm text-[#000000]/70">
                        Size: {item.size}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[#000000]">
                        ${item.product.price}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                      <div className="flex items-center rounded-lg border border-[#E5E5E5]">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => decreaseQuantity(item.cartItemKey)}
                          className="text-[#000000] hover:bg-[#E5E5E5]"
                          aria-label="Decrease quantity"
                        >
                          <Minus />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(event) =>
                            updateQuantity(item.cartItemKey, event.target.value)
                          }
                          className="h-10 w-16 border-0 text-center"
                          aria-label="Quantity"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => increaseQuantity(item.cartItemKey)}
                          className="text-[#000000] hover:bg-[#E5E5E5]"
                          aria-label="Increase quantity"
                        >
                          <Plus />
                        </Button>
                      </div>

                      <p className="min-w-20 text-right text-base font-semibold text-[#000000]">
                        ${item.total}
                      </p>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.cartItemKey)}
                        className="text-[#000000] hover:bg-[#E5E5E5]"
                        aria-label="Remove item"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold text-[#000000]">
                Order Summary
              </h2>
              <div className="mt-6 space-y-4 border-b border-[#E5E5E5] pb-6 text-sm text-[#000000]/70">
                <div className="flex items-center justify-between gap-4">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#000000]">
                    ${subtotal}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Shipping</span>
                  <span className="font-semibold text-[#000000]">
                    ${SHIPPING_FEE}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between gap-4 text-lg font-semibold text-[#000000]">
                <span>Total</span>
                <span>${total}</span>
              </div>
              <Button
                asChild
                className="mt-6 h-12 w-full bg-[#000000] text-base text-[#FAF9F6] hover:bg-[#000000]/80"
              >
                <Link to="/checkout">Checkout</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="mt-3 h-12 w-full border-[#000000] bg-[#FAF9F6] text-[#000000] hover:bg-[#E5E5E5]"
              >
                <Link to="/collection">Continue Shopping</Link>
              </Button>
            </aside>
          </div>
        ) : (
          <div className="rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] px-6 py-16 text-center">
            <h2 className="text-3xl font-semibold text-[#000000]">
              Your cart is empty.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#000000]/70">
              Add pieces from the collection and choose a size before checkout.
            </p>
            <Button
              asChild
              className="mt-8 bg-[#000000] px-6 text-[#FAF9F6] hover:bg-[#000000]/80"
            >
              <Link to="/collection">Shop Collection</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CartPage;
