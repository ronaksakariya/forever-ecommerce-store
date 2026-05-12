import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader, Upload, X } from "lucide-react";
import CustomSelect from "../components/CustomSelect";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

const CATEGORIES = ["Men", "Women", "Kids"];
const SUB_CATEGORIES = ["Topwear", "Bottomwear", "Winterwear"];
const SIZES = ["S", "M", "L", "XL", "XXL"];

const getInitialStock = () =>
  SIZES.reduce((stock, size) => {
    stock[size] = "";
    return stock;
  }, {});

const toTitleCase = (value = "") =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : "";

const normalizeStock = (selectedSizes, stockBySize) =>
  selectedSizes.map((size) => ({
    size,
    quantity: Number(stockBySize[size] || 0),
  }));

export default function AddItems() {
  const { productId } = useParams();
  const isEditMode = Boolean(productId);
  const navigate = useNavigate();
  const [images, setImages] = useState([null, null, null, null]);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [stockBySize, setStockBySize] = useState(getInitialStock);
  const [bestseller, setBestseller] = useState(false);
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageTitle = isEditMode ? "Edit Product" : "Add New Product";
  const submitLabel = isEditMode ? "SAVE CHANGES" : "ADD";
  const submittingLabel = isEditMode ? "SAVING..." : "ADDING...";

  const imagePreviews = useMemo(
    () => images.map((image) => (image ? URL.createObjectURL(image) : "")),
    [images],
  );

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, [imagePreviews]);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    let isMounted = true;

    axiosInstance
      .get(`/api/product/${productId}`)
      .then((response) => {
        if (!isMounted || !response.data.success) {
          return;
        }

        const product = response.data.data;
        const nextStock = getInitialStock();

        product.stock?.forEach((item) => {
          nextStock[item.size] = String(item.quantity);
        });

        setName(product.name || "");
        setDescription(product.description || "");
        setPrice(String(product.price || ""));
        setCategory(toTitleCase(product.category) || "Men");
        setSubCategory(toTitleCase(product.subCategory) || "Topwear");
        setSelectedSizes(product.sizes || []);
        setStockBySize(nextStock);
        setBestseller(Boolean(product.isBestseller));
        setExistingImages(product.images || []);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to load product.");
        navigate("/list-items");
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isEditMode, navigate, productId]);

  const handleImageChange = (index, file) => {
    if (!file) return;
    const updated = [...images];
    updated[index] = file;
    setImages(updated);
  };

  const removeImage = (index) => {
    const updated = [...images];
    updated[index] = null;
    setImages(updated);
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) => {
      if (prev.includes(size)) {
        return prev.filter((selectedSize) => selectedSize !== size);
      }

      return [...prev, size];
    });
  };

  const updateStock = (size, quantity) => {
    setStockBySize((currentStock) => ({
      ...currentStock,
      [size]: quantity,
    }));
  };

  const validateForm = () => {
    if (!name.trim() || !description.trim()) {
      toast.error("Product name and description are required.");
      return false;
    }

    if (Number(price) <= 0) {
      toast.error("Price must be a valid number greater than zero.");
      return false;
    }

    if (selectedSizes.length === 0) {
      toast.error("Please select at least one product size.");
      return false;
    }

    const hasInvalidStock = selectedSizes.some((size) => {
      const quantity = Number(stockBySize[size]);
      return !Number.isInteger(quantity) || quantity < 0;
    });

    if (hasInvalidStock) {
      toast.error("Stock must be a whole number for every selected size.");
      return false;
    }

    if (!isEditMode && images.every((img) => img === null)) {
      toast.warning("Please upload at least one image");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setImages([null, null, null, null]);
    setSelectedSizes([]);
    setStockBySize(getInitialStock());
    setBestseller(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    const payload = {
      name,
      price,
      description,
      category: category.toLowerCase(),
      subCategory: subCategory.toLowerCase(),
      sizes: selectedSizes,
      stock: normalizeStock(selectedSizes, stockBySize),
      isBestseller: bestseller,
    };

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        const response = await axiosInstance.patch(
          `/api/product/${productId}`,
          payload,
        );

        if (response.data.success) {
          toast.success("Product updated successfully");
          navigate("/list-items");
        }
        return;
      }

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(
          key,
          Array.isArray(value) || typeof value === "boolean"
            ? JSON.stringify(value)
            : value,
        );
      });

      images.forEach((img) => {
        if (img) {
          formData.append("images", img);
        }
      });

      const response = await axiosInstance.post(
        "/api/product/add-product",
        formData,
      );

      if (response.data.success) {
        toast.success("Product added successfully");
        resetForm();
      }
    } catch (error) {
      toast.error(`${error.response?.data?.message || error.message}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {pageTitle}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Product Images
          </label>
          {isEditMode ? (
            <div className="flex gap-2">
              {existingImages.map((image) => (
                <div
                  key={image}
                  className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
                >
                  <img
                    src={image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative w-16 h-16 flex-shrink-0">
                  {img ? (
                    <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={imagePreviews[index]}
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
          )}
        </div>

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
                ₹
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Product Sizes and Stock
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {SIZES.map((size) => {
              const selected = selectedSizes.includes(size);

              return (
                <div
                  key={size}
                  className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${
                    selected
                      ? "border-gray-900 bg-white"
                      : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`h-10 w-12 rounded-lg text-sm font-medium border transition-all ${
                      selected
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-gray-100 text-gray-600 border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    disabled={!selected}
                    value={stockBySize[size]}
                    onChange={(e) => updateStock(size, e.target.value)}
                    placeholder="Stock"
                    className="w-24 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100 disabled:text-gray-400 transition-all"
                    aria-label={`${size} stock`}
                  />
                </div>
              );
            })}
          </div>
        </div>

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
          disabled={isSubmitting}
          className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-xl text-sm tracking-wide transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-500 disabled:active:scale-100"
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </form>
    </div>
  );
}
