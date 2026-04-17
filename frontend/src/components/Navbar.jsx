import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";

import { assets } from "@/assets/frontend_assets/assets";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Collection", to: "/collection" },
  { label: "About", to: "/" },
  { label: "Contact", to: "/" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E5E5] bg-[#FAF9F6]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3" aria-label="Noir Eternal home">
          <img src={assets.logo} alt="Noir Eternal" className="h-8 w-auto" />
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className="text-sm font-medium uppercase tracking-[0.14em] text-[#000000] transition hover:text-[#000000]/60"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-[#000000] hover:bg-[#E5E5E5]"
            aria-label="Search"
          >
            <Search />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hidden text-[#000000] hover:bg-[#E5E5E5] sm:inline-flex"
            aria-label="Profile"
          >
            <User />
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative text-[#000000] hover:bg-[#E5E5E5]"
          >
            <Link to="/cart" aria-label="Cart">
              <ShoppingBag />
              {totalItems > 0 ? (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#000000] px-1 text-[10px] font-semibold leading-none text-[#FAF9F6]">
                  {totalItems}
                </span>
              ) : null}
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-[#000000] hover:bg-[#E5E5E5] md:hidden"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav className="border-t border-[#E5E5E5] bg-[#FAF9F6] px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium uppercase tracking-[0.14em] text-[#000000] hover:bg-[#E5E5E5]"
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
};

export default Navbar;
