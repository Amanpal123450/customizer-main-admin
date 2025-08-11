"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "@/components/ui/toast";


export default function EditCategoryPage() {
  const API_BASE = "https://ecomm-backend-7g4k.onrender.com/api/v1";
  const API_UPDATE = "https://e-com-customizer.onrender.com/api/v1";
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [images, setImages] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch category details
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      try {
        if (id) {
          const res = await fetch(`${API_BASE}/categoryPageDetails/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await res.json();
          const cat = data.category;
          setTitle(cat?.title || "");
          setImages(cat?.images?.[0] || "");
          setPreview(cat?.images?.[0] || null);
        }
      } catch (err) {
        toast.error("Failed to load category details. Please try again.");
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
      toast.success("Category updated successfully!");
      router.push("/categories");
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="max-w-xl mx-auto mt-6 bg-white dark:bg-gray-900 p-6 shadow-md rounded">
  <h1 className="text-2xl font-semibold mb-6">Edit Category</h1>
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
  {/* No category dropdown needed for editing a category itself */}
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

