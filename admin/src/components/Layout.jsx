import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { PlusCircle, List, ClipboardList, LogOut, Menu, X } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const navItems = [
  { to: "/add-items", label: "Add Items", icon: PlusCircle },
  { to: "/list-items", label: "List Items", icon: List },
  { to: "/orders", label: "Orders", icon: ClipboardList },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("api/user/admin-logout");
      if (response.data.success) {
        navigate("/login");
        toast.success("Logged out successfully!");
      }
    } catch (error) {
      toast.error(
        `Logout failed. ${error.response?.data?.message || error.message}.`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div>
            <div className="flex items-center gap-0.5">
              <span className="font-display font-bold text-lg tracking-widest text-gray-900 uppercase">
                Forever
              </span>
              <span className="w-2 h-2 rounded-full bg-pink-400 mb-2 ml-0.5"></span>
            </div>
            <p className="text-[9px] tracking-[0.2em] text-pink-400 font-medium uppercase -mt-1">
              Admin Panel
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium px-4 py-2 rounded-full transition-all"
        >
          <LogOut size={13} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      <div className="flex flex-1 pt-14">
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/30 md:hidden top-14"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-14 left-0 bottom-0 z-20 w-56 bg-white border-r border-gray-200 transition-transform duration-300 md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="p-3 space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-pink-50 text-pink-500 border border-pink-100"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 md:ml-56 p-4 sm:p-6 min-h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
