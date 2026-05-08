import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
// Added Package and LogOut for the menu icons
import {
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  Package,
  LogOut,
} from "lucide-react";

import { assets } from "@/assets/frontend_assets/assets";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Collection", to: "/collection" },
  { label: "About", to: "/" },
  { label: "Contact", to: "/" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useShop();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E5E5] bg-[#FAF9F6]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <img src={assets.logo} alt="Noir Eternal" className="h-8 w-auto" />
        </NavLink>

        {/* Desktop Nav */}
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
          <Button variant="ghost" size="icon" className="text-[#000000]">
            <Search className="h-5 w-5" />
          </Button>

          {/* User Icon / Dropdown Logic */}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#000000]">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-white border-[#E5E5E5]"
              >
                <DropdownMenuLabel className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/orders")}
                  className="cursor-pointer"
                >
                  <Package className="mr-2 h-4 w-4" />
                  <span>Orders</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* Logout Item with Red text hint */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-[#000000]"
            >
              <Link to="/login">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}

          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative text-[#000000]"
          >
            <Link to="/cart">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#000000] px-1 text-[10px] font-semibold text-[#FAF9F6]">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="border-t border-[#E5E5E5] bg-[#FAF9F6] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium uppercase tracking-[0.14em]"
              >
                {item.label}
              </NavLink>
            ))}
            {currentUser && (
              <button
                onClick={handleLogout}
                className="mt-2 w-full rounded-lg bg-black py-3 text-sm font-medium uppercase tracking-[0.14em] text-white"
              >
                Logout
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
