import { useEffect, useState } from "react";
import { Trash2, Search, Loader, AlertCircle, X } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const categoryColors = {
  Men: "bg-blue-50 text-blue-600",
  Women: "bg-pink-50 text-pink-600",
  Kids: "bg-green-50 text-green-600",
};

export default function ListItems() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
  });

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/api/product/list-products");
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      toast.error(`${error.response?.data?.message || error.message}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const initiateDelete = (id) => {
    setDeleteModal({ isOpen: true, productId: id });
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, productId: null });
  };

  const confirmDelete = async () => {
    const id = deleteModal.productId;
    if (!id) return;

    try {
      setDeleteModal({ isOpen: false, productId: null });

      // setProducts((prev) => prev.filter((p) => p._id !== id));

      await axiosInstance.post("/api/product/remove-product", { id });
      fetchProducts();
      toast.success("Product removed successfully");
    } catch (error) {
      toast.error("something went wrong while removing product");
      fetchProducts();
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          All Products List
        </h2>
        <div className="relative w-full sm:w-64">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
          />
        </div>
      </div>

      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">
                Image
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">
                Name
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">
                Category
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">
                Price
              </th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-gray-50/50 transition-colors group"
              >
                <td className="px-5 py-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-sm font-medium text-gray-800">
                    {product.name}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 capitalize rounded-full ${categoryColors[product.category]}`}
                  >
                    {product.category}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="text-sm font-semibold text-gray-800">
                    ${product.price}
                  </span>
                </td>
                <td className="px-5 py-3 text-center">
                  <button
                    onClick={() => initiateDelete(product._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            No products found
          </div>
        )}
      </div>

      <div className="md:hidden space-y-3">
        {filtered.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm"
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {product.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs font-medium px-2 capitalize py-0.5 rounded-full ${categoryColors[product.category]}`}
                >
                  {product.category}
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  ${product.price}
                </span>
              </div>
            </div>
            <button
              onClick={() => initiateDelete(product._id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50 flex-shrink-0"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            No products found
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
      </p>

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
          {/* Modal Content */}
          <div className="w-full max-w-sm p-6 bg-white shadow-xl rounded-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Remove Product
                </h3>
              </div>
              <button
                onClick={cancelDelete}
                className="p-1 text-gray-400 transition-colors rounded-lg hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to remove this product from your store? This
              action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-xl hover:bg-gray-50 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 border border-transparent rounded-xl hover:bg-red-700 active:scale-[0.98]"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
