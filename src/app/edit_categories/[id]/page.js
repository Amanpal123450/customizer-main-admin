"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import "toastify-js/src/toastify.css";
import Toastify from "toastify-js";


const showToast = (text, type = "success") => {
  Toastify({
    text,
    duration: 3000,
    gravity: "top",
    position: "right",
    close: true,
    backgroundColor:
      type === "success"
        ? "#4BB543"
        : type === "info"
        ? "#3498db"
        : "#FF3E3E",
  }).showToast();
};


export default function EditCategoryPage() {
  const API_BASE = "https://ecomm-backend-7g4k.onrender.com/api/v1";
  const API_UPDATE = "https://e-com-customizer.onrender.com/api/v1";
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState("");
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch subcategory details and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      try {
        if (id) {
          const res = await fetch(`${API_BASE}/getSubCategory/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          const sub = data.subCategory;
          setTitle(sub?.title || "");
          setCategoryId(sub?.category || "");
          setImages(sub?.images?.[0] || "");
          setPreview(sub?.images?.[0] || null);
        }
        // Fetch categories
        const catRes = await fetch(`${API_BASE}/showAllCategory`);
        const catData = await catRes.json();
        setCategories(catData.data || []);
      } catch (err) {
        showToast("Error fetching data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("adminToken");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("categoryId", categoryId);
    if (imageFile) {
      formData.append("images", imageFile);
    }
    try {
      const res = await fetch(
        `${API_UPDATE}/updateCategory/${id}`,
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
        showToast(data.message || "Failed to update", "error");
        return;
      }
      showToast("✅ SubCategory updated successfully", "success");
      router.push("/categories");
    } catch (err) {
      showToast("Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="max-w-xl mx-auto mt-6 bg-white dark:bg-gray-900 p-6 shadow-md rounded">
      <h1 className="text-2xl font-semibold mb-6">Edit SubCategory</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
            disabled={loading}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full rounded border px-4 py-2"
            disabled={loading}
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 h-32 w-32 rounded object-cover"
            />
          )}
        </div>
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update SubCategory"}
        </button>
      </form>
    </div>
  );
}

