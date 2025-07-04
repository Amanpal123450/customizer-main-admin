"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function CategoryForm() {
  const [name, setName] = useState("");
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const token = localStorage.getItem("token");

      fetch(`https://ecomm-backend-7g4k.onrender.com/api/v1/getCategory/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setName(data.category?.title || ""); // Backend uses "title"
        })
        .catch((err) => console.error("Fetch error:", err));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const payload = { title: name };
    const method = id ? "PUT" : "POST";
    const url = id
      ? `https://ecomm-backend-7g4k.onrender.com/api/v1/updateCategory/${id}`
      : "https://ecomm-backend-7g4k.onrender.com/api/v1/createCategory";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "❌ Failed to submit");
        return;
      }

      alert(`✅ Category ${id ? "updated" : "created"} successfully`);
      router.push("/admin/categories");
    } catch (err) {
      console.error("Error submitting:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-6">
      <h1 className="text-2xl font-semibold mb-6">{id ? "Edit" : "Add"} Category</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
          <input
            type="text"
            placeholder="Enter category name"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          {id ? "Update Category" : "Create Category"}
        </button>
      </form>
    </div>
  );
}
