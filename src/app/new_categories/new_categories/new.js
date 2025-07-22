"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCategory() {
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail); // Must match backend key
    }

    const token = localStorage.getItem("token"); // make sure token is stored on login

    try {
      const res = await fetch(
        "https://e-com-customizer.onrender.com/api/v1/createCategory",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "❌ Failed to create category");
        return;
      }

      alert("✅ Category created successfully");
      router.push("/admin/categories");
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-6">Create Category</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>

        {preview && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Preview:</p>
            <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded" />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Create Category
        </button>
      </form>
    </div>
  );
}
