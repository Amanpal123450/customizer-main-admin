"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// 🟢 PROGRESS SECTION COMPONENT
function ProgressSection({ formData }) {
  const fields = [
    { name: "title", label: "Title" },
    { name: "description", label: "Description" },
    { name: "price", label: "Price" },
    { name: "quantity", label: "Quantity" },
    { name: "color", label: "Color" },
    { name: "brand", label: "Brand" },
    { name: "variant", label: "Variant" },
    { name: "unit", label: "Unit" },
    { name: "subCategoryId", label: "SubCategory" },
    { name: "image", label: "Thumbnail" }, // special-case image
  ];

  const isFilled = (name) => {
    if (name === "image") return formData.imageFilled;
    return formData[name] && formData[name].toString().trim() !== "";
  };

  return (
    <div className="w-full md:w-72 ml-0 md:ml-8 mt-8 md:mt-0 bg-gray-50 rounded shadow p-6 flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-6">Progress</h2>
      {/* --- Progress Steps --- */}
      <div className="relative flex flex-col items-center pt-2" style={{ minHeight: `${fields.length * 46}px` }}>
        {fields.map((field, idx) => {
          const filled = isFilled(field.name);
          const prevFilled = idx === 0 ? false : isFilled(fields[idx - 1].name);

          return (
            <div key={field.name} className="flex flex-col items-center">
              {/* --- Connector Line Above --- */}
              {idx > 0 && (
                <motion.div
                  layout
                  initial={false}
                  animate={{
                    background:
                      prevFilled
                        ? "linear-gradient(to bottom, #4ADE80, #4ADE80)" // green-400
                        : "linear-gradient(to bottom, #E5E7EB, #E5E7EB)", // gray-200
                    height: "28px"
                  }}
                  transition={{ duration: 0.35 }}
                  className="w-1 rounded-full"
                  style={{
                    width: "3px", minHeight: "28px",
                    marginBottom: "0.2rem"
                  }}
                ></motion.div>
              )}

              {/* --- Bullet/Point --- */}
              <motion.div
                layout
                initial={false}
                animate={{
                  backgroundColor: filled ? "#bbf7d0" : "#E5E7EB", // green-200 : gray-200
                  borderColor: filled ? "#4ADE80" : "#D1D5DB", // green-400 : gray-300
                  scale: filled ? 1.14 : 1,
                  boxShadow: filled
                    ? "0 0 0px 6px #bbf7d066"
                    : "0 0 0px 0px transparent",
                }}
                transition={{
                  duration: 0.24,
                  scale: { type: "spring", stiffness: 300, damping: 15 },
                }}
                className={`z-10 border-2 flex items-center justify-center`}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "9999px",
                  marginBottom: 8,
                  marginTop: 2,
                }}
              >
                {/* Animated check if filled */}
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
                        stroke="#22C55E" // green-500
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
                    color: filled ? "#22C55E" : "#6B7280", // green-500 or gray-600
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

// 🟢 MAIN COMPONENT
export default function CreateProduct() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    subCategoryId: "",
    quantity: "",
    color: "",
    brand: "",
    variant: "",
    unit: "",
    imageFilled: false, // ➕ track thumbnail
  });

  const [subCategories, setSubCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [Variants, setVariants] = useState([]);
  const [Brands, setBrands] = useState([]);
  const [Units, setUnits] = useState([]);

  // 🟢 Fetch categories & extract subcategories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://e-com-customizer.onrender.com/api/v1/showAllCategory");
        const data = await res.json();
        const allSubCategories =
          data.data?.flatMap((cat) => cat.subCategory)?.filter(Boolean);
        setSubCategories(allSubCategories || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

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
    return () => setVariants([]);
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
    return () => setBrands([]);
  }, []);

  // 🟢 Fetch Units
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await fetch("https://e-com-customizer.onrender.com/api/v1/totalUnit");
        const data = await res.json();
        const activeUnits = (data.data || []).filter((unit) => unit.active);
        console.log(data.data)
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
    return () => setUnits([]);
  }, []);

  // 🟢 Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, imageFilled: true }));
  };

  // 🟢 Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token missing. Please log in.");
      setLoading(false);
      return;
    }

    if (!imageFile) {
      alert("Please select an image.");
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
    form.append("thumbnail", imageFile);

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
        alert(result.message || "❌ Product creation failed.");
        return;
      }

      alert("✅ Product created successfully!");
      router.push("/allproduct");
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
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

  // =======================
  // FINAL RETURN (2 columns)
  // =======================
  return (
    <div className="flex flex-col md:flex-row mx-auto mt-8 max-w-5xl">
      {/* --- Left: the form --- */}
      <div className="flex-1">
        <div className="mx-auto max-w-full rounded bg-white p-6 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
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
              <label className="mb-1 block font-bold text-gray-800">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Product Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50"
              />
            </motion.div>

            <motion.div variants={itemVariant}>
              <label className="mb-1 block font-bold text-gray-800">Description</label>
              <textarea
                name="description"
                placeholder="Product Description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50 resize-none"
              />
            </motion.div>

            {/* Price + Quantity in a row */}
            <motion.div variants={itemVariant} className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="mb-1 block font-bold text-gray-800">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Product Price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block font-bold text-gray-800">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Product Quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50"
                />
              </div>
            </motion.div>

            {/* Color + Brand + Variant in a row */}
            <motion.div variants={itemVariant} className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="mb-1 block font-bold text-gray-800">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Red, Black"
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block font-bold text-gray-800">Brand</label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50"
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
                <label className="mb-1 block font-bold text-gray-800">Variant</label>
                <select
                  name="variant"
                  value={formData.variant}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50"
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

            {/* Unit */}
            <motion.div variants={itemVariant} className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">

                <label className="mb-1 block font-bold text-gray-800">Unit</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}

                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50"
                >
                  <option value="">-- Select unit --</option>
                  {Units.map((unit) => (
                    <option className="text-black" key={unit._id} value={unit._id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>


            </motion.div>

            {/* Thumbnail */}
            <motion.div variants={itemVariant}>
              <label className="mb-1 block font-bold text-gray-800">Thumbnail Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full rounded-lg border px-4 py-2 bg-gray-50"
              />
              {preview && (
                <Image
                  src={preview}
                  alt="Preview"
                  width={128}
                  height={128}
                  className="mt-2 h-32 w-32 rounded object-contain"
                />
              )}
            </motion.div>

            {/* SubCategory */}
            <motion.div variants={itemVariant}>
              <label className="mb-1 block font-bold text-gray-800">Select SubCategory</label>
              <select
                name="subCategoryId"
                value={formData.subCategoryId}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50"
              >
                <option value="">-- Select SubCategory --</option>
                {subCategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.title}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.button
              variants={itemVariant}
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.03, backgroundColor: "#2563eb" }}
              className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white text-lg transition hover:bg-blue-700 shadow-sm"
              style={{ minHeight: 48 }}
            >
              {loading ? "Creating..." : "Create Product"}
            </motion.button>
          </motion.form>
        </div>
      </div>
      {/* --- Right: Progress section --- */}
      <ProgressSection formData={formData} />
    </div>
  );
}

