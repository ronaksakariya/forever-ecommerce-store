import { useState } from "react";
import { Trash2, Search } from "lucide-react";

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Kid Tapered Slim Fit Trouser",
    category: "Kids",
    price: 38,
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=80&h=80&fit=crop",
  },
  {
    id: 2,
    name: "Men Round Neck Pure Cotton T-shirt",
    category: "Men",
    price: 64,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&h=80&fit=crop",
  },
  {
    id: 3,
    name: "Boy Round Neck Pure Cotton T-shirt",
    category: "Kids",
    price: 60,
    image:
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=80&h=80&fit=crop",
  },
  {
    id: 4,
    name: "Women Zip-Front Relaxed Fit Jacket",
    category: "Women",
    price: 74,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=80&h=80&fit=crop",
  },
  {
    id: 5,
    name: "Men Tapered Fit Flat-Front Trousers",
    category: "Men",
    price: 58,
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=80&h=80&fit=crop",
  },
  {
    id: 6,
    name: "Girls Round Neck Cotton Top",
    category: "Kids",
    price: 56,
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=80&h=80&fit=crop",
  },
  {
    id: 7,
    name: "Women Zip-Front Relaxed Fit Jacket",
    category: "Women",
    price: 68,
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=80&h=80&fit=crop",
  },
  {
    id: 8,
    name: "Kid Tapered Slim Fit Trouser",
    category: "Kids",
    price: 40,
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=80&h=80&fit=crop",
  },
  {
    id: 9,
    name: "Men Printed Plain Cotton Shirt",
    category: "Men",
    price: 52,
    image:
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=80&h=80&fit=crop",
  },
  {
    id: 10,
    name: "Women Zip-Front Relaxed Fit Jacket",
    category: "Women",
    price: 78,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=80&h=80&fit=crop",
  },
];

const categoryColors = {
  Men: "bg-blue-50 text-blue-600",
  Women: "bg-pink-50 text-pink-600",
  Kids: "bg-green-50 text-green-600",
};

export default function ListItems() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [search, setSearch] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const deleteProduct = (id) => {
    if (window.confirm("Remove this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

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

      {/* Desktop Table */}
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
                key={product.id}
                className="hover:bg-gray-50/50 transition-colors group"
              >
                <td className="px-5 py-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
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
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[product.category]}`}
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
                    onClick={() => deleteProduct(product.id)}
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm"
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={product.image}
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
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[product.category]}`}
                >
                  {product.category}
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  ${product.price}
                </span>
              </div>
            </div>
            <button
              onClick={() => deleteProduct(product.id)}
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
    </div>
  );
}
