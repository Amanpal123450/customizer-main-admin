"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://ecomm-backend-7g4k.onrender.com/api/v1/showAllCategory");
        const data = await res.json();
        console.log(data);
        setCategories(data.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await fetch(`https://ecomm-backend-7g4k.onrender.com/api/v1/deleteCategory/${id}`, {
          method: "DELETE",
           headers: {
          Authorization: `Bearer ${token}`,
        },
        });
        setCategories((prev) => prev.filter((c) => c._id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      <Link
        href="/new_categories"
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Add Category
      </Link>

      <div className="overflow-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-2">Image</th>
              <th className="p-2">Title</th>
              
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-b">
                <td className="p-2">
                  <img
                    src={cat.images}
                    alt={cat.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-2">{cat.title}</td>
                {/* <td className="p-2">
                  {Array.isArray(cat.subCategory) && cat.subCategory.length > 0
                    ? cat.subCategory.map((s, i) => (
                        <span key={i}>
                          {s.title || s._id || s}
                          {i < cat.subCategory.length - 1 && ", "}
                        </span>
                      ))
                    : "—"}
                </td> */}
                <td className="p-2 space-x-3">
                  <Link
                    href={`/edit_categories/${cat._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
