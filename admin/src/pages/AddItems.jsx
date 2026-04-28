import { useState } from "react";
import { Upload, X } from "lucide-react";
import CustomSelect from "../components/CustomSelect";

const CATEGORIES = ["Men", "Women", "Kids"];
const SUB_CATEGORIES = ["Topwear", "Bottomwear", "Winterwear"];
const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function AddItems() {
  const [images, setImages] = useState([null, null, null, null]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [bestseller, setBestseller] = useState(false);
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleImageChange = (index, file) => {
    if (!file) return;
    const updated = [...images];
    updated[index] = URL.createObjectURL(file);
    setImages(updated);
  };

  const removeImage = (index) => {
    const updated = [...images];
    updated[index] = null;
    setImages(updated);
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // UI only — no business logic
    alert("Product Added! (UI demo)");
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Add New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload Images
          </label>
          <div className="flex gap-2">
            {images.map((img, index) => (
              <div key={index} className="relative w-16 h-16 flex-shrink-0">
                {img ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50"
                    >
                      <X size={8} className="text-red-500" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-pink-300 hover:bg-pink-50/30 transition-all">
                    <Upload size={14} className="text-gray-400 mb-0.5" />
                    <span className="text-[9px] text-gray-400 font-medium">
                      Upload
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageChange(index, e.target.files[0])
                      }
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Product name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type here"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Product description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write content here"
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all resize-none"
          />
        </div>

        {/* Category, Sub-category, Price */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product category
            </label>
            <CustomSelect
              value={category}
              onChange={setCategory}
              options={CATEGORIES}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Sub category
            </label>
            <CustomSelect
              value={subCategory}
              onChange={setSubCategory}
              options={SUB_CATEGORIES}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product Price
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                $
              </span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="25"
                className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Product Sizes
          </label>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  selectedSizes.includes(size)
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-gray-100 text-gray-600 border-gray-100 hover:border-gray-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Bestseller */}
        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            id="bestseller"
            checked={bestseller}
            onChange={(e) => setBestseller(e.target.checked)}
            className="w-4 h-4 accent-pink-500 cursor-pointer rounded"
          />
          <label
            htmlFor="bestseller"
            className="text-sm text-gray-700 cursor-pointer select-none"
          >
            Add to bestseller
          </label>
        </div>

        <button
          type="submit"
          className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-xl text-sm tracking-wide transition-all duration-200 active:scale-[0.98]"
        >
          ADD
        </button>
      </form>
    </div>
  );
}
