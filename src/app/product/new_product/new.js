"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProduct() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    subCategoryId: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  
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
    form.append("thumbnail", imageFile); 

    try {
      const res = await fetch(
        "https://ecomm-backend-7g4k.onrender.com/api/v1/createProduct",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, 
          },
          body: form,
        }
      );

      const result = await res.json();

      if (!res.ok) {
        console.error("Create failed:", result);
        alert(result.message || "❌ Product creation failed.");
        return;
      }

      alert("✅ Product created successfully!");
      router.push("/admin/products");
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Add New Product</h1>

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
          <label className="mb-1 block font-medium">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full rounded border px-4 py-2"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 h-32 w-32 rounded object-cover"
            />
          )}
        </div>

        <div>
          <label className="mb-1 block font-medium">SubCategory ID</label>
          <input
            type="text"
            name="subCategoryId"
            value={formData.subCategoryId}
            onChange={handleChange}
            required
            className="w-full rounded border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
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
