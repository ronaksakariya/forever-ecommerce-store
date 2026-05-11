import { useEffect, useMemo, useState } from "react";
import { Trash2, Search, Loader, AlertCircle, X, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const categoryColors = {
  men: "bg-blue-50 text-blue-600",
  women: "bg-pink-50 text-pink-600",
  kids: "bg-green-50 text-green-600",
};

const formatCategory = (category) =>
  category ? `${category.charAt(0).toUpperCase()}${category.slice(1)}` : "";

export default function ListItems() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
  });

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name?.toLowerCase().includes(normalizedSearch) ||
        product.category?.toLowerCase().includes(normalizedSearch),
    );
  }, [products, search]);

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

      await axiosInstance.post("/api/product/remove-product", { id });
      setProducts((prev) => prev.filter((product) => product._id !== id));
      toast.success("Product removed successfully");
    } catch (deleteError) {
      toast.error(
        deleteError.response?.data?.message ||
          "Something went wrong while removing product.",
      );
    }
  };

  const getVisibleStock = (product) =>
    product.stock?.filter((item) => Number(item.quantity || 0) > 0) || [];

  useEffect(() => {
    let isMounted = true;

    axiosInstance
      .get("/api/product/list-products")
      .then((response) => {
        if (isMounted && response.data.success) {
          setProducts(response.data.data);
        }
      })
      .catch((fetchError) => {
        if (isMounted) {
          toast.error(
            `${fetchError.response?.data?.message || fetchError.message}.`,
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
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
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">
                Stock
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
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      categoryColors[product.category] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {formatCategory(product.category)}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="text-sm font-semibold text-gray-800">
                    ${product.price}
                  </span>
                </td>
                <td className="px-5 py-3">
                  {getVisibleStock(product).length > 0 ? (
                    <div className="flex max-w-56 flex-wrap gap-1.5">
                      {getVisibleStock(product).map((item) => (
                        <span
                          key={`${product._id}-${item.size}`}
                          className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
                        >
                          {item.size}: {item.quantity}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-red-500">
                      Out of stock
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => navigate(`/edit-items/${product._id}`)}
                      className="text-gray-400 hover:text-gray-900 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
                      aria-label="Edit product"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => initiateDelete(product._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                      aria-label="Delete product"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
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
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
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
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    categoryColors[product.category] ||
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {formatCategory(product.category)}
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  ${product.price}
                </span>
              </div>
              {getVisibleStock(product).length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {getVisibleStock(product).map((item) => (
                    <span
                      key={`${product._id}-${item.size}`}
                      className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
                    >
                      {item.size}: {item.quantity}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-xs font-medium text-red-500">
                  Out of stock
                </p>
              )}
            </div>
            <button
              onClick={() => navigate(`/edit-items/${product._id}`)}
              className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-xl hover:bg-gray-100 shrink-0"
              aria-label="Edit product"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => initiateDelete(product._id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50 shrink-0"
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
