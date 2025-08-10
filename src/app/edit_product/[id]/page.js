"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";  
import "toastify-js/src/toastify.css";
import Toastify from "toastify-js";


const showToast = (text, type = "success") => {
  Toastify({
    text,
    duration: 3000,
    gravity: "top",
    position: "right",
    close: true,
    backgroundColor: type === "success" ? "#4BB543" : "#FF3E3E", // green or red
  }).showToast();
};

// Progress tracker (matches your creation page)
function ProgressSection({ formData }) {
  const fields = [
    { name: "title", label: "Title" },
    { name: "description", label: "Description" },
    { name: "price", label: "Price" },
    { name: "quantity", label: "Quantity" },
    { name: "color", label: "Color" },
    { name: "image", label: "images" },
  ];

  const isFilled = (name) => {
    if (name === "image") return !!formData.imageFilled;
    return formData[name] && formData[name].toString().trim() !== "";
  };

  return (
    <div className="w-full md:w-72 ml-0 md:ml-8 mt-8 md:mt-0 bg-gray-50 rounded shadow p-6 flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-6">Progress</h2>
      <div className="relative flex flex-col items-center pt-2" style={{ minHeight: `${fields.length * 46}px` }}>
        {fields.map((field, idx) => {
          const filled = isFilled(field.name);
          const prevFilled = idx === 0 ? false : isFilled(fields[idx - 1].name);
          return (
            <div key={field.name} className="flex flex-col items-center">
              {idx > 0 && (
                <motion.div
                  layout
                  initial={false}
                  animate={{
                    background: prevFilled ? "linear-gradient(to bottom, #4ADE80, #4ADE80)" : "linear-gradient(to bottom, #E5E7EB, #E5E7EB)",
                    height: "28px"
                  }}
                  transition={{ duration: 0.35 }}
                  className="w-1 rounded-full"
                  style={{ width: "3px", minHeight: "28px", marginBottom: "0.2rem" }}
                ></motion.div>
              )}
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
                className={`z-10 border-2 flex items-center justify-center`}
                style={{ width: 28, height: 28, borderRadius: "9999px", marginBottom: 8, marginTop: 2 }}
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

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    color: "",
  });
  const [images, setimages] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // See your provided logic; just add imageFilled for the progress section
  const [imageFilled, setImageFilled] = useState(false);

  // Prefill form with existing product data for editing
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product for id:', id);
        const res = await fetch(`http://localhost:4000/api/v1/getProduct/${id}`);
        console.log('Response status:', res.status);
        const data = await res.json();
        console.log('Fetched data:', data);
        if (!res.ok) throw new Error(data.message || "Failed to fetch product");
        setForm({
          title: data.data.title || "",
          description: data.data.description || "",
          price: data.data.price || "",
          quantity: data.data.quantity || "",
          color: data.data.color || "",
        });
        setPreview(data.data.images);
        setImageFilled(!!data.data.images);
      } catch (err) {
        console.error('Failed to load product:', err);
        showToast(" Failed to load product");
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setimages(file);
      setPreview(URL.createObjectURL(file));
      setImageFilled(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("quantity", form.quantity);
    formData.append("color", form.color);
    if (images) {
      formData.append("images", images);
    }
    try {
  const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `/api/v1/updateProduct/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || " Failed to update");
        return;
      }
      showToast(" Product updated successfully!");
      router.push("/allproduct");
    } catch (err) {
      showToast(" Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // For the progress section, map your form state and thumybnail status
  const progressFormData = {
    ...form,
    imageFilled,
  };

  return (
    <div className="flex flex-col md:flex-row mx-auto mt-8 max-w-5xl">
      {/* --- Left: the form --- */}
      <div className="flex-1">
        <div className="mx-auto max-w-full rounded bg-white p-6 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Edit Product
          </h1>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl px-8 py-8 max-w-2xl mx-auto"
          >
            <div>
              <label className="mb-1 block font-bold text-gray-800">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Product Title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold text-gray-800">Description</label>
              <textarea
                name="description"
                placeholder="Product Description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50 resize-none"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="mb-1 block font-bold text-gray-800">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Product Price"
                  value={form.price}
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
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block font-bold text-gray-800">Color</label>
              <input
                type="text"
                name="color"
                value={form.color}
                onChange={handleChange}
                required
                placeholder="e.g. Red, Black"
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50"
              />
            </div>
            {/* images */}
            <div>
              <label className="mb-1 block font-bold text-gray-800">images Image</label>
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
            </div>
            <div className="buttons flex gap-4">

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white text-lg transition hover:bg-blue-700 shadow-sm"
                style={{ minHeight: 48 }}
              >
                {loading ? "Updating..." : "Update Product"}
              </button>

            </div>
          </form>
        </div>
      </div>
      {/* --- Right: Progress section --- */}
      <ProgressSection formData={progressFormData} />
    </div>
  );
}
