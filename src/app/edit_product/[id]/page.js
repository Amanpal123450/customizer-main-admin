"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";


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

  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🟡 Fetch product details to prefill form
  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     try {
  //       const res = await fetch(`https://e-com-customizer.onrender.com/api/v1/getProduct/${id}`);
  //       const data = await res.json();

  //       if (!res.ok) throw new Error(data.message || "Failed to fetch product");

  //       setForm({
  //         title: data.data.title || "",
  //         description: data.data.description || "",
  //         price: data.data.price || "",
  //         quantity: data.data.quantity || "",
  //         color: data.data.color || "",
  //       });

  //       setPreview(data.data.thumbnail);
  //     } catch (err) {
  //       console.error("Fetch error:", err);
  //       alert("❌ Failed to load product");
  //     }
  //   };

  //   if (id) fetchProduct();
  // }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
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

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://e-com-customizer.onrender.com/api/v1/updateProduct/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "❌ Failed to update");
        return;
      }

      alert("✅ Product updated successfully!");
      router.push("/allproduct");
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
          required
        />

        <input
          type="text"
          name="color"
          placeholder="Color"
          value={form.color}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
          required
        />

        <div>
          <label className="block text-sm font-medium">Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full rounded border px-3 py-2"
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

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
