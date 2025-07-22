"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  });

  const [subCategories, setSubCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🟢 Fetch categories and extract subcategories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://e-com-customizer.onrender.com/api/v1/showAllCategory");
        const data = await res.json();

        const allSubCategories = data.data
          ?.flatMap((cat) => cat.subCategory)
          ?.filter(Boolean);

        setSubCategories(allSubCategories || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

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

  return (
    <div className="mx-auto mt-8 max-w-xl rounded bg-white p-6 shadow-md">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Add New Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1 block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full rounded border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full rounded border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="w-full rounded border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Color</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
            placeholder="e.g. Red, Black"
            className="w-full rounded border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Brand</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            placeholder="e.g. Nike, Apple"
            className="w-full rounded border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Variant</label>
          <input
            type="text"
            name="variant"
            value={formData.variant}
            onChange={handleChange}
            required
            placeholder="e.g. 128GB, Large, 2023 Model"
            className="w-full rounded border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full rounded border px-4 py-2"
          />
          {preview && (
            <Image
              src={preview}
              alt="Preview"
              className="mt-2 h-32 w-32 rounded object-contain"
            />
          )}
        </div>

        <div>
          <label className="mb-1 block font-medium">Select SubCategory</label>
          <select
            name="subCategoryId"
            value={formData.subCategoryId}
            onChange={handleChange}
            required
            className="w-full rounded border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select SubCategory --</option>
            {subCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.title}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
