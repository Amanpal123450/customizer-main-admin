"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
  import { toast } from "@/components/ui/toast";

// 🟢 PROGRESS SECTION COMPONENT
function ProgressSection({ formData }) {
  const fields = [
    { name: "title", label: "Title" },
    { name: "description", label: "Description" },
    { name: "categoryId", label: "Category" },
    { name: "subCategoryId", label: "SubCategory" },
    { name: "price", label: "Price" },
    { name: "quantity", label: "Quantity" },
    { name: "color", label: "Color" },
    { name: "brand", label: "Brand" },
    { name: "variant", label: "Variant" },
    { name: "image", label: "images" },
  ];

  const isFilled = (name) => {
    if (name === "image") return formData.imageFilled;
    if (name === "description") {
      // Check if description has actual content (not just HTML tags)
      const textContent = formData.description.replace(/<[^>]*>/g, '').trim();
      return textContent !== "";
    }
    return formData[name] && formData[name].toString().trim() !== "";
  };

  return (
    <div className="w-full md:w-72 ml-0 md:ml-8 mt-8 md:mt-0 bg-gray-50 dark:bg-gray-800 rounded shadow p-6 flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-6 dark:text-white">Progress</h2>
      {/* --- Progress Steps --- */}
      <div
        className="relative flex flex-col items-center pt-2"
        style={{ minHeight: `${fields.length * 46}px` }}
      >
        {fields.map((field, idx) => {
          const filled = isFilled(field.name);
          return (
            <div key={field.name} className="flex flex-col items-center">
              {/* --- Connector Line Above --- */}
              {idx > 0 && (
                <motion.span
                  layout
                  initial={false}
                  animate={{
                    color: filled ? "#22C55E" : "#6B7280",
                    fontWeight: filled ? 700 : 500,
                    scale: filled ? 1.04 : 1,
                  }}
                  className="ml-2 dark:text-white"
                  style={{ fontSize: "1rem", display: "inline-block", marginBottom: "0.2rem" }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                />
              )}

              {/* --- Bullet/Point --- */}
              <motion.div
                layout
                initial={false}
                animate={{
                  backgroundColor: filled ? "#bbf7d0" : "#E5E7EB",
                  borderColor: filled ? "#4ADE80" : "#D1D5DB",
                  scale: filled ? 1.14 : 1,
                  boxShadow: filled ? "0 0 0px 6px #bbf7d066" : "0 0 0px 0px transparent",
                }}
                transition={{
                  duration: 0.24,
                  scale: { type: "spring", stiffness: 300, damping: 15 },
                }}
                className="z-10 border-2 flex items-center justify-center"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "9999px",
                  marginBottom: 8,
                  marginTop: 2,
                }}
              >
                <AnimatePresence>
                  {filled && (
                    <motion.svg
                      key="check"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 20 20"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <motion.path
                        d="M6 10.5l3 3 5-5"
                        stroke="#22C55E"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.2, delay: 0.04 }}
                      />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* --- Label --- */}
              <div style={{ minHeight: "22px", marginBottom: "0.7rem" }}>
                <motion.span
                  layout
                  initial={false}
                  animate={{
                    color: filled ? "#22C55E" : "#6B7280",
                    fontWeight: filled ? 700 : 500,
                    scale: filled ? 1.04 : 1,
                  }}
                  className="ml-2"
                  style={{ fontSize: "1rem", display: "inline-block" }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                >
                  {field.label}
                </motion.span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 🟢 Toast helper (simple fallback, replace with your preferred toast library if needed)
function showToast(message, type = "info") {
  if (typeof window !== "undefined") {
    if(type === "success") toast.success(message);
    else if(type === "error") toast.error(message);
    else toast.success(message); // fallback to success for info
  }
}

// 🟢 MAIN COMPONENT
export default function CreateProduct() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    descriptionText: "",
    price: "",
    categoryId: "",
    subCategoryId: "",
    quantity: "",
    color: "",
    brand: "",
    variant: "",
    unit: "",
    imageFilled: false,
  });

  const [categories, setCategories] = useState([]); // 🆕 Store all categories
  const [subCategories, setSubCategories] = useState([]); // Store filtered subcategories
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false); // 🆕 Loading state for subcategories
  const [Variants, setVariants] = useState([]);
  const [Brands, setBrands] = useState([]);
  const [Units, setUnits] = useState([]);

  // 🟢 Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://e-com-customizer.onrender.com/api/v1/showAllCategory");
        const data = await res.json();
        if (data.success) {
          setCategories(data.data || []);
          console.log("Fetched categories:", data.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        showToast("Failed to fetch categories", "error");
      }
    };
    fetchCategories();
  }, []);

  // 🟢 Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!formData.categoryId) {
        setSubCategories([]);
        return;
      }

      setLoadingSubCategories(true);
      try {
        const res = await fetch(
          `https://e-com-customizer.onrender.com/api/v1/fetchAllSubCategoryOfCategory/${formData.categoryId}`
        );
        const data = await res.json();
        console.log("Subcategory API response:", data);

        if (data.success && data.categoryDetails) {
          setSubCategories(data.categoryDetails.subCategory || []);
        } else {
          setSubCategories([]);
          showToast("No subcategories found", "error");
        }
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
        setSubCategories([]);
        showToast("Failed to fetch subcategories", "error");
      } finally {
        setLoadingSubCategories(false);
      }
    };

    fetchSubCategories();
  }, [formData.categoryId]);

  // 🟢 Reset subcategory when category changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, subCategoryId: "" }));
  }, [formData.categoryId]);

  // 🟢 Fetch Variants
  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const res = await fetch("https://e-com-customizer.onrender.com/api/v1/totalVariation");
        const data = await res.json();
        const activeVariants = (data.data || []).filter((variant) => variant.active);
        setVariants(activeVariants);
        if (activeVariants.length > 0) {
          setFormData((prev) => ({
            ...prev,
            variant: activeVariants[0]._id,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch variants:", err);
      }
    };
    fetchVariants();
  }, []);

  // 🟢 Fetch Brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("https://e-com-customizer.onrender.com/api/v1/totalBrands");
        const data = await res.json();
        const activeBrands = (data || []).filter((brand) => brand.active);
        setBrands(activeBrands);
        if (activeBrands.length > 0) {
          setFormData((prev) => ({
            ...prev,
            brand: activeBrands[0]._id,
          }));
        }
      } catch (error) {
        console.log("Failed to fetch brands:", error);
      }
    };
    fetchBrands();
  }, []);

  // 🟢 Fetch Units
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await fetch("https://e-com-customizer.onrender.com/api/v1/totalUnit");
        const data = await res.json();
        const activeUnits = (data.data || []).filter((unit) => unit.active);
        setUnits(activeUnits);
        if (activeUnits.length > 0) {
          setFormData((prev) => ({
            ...prev,
            unit: activeUnits[0]._id,
          }));
        }
      } catch (error) {
        console.log("Failed to fetch units:", error);
      }
    };
    fetchUnits();
  }, []);

  // 🟢 Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Handle Image Upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImageFiles(files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
    setFormData((prev) => ({ ...prev, imageFilled: true }));
  };

  // 🟢 Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("adminToken");
    if (!token) {
      showToast("Please login as admin", "error");
      setLoading(false);
      return;
    }

    // Validation
    if (!formData.categoryId) {
      showToast("Please select a category", "error");
      setLoading(false);
      return;
    }

    if (!formData.subCategoryId) {
      showToast("Please select a subcategory", "error");
      setLoading(false);
      return;
    }

    if (!imageFiles.length) {
      showToast("Please select at least one image", "error");
      setLoading(false);
      return;
    }
    // Validate description content
    if (!formData.descriptionText) {
      showToast("Please add a product description", "error");
      setLoading(false);
      return;
    }

    const form = new FormData();
    form.append("title", formData.title.trim());
    form.append("description", formData.description.trim());
    form.append("price", formData.price.toString());
    form.append("subCategoryId", formData.subCategoryId.trim());
    form.append("quantity", formData.quantity.toString());
    form.append("color", formData.color.trim());
    form.append("brand", formData.brand.trim());
    form.append("variant", formData.variant.trim());
    form.append("unit", formData.unit.trim());
    imageFiles.forEach((file) => {
      form.append("images", file);
    });

    try {
      const res = await fetch("https://e-com-customizer.onrender.com/api/v1/createProduct", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Create failed:", result);
        showToast(result.message || "Failed to create product", "error");
        return;
      }

      showToast("Product created successfully!", "success");
      router.push("/allproduct");
    } catch (err) {
      console.error("Error:", err);
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const formVariant = {
    hidden: { opacity: 0, y: 48 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.07, delayChildren: 0.1, duration: 0.4 } }
  };
  const itemVariant = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  // Quill modules
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"]
    ]
  };

  return (
    <div className="flex flex-col  dark:bg-gray-800 md:flex-row mx-auto mt-8 max-w-5xl">
      {/* --- Left: the form --- */}
      <div className="flex-1">
  <div className="mx-auto max-w-full rounded bg-white dark:bg-gray-900 p-6 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
            Add New Product
          </h1>
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl px-8 py-8 max-w-2xl mx-auto"
            variants={formVariant}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariant}>
              <label className="mb-1 block font-bold text-gray-800 dark:text-white">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Product Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
              />
            </motion.div>

            <motion.div variants={itemVariant}>
              <label className="block">
                <span className="text-gray-700 font-semibold dark:text-white">Description</span>
                <ReactQuill
                  theme="snow"
                  placeholder="Write detailed product description here..."
                  value={formData.description}
                  modules={modules}
                  onChange={(value) => {
                    // Remove HTML tags for plain text
                    const plainText = value.replace(/<[^>]+>/g, '').trim();
                    setFormData((prev) => ({
                      ...prev,
                      description: value,
                      descriptionText: plainText
                    }));
                  }}
                  className="mt-2 mb-5 rounded-lg focus:ring-2 focus:border-indigo-400 focus:ring-indigo-100 font-medium transition dark:bg-gray-800 dark:text-white"
                />
              </label>
            </motion.div>

            {/* 🆕 Category & SubCategory Section */}
            <motion.div variants={itemVariant} className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="mb-1 block font-bold text-gray-800 dark:text-white">
                  Select Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">-- Select Category First --</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* SubCategory Selection */}
              <div>
                <label className="mb-1 block font-bold text-gray-800 dark:text-white">
                  Select SubCategory <span className="text-red-500">*</span>
                </label>
                <select
                  name="subCategoryId"
                  value={formData.subCategoryId}
                  onChange={handleChange}
                  required
                  disabled={!formData.categoryId || loadingSubCategories}
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50 dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!formData.categoryId
                      ? "-- Select Category First --"
                      : loadingSubCategories
                        ? "-- Loading SubCategories --"
                        : "-- Select SubCategory --"
                    }
                  </option>
                  {subCategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.title}
                    </option>
                  ))}
                </select>

                {/* Show subcategory count */}
                {formData.categoryId && !loadingSubCategories && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {subCategories.length} subcategories available
                  </p>
                )}
              </div>
            </motion.div>

            {/* Price + Quantity in a row */}
            <motion.div variants={itemVariant} className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="mb-1 block font-bold text-gray-800 dark:text-white">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Product Price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block font-bold text-gray-800 dark:text-white">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Product Quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </motion.div>

            {/* Color + Brand + Variant in a row */}
            <motion.div variants={itemVariant} className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="mb-1 block font-bold text-gray-800 dark:text-white">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Red, Black, Blue"
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block font-bold text-gray-800 dark:text-white">Brand</label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">-- Select Brand --</option>
                  {Brands.map((brand) => (
                    <option className="text-black" key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="mb-1 block font-bold text-gray-800 dark:text-white">Variant</label>
                <select
                  name="variant"
                  value={formData.variant}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">-- Select Variant --</option>
                  {Variants.map((variant) => (
                    <option className="text-black" key={variant._id} value={variant._id}>
                      {variant.name}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* images Images */}
            <motion.div variants={itemVariant}>
              <label className="mb-1 block font-bold text-gray-800 dark:text-white">
                Product Images <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                required
                className="w-full rounded-lg border px-4 py-2 bg-gray-50 dark:bg-gray-800 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />

              {previews.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preview ({previews.length} image{previews.length !== 1 ? 's' : ''})
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {previews.map((src, idx) => (
                      <div key={idx} className="relative group">
                        <Image
                          src={src}
                          alt={`Preview ${idx + 1}`}
                          width={100}
                          height={100}
                          className="h-24 w-24 rounded-lg object-cover border-2 border-gray-200 shadow-sm group-hover:shadow-md transition-shadow"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-medium">Image {idx + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariant}
              type="submit"
              disabled={loading || !formData.categoryId || !formData.subCategoryId}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white text-lg transition hover:bg-blue-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Product...
                </div>
              ) : (
                "Create Product"
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>

      {/* --- Right: Progress section --- */}
      <ProgressSection formData={formData} />
    </div>
  );
}